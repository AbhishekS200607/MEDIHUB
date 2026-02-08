const express = require('express');
const router = express.Router();
const { db } = require('../models/firebase');
const { verifyToken } = require('../middleware/auth');

// Register user (create user profile in Firestore)
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { name, phone, role, specialization } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Allow doctor or patient role
    const userRole = (role === 'doctor') ? 'doctor' : 'patient';
    
    const userData = {
      uid: req.user.uid,
      email: req.user.email,
      name,
      role: userRole,
      phone: phone || '',
      createdAt: new Date().toISOString()
    };
    
    // Add specialization for doctors
    if (userRole === 'doctor' && specialization) {
      userData.specialization = specialization;
    }
    
    await db.collection('users').doc(req.user.uid).set(userData);
    
    res.json({ message: 'User registered successfully', user: userData });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    res.json({ user: userDoc.data() });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    // Prevent role changes via profile update
    
    await db.collection('users').doc(req.user.uid).update(updates);
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
