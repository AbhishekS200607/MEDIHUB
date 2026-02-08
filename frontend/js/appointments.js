import { db } from './firebase-config.js';
import { collection, query, where, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { apiCall, showToast, showLoading, hideLoading, formatDate, formatTime } from './utils.js';

// Book appointment
export async function bookAppointment(doctorId, time, date) {
  try {
    const data = await apiCall('/appointments/book', {
      method: 'POST',
      body: JSON.stringify({ doctorId, time, date })
    });
    return data.appointment;
  } catch (error) {
    throw error;
  }
}

// Get current token
export async function getCurrentToken(doctorId) {
  try {
    const data = await apiCall(`/appointments/current-token/${doctorId}`);
    return data.currentToken;
  } catch (error) {
    console.error('Failed to get current token:', error);
    return 0;
  }
}

// Get queue
export async function getQueue(doctorId) {
  try {
    const data = await apiCall(`/appointments/queue/${doctorId}`);
    return data.queue;
  } catch (error) {
    console.error('Failed to get queue:', error);
    return [];
  }
}

// Get my appointments
export async function getMyAppointments() {
  try {
    const data = await apiCall('/appointments/my-appointments');
    return data.appointments;
  } catch (error) {
    console.error('Failed to get appointments:', error);
    return [];
  }
}

// Update appointment status
export async function updateAppointmentStatus(appointmentId, status) {
  try {
    await apiCall(`/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  } catch (error) {
    throw error;
  }
}

// Real-time queue listener
export function listenToQueue(doctorId, callback) {
  const today = new Date().toISOString().split('T')[0];
  const q = query(
    collection(db, 'appointments'),
    where('doctorId', '==', doctorId),
    where('bookingDate', '==', today),
    orderBy('tokenNumber', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const queue = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(queue);
  }, (error) => {
    console.error('Queue listener error:', error);
    callback([]);
  });
}

// Real-time current token listener
export function listenToCurrentToken(doctorId, callback) {
  const today = new Date().toISOString().split('T')[0];
  const tokenDocId = `${doctorId}_${today}`;
  
  const q = query(
    collection(db, 'tokens'),
    where('doctorId', '==', doctorId),
    where('date', '==', today)
  );
  
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(0);
      return;
    }
    const tokenDoc = snapshot.docs[0];
    const currentToken = tokenDoc.data().current || 0;
    callback(currentToken);
  }, (error) => {
    console.error('Token listener error:', error);
    callback(0);
  });
}

// Initialize appointment booking (for patient dashboard)
export function initAppointmentBooking() {
  const bookingForm = document.getElementById('bookingForm');
  const dateSelect = document.getElementById('dateSelect');
  
  if (!bookingForm) return;
  
  // Set min date to today
  if (dateSelect) {
    const today = new Date().toISOString().split('T')[0];
    dateSelect.min = today;
    dateSelect.value = today;
  }
  
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    try {
      const doctorId = document.getElementById('doctorSelect').value;
      const time = document.getElementById('timeSelect').value;
      const date = dateSelect ? dateSelect.value : new Date().toISOString().split('T')[0];
      
      if (!doctorId || !time) {
        throw new Error('Please select doctor and time');
      }
      
      const appointment = await bookAppointment(doctorId, time, date);
      showToast(`Appointment booked! Your token number is ${appointment.tokenNumber}`, 'success');
      
      bookingForm.reset();
      if (dateSelect) dateSelect.value = new Date().toISOString().split('T')[0];
      loadMyAppointments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      hideLoading(submitBtn);
    }
  });
}

// Load doctors list
export async function loadDoctors() {
  try {
    const response = await fetch('/api/doctors');
    const data = await response.json();
    
    const doctorSelect = document.getElementById('doctorSelect');
    if (doctorSelect) {
      doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
      data.doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        doctorSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Failed to load doctors:', error);
  }
}

// Load my appointments
export async function loadMyAppointments() {
  try {
    const appointments = await getMyAppointments();
    const container = document.getElementById('appointmentsList');
    
    if (!container) return;
    
    if (appointments.length === 0) {
      container.innerHTML = '<p class="text-slate-400 text-center py-4">No appointments found</p>';
      return;
    }
    
    container.innerHTML = appointments.map(apt => {
      const date = document.createElement('div');
      date.textContent = formatDate(apt.bookingDate);
      const time = document.createElement('div');
      time.textContent = apt.time;
      const status = document.createElement('div');
      status.textContent = apt.status;
      
      return `
      <div class="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
        <div class="flex items-center gap-4">
          <div class="bg-primary/10 text-primary size-12 rounded-lg flex items-center justify-center font-black text-lg">
            #${apt.tokenNumber}
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900">${date.textContent} at ${time.textContent}</p>
            <p class="text-xs text-slate-500">Token #${apt.tokenNumber}</p>
          </div>
        </div>
        <span class="px-3 py-1 ${getStatusBadge(apt.status)} rounded-full text-[10px] font-bold uppercase">${status.textContent}</span>
      </div>
    `}).join('');
  } catch (error) {
    console.error('Failed to load appointments:', error);
  }
}

function getStatusBadge(status) {
  const badges = {
    waiting: 'bg-amber-100 text-amber-700',
    called: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return badges[status] || 'bg-slate-100 text-slate-500';
}

function getStatusColor(status) {
  const colors = {
    waiting: 'warning',
    called: 'info',
    completed: 'success',
    cancelled: 'danger'
  };
  return colors[status] || 'secondary';
}
