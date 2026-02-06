import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { Login, Register, Unauthorized } from './pages/Auth';
import { PatientDashboard, FindDoctor, MyBookings } from './pages/Patient';
import { LiveQueue, ConsultationDesk } from './pages/Doctor';
import { AdminDashboard, StaffManagement } from './pages/Admin';

const AppLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">{children}</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <AppLayout><PatientDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/patient/find-doctor" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <AppLayout><FindDoctor /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/patient/bookings" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <AppLayout><MyBookings /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <AppLayout><LiveQueue /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/desk" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <AppLayout><ConsultationDesk /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout><AdminDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/staff" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout><StaffManagement /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
