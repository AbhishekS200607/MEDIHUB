const express = require('express');
const router = express.Router();
const { db } = require('../models/firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users')
      .where('role', '==', 'doctor')
      .get();
    
    const doctors = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email
    }));
    
    res.json({ doctors });
  } catch (error) {
    console.error('Doctors fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get doctor schedule
router.get('/:id/schedule', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    const snapshot = await db.collection('appointments')
      .where('doctorId', '==', id)
      .where('bookingDate', '==', today)
      .orderBy('tokenNumber', 'asc')
      .get();
    
    const schedule = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ schedule, date: today });
  } catch (error) {
    console.error('Schedule fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Get doctor statistics
router.get('/:id/stats', verifyToken, requireRole('doctor', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    const todaySnapshot = await db.collection('appointments')
      .where('doctorId', '==', id)
      .where('bookingDate', '==', today)
      .get();
    
    const totalToday = todaySnapshot.size;
    const completed = todaySnapshot.docs.filter(doc => doc.data().status === 'completed').length;
    const waiting = todaySnapshot.docs.filter(doc => doc.data().status === 'waiting').length;
    
    res.json({ 
      stats: {
        totalToday,
        completed,
        waiting,
        date: today
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
