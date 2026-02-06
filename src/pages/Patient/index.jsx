import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRealTime, useFirestore } from '../../hooks';
import { Card, Badge, Loader, Button, Input, Modal } from '../../components/common';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';

export const PatientDashboard = () => {
  const { userProfile } = useAuth();
  const { data: appointments, loading } = useRealTime('appointments', [
    { field: 'patientId', operator: '==', value: userProfile?.uid }
  ]);

  const getStatusVariant = (status) => {
    const variants = {
      waiting: 'warning',
      'in-progress': 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return variants[status] || 'default';
  };

  if (loading) return <Loader className="h-screen" />;

  const upcomingAppointments = appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-clinical-800 mb-2">Welcome, {userProfile?.name}</h1>
      <p className="text-clinical-600 mb-8">Manage your appointments and health records</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-clinical-600 text-sm">Total Appointments</p>
              <p className="text-3xl font-bold text-clinical-800 mt-1">{appointments.length}</p>
            </div>
            <Calendar className="text-primary-600" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-clinical-600 text-sm">Upcoming</p>
              <p className="text-3xl font-bold text-clinical-800 mt-1">{upcomingAppointments.length}</p>
            </div>
            <Clock className="text-yellow-600" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-clinical-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-clinical-800 mt-1">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <User className="text-green-600" size={40} />
          </div>
        </Card>
      </div>

      <Card title="Recent Appointments">
        {appointments.length === 0 ? (
          <p className="text-clinical-500 text-center py-8">No appointments yet. Book your first appointment!</p>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 5).map(appointment => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-clinical-50 rounded-lg">
                <div>
                  <p className="font-semibold text-clinical-800">{appointment.doctorName}</p>
                  <p className="text-sm text-clinical-600">{appointment.specialty}</p>
                  <p className="text-sm text-clinical-500 mt-1">
                    {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                  </p>
                </div>
                <Badge variant={getStatusVariant(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export const FindDoctor = () => {
  const { userProfile } = useAuth();
  const { data: doctors, loading } = useRealTime('users', [
    { field: 'role', operator: '==', value: 'doctor' }
  ]);
  const { addDocument } = useFirestore('appointments');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '' });
  const [filter, setFilter] = useState('');
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    if (!bookingData.date || !bookingData.time) {
      alert('Please select both date and time');
      return;
    }
    
    setBooking(true);
    try {
      await addDocument({
        patientId: userProfile.uid,
        patientName: userProfile.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty || 'General',
        date: bookingData.date,
        time: bookingData.time,
        status: 'waiting'
      });
      setSelectedDoctor(null);
      setBookingData({ date: '', time: '' });
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book appointment: ' + error.message);
    } finally {
      setBooking(false);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    !filter || d.specialty?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <Loader className="h-screen" />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-clinical-800 mb-6">Find a Doctor</h1>
      
      <Input
        placeholder="Filter by specialty..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <Card key={doctor.id}>
            <div className="flex items-start gap-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Stethoscope className="text-primary-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-clinical-800">{doctor.name}</h3>
                <p className="text-sm text-clinical-600">{doctor.specialty || 'General'}</p>
                <Button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="mt-4 w-full"
                >
                  <Calendar size={16} className="inline mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title="Book Appointment"
      >
        <div>
          <p className="text-clinical-600 mb-4">
            Booking with Dr. {selectedDoctor?.name}
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-clinical-700 mb-1">Date</label>
            <input
              type="date"
              className="input-field"
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-clinical-700 mb-1">Time</label>
            <input
              type="time"
              className="input-field"
              value={bookingData.time}
              onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
            />
          </div>
          <Button onClick={handleBook} className="w-full" disabled={booking || !bookingData.date || !bookingData.time}>
            {booking ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export const MyBookings = () => {
  const { userProfile } = useAuth();
  const { data: appointments, loading } = useRealTime('appointments', [
    { field: 'patientId', operator: '==', value: userProfile?.uid }
  ]);

  const getStatusVariant = (status) => {
    const variants = {
      waiting: 'warning',
      'in-progress': 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return variants[status] || 'default';
  };

  if (loading) return <Loader className="h-screen" />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-clinical-800 mb-6">My Bookings</h1>
      
      {appointments.length === 0 ? (
        <Card>
          <p className="text-clinical-500 text-center py-8">No bookings found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map(appointment => (
            <Card key={appointment.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-clinical-800">{appointment.doctorName}</h3>
                  <p className="text-sm text-clinical-600">{appointment.specialty}</p>
                  <p className="text-sm text-clinical-500 mt-2">
                    {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                  </p>
                </div>
                <Badge variant={getStatusVariant(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
