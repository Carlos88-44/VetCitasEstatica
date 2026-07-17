import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/ui';

import MainLayout from './pages/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CalendarioPage from './pages/CalendarioPage';
import ClientesPage from './pages/ClientesPage';
import MascotasPage from './pages/MascotasPage';
import VeterinariosPage from './pages/VeterinariosPage';
import ExpedientesPage from './pages/ExpedientesPage';

// Version estatica: no hay sesion que verificar. Esta funcion solo
// restringe el acceso segun el rol de demostracion seleccionado en la
// barra superior (para conservar el comportamiento original por roles).
function RutaPorRol({ children, rolesPermitidos }) {
  const { usuario } = useAuth();
  if (rolesPermitidos && !rolesPermitidos.includes(usuario?.rol)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="calendario" element={<CalendarioPage />} />
        <Route
          path="clientes"
          element={
            <RutaPorRol rolesPermitidos={['administrador', 'recepcionista']}>
              <ClientesPage />
            </RutaPorRol>
          }
        />
        <Route path="mascotas" element={<MascotasPage />} />
        <Route
          path="veterinarios"
          element={
            <RutaPorRol rolesPermitidos={['administrador']}>
              <VeterinariosPage />
            </RutaPorRol>
          }
        />
        <Route path="expedientes" element={<ExpedientesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
