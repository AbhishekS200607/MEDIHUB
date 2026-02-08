// Utility Functions
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// Get auth token
export async function getAuthToken() {
  const { auth } = await import('./firebase-config.js');
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
}

// API call wrapper
export async function apiCall(endpoint, options = {}) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Show toast notification
export function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer') || createToastContainer();
  
  const colors = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500'
  };
  
  const toast = document.createElement('div');
  toast.className = `${colors[type] || colors.info} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center justify-between animate-slide-in`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.remove()">
      <span class="text-xl">&times;</span>
    </button>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end';
  container.style.cssText = 'max-width: 400px;';
  document.body.appendChild(container);
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
      transition: all 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
  
  return container;
}

// Show loading spinner
export function showLoading(element) {
  element.disabled = true;
  element.dataset.originalText = element.innerHTML;
  element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
}

export function hideLoading(element) {
  element.disabled = false;
  element.innerHTML = element.dataset.originalText || element.innerHTML;
}

// Format date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format time
export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Check authentication
export async function checkAuth() {
  const { auth } = await import('./firebase-config.js');
  return new Promise((resolve) => {
    auth.onAuthStateChanged(user => resolve(user));
  });
}

// Redirect if not authenticated
export async function requireAuth() {
  const user = await checkAuth();
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  return user;
}

// Get user profile
export async function getUserProfile() {
  try {
    const data = await apiCall('/auth/profile');
    return data.user;
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
}

// Logout
export async function logout() {
  const { auth } = await import('./firebase-config.js');
  await auth.signOut();
  window.location.href = '/login';
}
