import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/', { replace: true, state: { auth: 'register' } }); }, []);
  return null;
}