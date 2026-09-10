import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Cake, Mail, Lock, LogIn, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginDemoRole } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to Velvet & Frost!', 'success', 'Logged In');
      navigate(redirectUrl);
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      showToast('Logged in with Google!', 'success');
      navigate(redirectUrl);
    } catch (err) {
      showToast('Google auth failed.', 'error');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-rose-200 shadow-2xl space-y-6 animate-slide-up">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Cake className="w-6 h-6" />
          </div>
          <h2 className="font-serif-title font-bold text-2xl text-gray-900">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to complete your cake order or manage your account.</p>
        </div>

        {/* Demo Roles Shortcut Alert */}
        <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">⚡ Instant Testing Shortcut</span>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => { loginDemoRole('customer'); navigate(redirectUrl); }}
              className="px-3 py-1 bg-white text-rose-600 rounded-lg text-xs font-bold shadow-sm border border-rose-200 hover:bg-rose-100"
            >
              Demo Customer
            </button>
            <button
              onClick={() => { loginDemoRole('admin'); navigate('/admin'); }}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-rose-700"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-none focus:border-rose-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-none focus:border-rose-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-700 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="relative text-center border-t border-rose-100 pt-4">
          <span className="text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to={`/signup?redirect=${redirectUrl}`} className="font-bold text-rose-600 hover:underline">
              Create Account
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}
