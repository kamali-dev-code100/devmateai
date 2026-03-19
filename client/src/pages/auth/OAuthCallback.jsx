import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      // Save token
      setToken(token);

      // Fetch user with this token
      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(({ data }) => {
        useAuthStore.setState({ user: data.data });
        navigate('/dashboard');
      }).catch(() => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '42px', height: '42px',
        background: 'var(--accent)',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '8px'
      }}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--bg)">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div style={{ color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>
        Signing you in...
      </div>
      <span className="spinner" style={{ width: '20px', height: '20px' }} />
    </div>
  );
}