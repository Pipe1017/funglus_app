import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // URL del backend (ajusta si tu puerto es diferente)
  const API_URL = 'http://localhost:8000/api/v1';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_URL}/auth/login/access-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas o usuario inactivo');
      }

      const data = await response.json();
      
      // Guardamos la sesión
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('user_name', data.user_name);
      
      // Redirigir al Launchpad
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-surface p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-brand-500 rounded-xl mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-brand-500/30">
            F
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Bienvenido</h1>
          <p className="text-sm text-gray-400 mt-2">Ingresa a Funglus Platform</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
              placeholder="ejemplo@funglus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-900 text-white rounded-lg font-medium hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}