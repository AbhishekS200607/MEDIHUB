import { auth, googleProvider } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { showToast, showLoading, hideLoading } from './utils.js';

// Login with email/password
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Register with email/password
export async function registerWithEmail(email, password, name, role = 'patient', specialization = null) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile
    const token = await user.getIdToken();
    const body = { name, role };
    if (specialization) body.specialization = specialization;
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create profile');
    }
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Login with Google
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if profile exists, create if not
    const token = await result.user.getIdToken();
    const profileResponse = await fetch('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (profileResponse.status === 404) {
      // Create profile
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: result.user.displayName,
          role: 'patient'
        })
      });
    }
    
    return result.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Get user-friendly error messages
function getAuthErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'Email already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-not-found': 'User not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/popup-closed-by-user': 'Login cancelled',
    'auth/network-request-failed': 'Network error, please try again'
  };
  return messages[code] || 'Authentication failed';
}

// Initialize login page
if (document.getElementById('loginForm')) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const googleLoginBtn = document.getElementById('googleLogin');
  const googleRegisterBtn = document.getElementById('googleRegister');
  
  // Login form
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    try {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const user = await loginWithEmail(email, password);
      const token = await user.getIdToken();
      
      // Get user profile to check role
      const profileResponse = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileResponse.json();
      
      showToast('Login successful!', 'success');
      
      setTimeout(() => {
        // Redirect based on role
        if (profileData.user.role === 'admin') {
          window.location.href = '/admin.html';
        } else if (profileData.user.role === 'doctor') {
          window.location.href = '/doctor.html';
        } else {
          window.location.href = '/';
        }
      }, 1000);
    } catch (error) {
      showToast(error.message, 'error');
      hideLoading(submitBtn);
    }
  });
  
  // Register form
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    try {
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      
      await registerWithEmail(email, password, name);
      showToast('Registration successful!', 'success');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      showToast(error.message, 'error');
      hideLoading(submitBtn);
    }
  });
  
  // Google login
  googleLoginBtn?.addEventListener('click', async () => {
    showLoading(googleLoginBtn);
    try {
      await loginWithGoogle();
      showToast('Login successful!', 'success');
      setTimeout(() => window.location.href = '/', 1000);
    } catch (error) {
      showToast(error.message, 'error');
      hideLoading(googleLoginBtn);
    }
  });
  
  googleRegisterBtn?.addEventListener('click', async () => {
    showLoading(googleRegisterBtn);
    try {
      await loginWithGoogle();
      showToast('Registration successful!', 'success');
      setTimeout(() => window.location.href = '/', 1000);
    } catch (error) {
      showToast(error.message, 'error');
      hideLoading(googleRegisterBtn);
    }
  });
}
