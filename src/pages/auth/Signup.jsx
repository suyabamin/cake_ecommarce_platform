import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Cake, Mail, Lock, User, UserPlus } from 'lucide-react';

export default function Signup() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, displayName);
      showToast('Account created successfully! Welcome to Velvet & Frost.', 'success');
      navigate(redirectUrl);
    } catch (err) {
      showToast(err.message || 'Signup failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-rose-200 shadow-2xl space-y-6 animate-slide-up">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Cake className="w-6 h-6" />
          </div>
          <h2 className="font-serif-title font-bold text-2xl text-gray-900">Create Account</h2>
          <p className="text-xs text-gray-500">Join Velvet & Frost for exclusive cake deals and order tracking.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-none focus:border-rose-500"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
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
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div className="relative text-center border-t border-rose-100 pt-4">
          <span className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link to={`/login?redirect=${redirectUrl}`} className="font-bold text-rose-600 hover:underline">
              Sign In
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}
