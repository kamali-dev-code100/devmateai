// Login.jsx — redirects to landing with auth panel open
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/?auth=login', { replace: true }); }, []);
  return null;
}