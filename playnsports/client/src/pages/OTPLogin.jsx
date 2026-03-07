import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OTPLogin = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('player');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/otp/send', { email });
      setMessage('OTP sent to your email ✅');
      const userCheck = await API.post('/otp/check', { email }).catch(() => null);
      if (userCheck?.data?.exists === false) setIsNewUser(true);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/otp/verify', {
        email,
        otp,
        name,
        phone,
        role,
      });
      login({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        avatar: data.avatar || '',
      }, data.token);
      if (data.role === 'player') navigate('/player/dashboard');
      else navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold text-green-400 mb-2 text-center">Login with OTP</h2>
        <p className="text-gray-400 text-center mb-8">We'll send a 6-digit code to your email</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gaurav@gmail.com"
                required
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-800 px-4 py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP 📧'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-2xl tracking-widest"
              />
              <p className="text-gray-500 text-xs mt-1">OTP sent to {email}</p>
            </div>

            {isNewUser && (
              <>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Gaurav Kumar"
                    required
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9999999999"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">I am a</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="player">Player</option>
                    <option value="ground_owner">Ground Owner</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-800 px-4 py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP ✅'}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(''); setMessage(''); }}
              className="text-gray-400 text-sm hover:text-white transition text-center"
            >
              ← Change Email
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Login with password?{' '}
            <Link to="/login" className="text-green-400 hover:underline">Click here</Link>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            New user?{' '}
            <Link to="/register" className="text-green-400 hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;