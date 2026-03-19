import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useTheme } from './hooks';

// Layout
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import AuthPage from './pages/auth/AuthPage';
import OAuthCallback from './pages/auth/OAuthCallback';

// App pages
import Dashboard        from './pages/Dashboard';
import ResumeAnalyzer   from './pages/tools/ResumeAnalyzer';
import InterviewTrainer from './pages/tools/InterviewTrainer';
import CodeReviewer     from './pages/tools/CodeReviewer';
import LearningPaths    from './pages/tools/LearningPaths';
import BugFixAssistant  from './pages/tools/BugFixAssistant';
import Profile          from './pages/Profile';
import Settings         from './pages/Settings';

export default function App() {
  const { fetchMe, token, setToken, setUser } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Handle OAuth redirect with token in URL
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get('token');
    if (oauthToken) {
      setToken(oauthToken);
      window.history.replaceState({}, '', '/dashboard');
      window.location.href = '/dashboard';
    }
  }, []);

  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/auth"     element={<AuthPage />} />
      <Route path="/callback" element={<OAuthCallback />} />

      {/* Redirect old routes to new auth page */}
      <Route path="/login"    element={<Navigate to="/auth?tab=login" replace />} />
      <Route path="/register" element={<Navigate to="/auth?tab=register" replace />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/resume"      element={<ResumeAnalyzer />} />
          <Route path="/interview"   element={<InterviewTrainer />} />
          <Route path="/code-review" element={<CodeReviewer />} />
          <Route path="/learning"    element={<LearningPaths />} />
          <Route path="/bug-fix"     element={<BugFixAssistant />} />
          <Route path="/profile"     element={<Profile />} />
          <Route path="/settings"    element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}