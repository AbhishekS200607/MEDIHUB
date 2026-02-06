import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRealTime, useFirestore } from '../../hooks';
import { Card, Badge, Button, Input, Loader } from '../../components/common';
import { Clock, User } from 'lucide-react';
import { format } from 'date-fns';

export const LiveQueue = () => {
  const { userProfile } = useAuth();
  const { data: appointments, loading } = useRealTime('appointments', [
    { field: 'doctorId', operator: '==', value: userProfile?.uid },
    { field: 'status', operator: '==', value: 'waiting' }
  ]);
  const { updateDocument } = useFirestore('appointments');

  const handleStart = async (appointmentId) => {
    try {
      await updateDocument(appointmentId, { status: 'in-progress' });
    } catch (error) {
      alert('Failed to start consultation: ' + error.message);
    }
  };

  if (loading) return <Loader className="h-screen" />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-clinical-800 mb-2">Live Queue</h1>
      <p className="text-clinical-600 mb-6">Real-time patient queue updates</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-clinical-600 text-sm">Waiting</p>
              <p className="text-3xl font-bold text-clinical-800 mt-1">{appointments.length}</p>
            </div>
            <Clock className="text-yellow-600" size={40} />
          </div>
        </Card>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <p className="text-clinical-500 text-center py-8">No patients in queue</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <Card key={appointment.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <User className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-clinical-800">{appointment.patientName}</h3>
                    <p className="text-sm text-clinical-600">
                      {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                    </p>
                    <Badge variant="warning" className="mt-2">Queue #{index + 1}</Badge>
                  </div>
                </div>
                <Button onClick={() => handleStart(appointment.id)}>
                  Start Consultation
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export const ConsultationDesk = () => {
  const { userProfile } = useAuth();
  const { data: activeAppointments, loading } = useRealTime('appointments', [
    { field: 'doctorId', operator: '==', value: userProfile?.uid },
    { field: 'status', operator: '==', value: 'in-progress' }
  ]);
  const { updateDocument } = useFirestore('appointments');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');

  const handleComplete = async () => {
    if (!selectedPatient) return;
    
    try {
      await updateDocument(selectedPatient.id, {
        status: 'completed',
        diagnosis,
        prescription,
        completedAt: new Date().toISOString()
      });
      setSelectedPatient(null);
      setDiagnosis('');
      setPrescription('');
      alert('Consultation completed successfully!');
    } catch (error) {
      alert('Failed to complete consultation: ' + error.message);
    }
  };

  if (loading) return <Loader className="h-screen" />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-clinical-800 mb-6">Consultation Desk</h1>

      {activeAppointments.length === 0 ? (
        <Card>
          <p className="text-clinical-500 text-center py-8">No active consultations</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Active Patients">
            <div className="space-y-3">
              {activeAppointments.map(appointment => (
                <div
                  key={appointment.id}
                  onClick={() => setSelectedPatient(appointment)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.id === appointment.id
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-clinical-50 hover:bg-clinical-100'
                  }`}
                >
                  <p className="font-semibold text-clinical-800">{appointment.patientName}</p>
                  <p className="text-sm text-clinical-600">{appointment.time}</p>
                </div>
              ))}
            </div>
          </Card>

          {selectedPatient && (
            <Card title={`Treating: ${selectedPatient.patientName}`}>
              <Input
                label="Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
              />
              <textarea
                className="input-field min-h-[120px]"
                placeholder="Enter prescription..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
              />
              <Button onClick={handleComplete} className="w-full mt-4">
                Complete Consultation
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
