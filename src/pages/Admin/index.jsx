import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { useRealTime } from '../../hooks';
import { Card, Input, Button, Loader } from '../../components/common';
import { DollarSign, Users, Activity, Calendar } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: appointments, loading: loadingAppts } = useRealTime('appointments');
  const { data: doctors, loading: loadingDocs } = useRealTime('users', [
    { field: 'role', operator: '==', value: 'doctor' }
  ]);
  const { data: patients, loading: loadingPats } = useRealTime('users', [
    { field: 'role', operator: '==', value: 'patient' }
  ]);

  if (loadingAppts || loadingDocs || loadingPats) return <Loader className="h-screen" />;

  const todayAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  const completedAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-clinical-800 mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-clinical-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-clinical-800 mt-1">
                ${completedAppointments.length * 50}
              </p>
            </div>
            <DollarSign className="text-green-600" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-clinical-600 text-sm">Active Doctors</p>
              <p className="text-3xl font-bold text-clinical-800 mt-1">{doctors.length}</p>
            </div>
            <Users className="text-primary-600" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-clinical-600 text-sm">Total Patients</p>
              <p className="text-3xl font-bold text-clinical-800 mt-1">{patients.length}</p>
            </div>
            <Activity className="text-blue-600" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-clinical-600 text-sm">Today's Volume</p>
              <p className="text-3xl font-bold text-clinical-800 mt-1">{todayAppointments.length}</p>
            </div>
            <Calendar className="text-yellow-600" size={40} />
          </div>
        </Card>
      </div>

      <Card title="Recent Activity">
        <div className="space-y-3">
          {appointments.slice(0, 10).map(appointment => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-clinical-50 rounded-lg">
              <div>
                <p className="font-semibold text-clinical-800">{appointment.patientName}</p>
                <p className="text-sm text-clinical-600">with Dr. {appointment.doctorName}</p>
              </div>
              <span className="text-sm text-clinical-500">{appointment.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const StaffManagement = () => {
  const { data: doctors, loading } = useRealTime('users', [
    { field: 'role', operator: '==', value: 'doctor' }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: ''
  });
  const [creating, setCreating] = useState(false);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'doctor',
        specialty: formData.specialty,
        createdAt: new Date().toISOString()
      });

      setFormData({ name: '', email: '', password: '', specialty: '' });
      alert('Doctor account created successfully!');
    } catch (error) {
      alert('Failed to create doctor: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader className="h-screen" />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-clinical-800 mb-6">Staff Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Create New Doctor">
          <form onSubmit={handleCreateDoctor}>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Input
              label="Specialty"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="e.g., Cardiology, General"
              required
            />
            <Button type="submit" disabled={creating} className="w-full">
              {creating ? 'Creating...' : 'Create Doctor Account'}
            </Button>
          </form>
        </Card>

        <Card title="Active Doctors">
          <div className="space-y-3">
            {doctors.map(doctor => (
              <div key={doctor.id} className="p-4 bg-clinical-50 rounded-lg">
                <p className="font-semibold text-clinical-800">{doctor.name}</p>
                <p className="text-sm text-clinical-600">{doctor.specialty}</p>
                <p className="text-sm text-clinical-500">{doctor.email}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
