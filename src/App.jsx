import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import OsintPage from './pages/OsintPage';
import BreachPage from './pages/BreachPage';
import SentimentPage from './pages/SentimentPage';
import AccountsPage from './pages/AccountsPage';
import DeletionsPage from './pages/DeletionsPage';
import ReportsPage from './pages/ReportsPage';
import ActivityPage from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IdentityScanProvider } from './context/IdentityScanContext';
import AuthModal from './components/auth/AuthModal';

function AuthenticatedLayout() {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentUser.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/osint" element={<OsintPage />} />
          <Route path="/breaches" element={<BreachPage />} />
          <Route path="/sentiment" element={<SentimentPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/deletions" element={<DeletionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/admin/users"
            element={isAdmin ? <AdminUsersPage /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AuthModal />
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/*" element={<AuthenticatedLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <IdentityScanProvider>
        <AppContent />
      </IdentityScanProvider>
    </AuthProvider>
  );
}
