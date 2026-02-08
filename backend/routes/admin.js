const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { db } = require('../models/firebase');

// Get current doctor registration code
router.get('/doctor-code', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const configDoc = await db.collection('config').doc('doctorRegistration').get();
    
    if (!configDoc.exists) {
      // Initialize with default code
      await db.collection('config').doc('doctorRegistration').set({
        code: 'MEDIHUB2024',
        updatedAt: new Date(),
        updatedBy: req.user.uid
      });
      return res.json({ code: 'MEDIHUB2024' });
    }

    res.json({ code: configDoc.data().code });
  } catch (error) {
    console.error('Get doctor code error:', error);
    res.status(500).json({ error: 'Failed to get registration code' });
  }
});

// Generate random doctor registration code
router.post('/doctor-code/generate', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const code = generateRandomCode();
    
    await db.collection('config').doc('doctorRegistration').set({
      code,
      updatedAt: new Date(),
      updatedBy: req.user.uid
    });

    res.json({ code });
  } catch (error) {
    console.error('Generate code error:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// Set custom doctor registration code
router.put('/doctor-code', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.length < 6) {
      return res.status(400).json({ error: 'Code must be at least 6 characters' });
    }

    await db.collection('config').doc('doctorRegistration').set({
      code,
      updatedAt: new Date(),
      updatedBy: req.user.uid
    });

    res.json({ code });
  } catch (error) {
    console.error('Update code error:', error);
    res.status(500).json({ error: 'Failed to update code' });
  }
});

// Verify doctor registration code (public endpoint for registration)
router.post('/doctor-code/verify', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const configDoc = await db.collection('config').doc('doctorRegistration').get();
    
    if (!configDoc.exists) {
      return res.status(404).json({ error: 'Registration code not configured' });
    }

    const validCode = configDoc.data().code;
    const isValid = code === validCode;

    res.json({ valid: isValid });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

// Get all doctors (admin only)
router.get('/doctors', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'doctor').get();
    const doctors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to get doctors' });
  }
});

// Get users by role (admin only)
router.get('/users', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.query;
    let query = db.collection('users');
    
    if (role) {
      query = query.where('role', '==', role);
    }
    
    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Toggle doctor status (activate/restrict)
router.put('/doctors/:doctorId/status', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { active } = req.body;

    await db.collection('users').doc(doctorId).update({ active });
    res.json({ message: 'Doctor status updated' });
  } catch (error) {
    console.error('Update doctor status error:', error);
    res.status(500).json({ error: 'Failed to update doctor status' });
  }
});

// Delete doctor
router.delete('/doctors/:doctorId', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Delete doctor's appointments
    const appointmentsSnapshot = await db.collection('appointments')
      .where('doctorId', '==', doctorId)
      .get();
    
    const batch = db.batch();
    appointmentsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    
    // Delete doctor user
    batch.delete(db.collection('users').doc(doctorId));
    
    await batch.commit();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});

// Get hospital configuration
router.get('/hospital-config', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const configDoc = await db.collection('config').doc('hospital').get();
    
    if (!configDoc.exists) {
      return res.json({ config: null });
    }

    res.json({ config: configDoc.data() });
  } catch (error) {
    console.error('Get hospital config error:', error);
    res.status(500).json({ error: 'Failed to get hospital configuration' });
  }
});

// Update hospital configuration
router.put('/hospital-config', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;

    if (!name || !address || !phone || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await db.collection('config').doc('hospital').set({
      name,
      address,
      phone,
      email,
      updatedAt: new Date(),
      updatedBy: req.user.uid
    });

    res.json({ message: 'Hospital configuration updated' });
  } catch (error) {
    console.error('Update hospital config error:', error);
    res.status(500).json({ error: 'Failed to update hospital configuration' });
  }
});

function generateRandomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = router;
