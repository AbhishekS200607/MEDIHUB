const express = require('express');
const router = express.Router();
const { db, getNextToken, getCurrentToken } = require('../models/firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

// Book appointment
router.post('/book', verifyToken, requireRole('patient'), async (req, res) => {
  try {
    const { doctorId, time, date } = req.body;
    
    if (!doctorId || !time) {
      return res.status(400).json({ error: 'Doctor ID and time are required' });
    }
    
    const bookingDate = date || new Date().toISOString().split('T')[0];
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userName = userDoc.data()?.name || 'Unknown';
    
    // Get next token number
    const tokenNumber = await getNextToken(doctorId, bookingDate);
    
    const appointment = {
      userId: req.user.uid,
      userName,
      doctorId,
      tokenNumber,
      bookingDate,
      time,
      status: 'waiting',
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('appointments').add(appointment);
    
    res.json({ 
      message: 'Appointment booked successfully', 
      appointment: { id: docRef.id, ...appointment }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Get current token for doctor
router.get('/current-token/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    const currentToken = await getCurrentToken(doctorId, today);
    
    res.json({ currentToken, date: today });
  } catch (error) {
    console.error('Token fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch current token' });
  }
});

// Get queue for doctor
router.get('/queue/:doctorId', verifyToken, requireRole('doctor', 'admin'), async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    const snapshot = await db.collection('appointments')
      .where('doctorId', '==', doctorId)
      .where('bookingDate', '==', today)
      .orderBy('tokenNumber', 'asc')
      .get();
    
    const queue = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ queue });
  } catch (error) {
    console.error('Queue fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// Get user's appointments
router.get('/my-appointments', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('appointments')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    
    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ appointments });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Update appointment status (doctor only)
router.patch('/:id/status', verifyToken, requireRole('doctor', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['waiting', 'called', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await db.collection('appointments').doc(id).update({ 
      status,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get appointment by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('appointments').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const appointment = doc.data();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userRole = userDoc.data()?.role;
    
    // Only owner, doctor, or admin can view
    if (appointment.userId !== req.user.uid && userRole !== 'doctor' && userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ appointment: { id: doc.id, ...appointment } });
  } catch (error) {
    console.error('Appointment fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

module.exports = router;
