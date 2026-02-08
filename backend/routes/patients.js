const express = require('express');
const router = express.Router();
const { db } = require('../models/firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

// Create patient record
router.post('/', verifyToken, requireRole('admin', 'doctor'), async (req, res) => {
  try {
    const { name, phone, email, address, medicalHistory } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    
    const patient = {
      name,
      phone,
      email: email || '',
      address: address || '',
      medicalHistory: medicalHistory || '',
      appointments: [],
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid
    };
    
    const docRef = await db.collection('patients').add(patient);
    
    res.json({ 
      message: 'Patient created successfully', 
      patient: { id: docRef.id, ...patient }
    });
  } catch (error) {
    console.error('Patient creation error:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Get all patients (with pagination)
router.get('/', verifyToken, requireRole('admin', 'doctor'), async (req, res) => {
  try {
    const { limit = 50, startAfter } = req.query;
    
    let query = db.collection('patients')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));
    
    if (startAfter) {
      const startDoc = await db.collection('patients').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }
    
    const snapshot = await query.get();
    
    const patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ patients, count: patients.length });
  } catch (error) {
    console.error('Patients fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Search patients
router.get('/search', verifyToken, requireRole('admin', 'doctor'), async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    // Simple search by name or phone (Firestore limitations)
    const snapshot = await db.collection('patients')
      .orderBy('name')
      .startAt(q)
      .endAt(q + '\uf8ff')
      .limit(20)
      .get();
    
    const patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ patients });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get patient by ID
router.get('/:id', verifyToken, requireRole('admin', 'doctor'), async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('patients').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ patient: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error('Patient fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Update patient
router.put('/:id', verifyToken, requireRole('admin', 'doctor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, medicalHistory } = req.body;
    
    const updates = {
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid
    };
    
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (address !== undefined) updates.address = address;
    if (medicalHistory !== undefined) updates.medicalHistory = medicalHistory;
    
    await db.collection('patients').doc(id).update(updates);
    
    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    console.error('Patient update error:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// Delete patient
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('patients').doc(id).delete();
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Patient deletion error:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router;
