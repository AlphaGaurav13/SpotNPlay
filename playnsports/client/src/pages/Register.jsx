import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [useOtp, setUseOtp] = useState(true);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'player',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      .font-bebas { font-family: 'Bebas Neue', cursive !important; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shimmer {
        from { background-position: -200% center; }
        to { background-position: 200% center; }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .animate-fadeUp-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; opacity: 0; }
      .animate-fadeUp-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; opacity: 0; }
      .animate-fadeUp-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards; opacity: 0; }
      .animate-fadeUp-4 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s forwards; opacity: 0; }
      .animate-fadeUp-5 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s forwards; opacity: 0; }
      .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      .animate-slideIn { animation: slideIn 0.3s ease forwards; }

      .shimmer-text {
        background: linear-gradient(90deg, #fff 0%, #4ade80 50%, #fff 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 3s linear infinite;
      }

      .grid-dots {
        background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 28px 28px;
      }

      .input-field {
        width: 100%;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 14px 16px;
        color: white;
        font-size: 15px;
        transition: all 0.3s ease;
        outline: none;
        font-family: 'DM Sans', sans-serif;
      }
      .input-field:focus {
        background: rgba(255,255,255,0.05);
        border-color: rgba(74,222,128,0.5);
        box-shadow: 0 0 0 3px rgba(74,222,128,0.08);
      }
      .input-field::placeholder { color: rgba(255,255,255,0.2); }

      .role-card {
        flex: 1;
        border-radius: 14px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.02);
      }
      .role-card.active {
        border-color: rgba(74,222,128,0.5);
        background: rgba(74,222,128,0.08);
      }
      .role-card.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .coming-soon-badge {
        background: rgba(251,191,36,0.15);
        border: 1px solid rgba(251,191,36,0.3);
        color: #fbbf24;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 100px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: inline-block;
        margin-top: 4px;
      }

      .btn-primary {
        width: 100%;
        background: linear-gradient(135deg, #4ade80, #22c55e);
        color: black;
        font-weight: 700;
        font-size: 16px;
        border-radius: 14px;
        padding: 15px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        font-family: 'DM Sans', sans-serif;
      }
      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s ease;
      }
      .btn-primary:hover::before { left: 100%; }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(74,222,128,0.35); }
      .btn-primary:disabled { opacity: 0.6; transform: none; box-shadow: none; }

      .toggle-btn {
        flex: 1;
        padding: 10px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.3s ease;
        font-family: 'DM Sans', sans-serif;
      }
      .toggle-active {
        background: rgba(74,222,128,0.15);
        color: #4ade80;
        border: 1px solid rgba(74,222,128,0.25);
      }
      .toggle-inactive {
        background: transparent;
        color: rgba(255,255,255,0.3);
        border: 1px solid transparent;
      }
      .toggle-inactive:hover { color: rgba(255,255,255,0.6); }

      .otp-input {
        width: 100%;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(74,222,128,0.3);
        border-radius: 14px;
        padding: 16px;
        color: white;
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        letter-spacing: 0.5em;
        outline: none;
        transition: all 0.3s ease;
        font-family: 'DM Sans', sans-serif;
      }
      .otp-input:focus {
        border-color: rgba(74,222,128,0.6);
        box-shadow: 0 0 0 3px rgba(74,222,128,0.1);
        background: rgba(74,222,128,0.04);
      }

      .progress-step {
        width: 32px;
        height: 4px;
        border-radius: 100px;
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) return setError('Passwords do not match ❌');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.phone.length < 10) return setError('Enter a valid phone number');

    setLoading(true);

    if (!useOtp) {
      // Normal signup
      try {
        const { data } = await API.post('/auth/register', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
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
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    // OTP signup — send OTP first
    try {
      await API.post('/otp/send', { email: form.email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

 const handleVerifyAndRegister = async () => {
  if (otp.length !== 6) return setError('Enter 6 digit OTP');
  setLoading(true);
  setError('');
  try {
    // OTP verify + user create — ek hi call mein
    const { data } = await API.post('/otp/verify', {
      email: form.email,
      otp,
      name: form.name,
      phone: form.phone,
      role: form.role,
      password: form.password, // ← password bhi bhejo
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
    setError(err.response?.data?.message || 'Verification failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#060606] text-white flex items-center justify-center px-4 relative overflow-hidden py-10">
      <div className="fixed inset-0 grid-dots pointer-events-none opacity-40" />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-green-400/5 animate-spin-slow" />
        <div className="absolute inset-12 rounded-full border border-green-400/4" style={{ animation: 'spin-slow 15s linear infinite reverse' }} />
      </div>

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)' }}
      />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-green-400/30 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="animate-fadeUp-1 text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-green-400 rounded-xl flex items-center justify-center">
              <span className="text-black font-black text-sm">P</span>
            </div>
            <span className="font-bebas text-2xl tracking-widest text-white">PLAYNSPORTS</span>
          </Link>
          <h1 className="font-bebas text-5xl tracking-wide shimmer-text mb-2">
            {step === 1 ? 'CREATE ACCOUNT' : 'VERIFY EMAIL'}
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 1 ? 'Join thousands of players already on the map' : `OTP sent to ${form.email}`}
          </p>
        </div>

        {/* Progress dots */}
        {useOtp && (
          <div className="animate-fadeUp-1 flex gap-2 justify-center mb-6">
            <div className="progress-step" style={{ background: step >= 1 ? '#4ade80' : 'rgba(255,255,255,0.1)' }} />
            <div className="progress-step" style={{ background: step >= 2 ? '#4ade80' : 'rgba(255,255,255,0.1)' }} />
          </div>
        )}

        <div className="animate-fadeUp-2 bg-white/2 border border-white/6 rounded-3xl p-8 backdrop-blur-sm">
          {error && (
            <div className="animate-slideIn bg-red-400/8 border border-red-400/20 text-red-400 px-4 py-3 rounded-2xl mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Toggle */}
              <div className="flex gap-1 p-1 bg-white/3 border border-white/6 rounded-2xl mb-2">
                <button type="button" onClick={() => setUseOtp(false)} className={`toggle-btn ${!useOtp ? 'toggle-active' : 'toggle-inactive'}`}>
                  🔑 Normal Signup
                </button>
                <button type="button" onClick={() => setUseOtp(true)} className={`toggle-btn ${useOtp ? 'toggle-active' : 'toggle-inactive'}`}>
                  📧 Verify with OTP
                </button>
              </div>

              <div className="animate-fadeUp-3">
                <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Full Name</label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="Gaurav Kumar" required
                  className="input-field"
                  style={focused === 'name' ? { borderColor: 'rgba(74,222,128,0.5)', background: 'rgba(255,255,255,0.05)' } : {}}
                />
              </div>

              <div className="animate-fadeUp-3">
                <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Email Address</label>
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="gaurav@gmail.com" required
                  className="input-field"
                  style={focused === 'email' ? { borderColor: 'rgba(74,222,128,0.5)', background: 'rgba(255,255,255,0.05)' } : {}}
                />
              </div>

              <div className="animate-fadeUp-3">
                <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Phone Number</label>
                <input
                  type="tel" name="phone" value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                  placeholder="9999999999" required
                  className="input-field"
                  style={focused === 'phone' ? { borderColor: 'rgba(74,222,128,0.5)', background: 'rgba(255,255,255,0.05)' } : {}}
                />
              </div>

              <div className="animate-fadeUp-3">
                <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Password</label>
                <input
                  type="password" name="password" value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  placeholder="••••••••" required
                  className="input-field"
                  style={focused === 'password' ? { borderColor: 'rgba(74,222,128,0.5)', background: 'rgba(255,255,255,0.05)' } : {}}
                />
              </div>

              <div className="animate-fadeUp-3">
                <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Confirm Password</label>
                <input
                  type="password" name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')}
                  placeholder="••••••••" required
                  className="input-field"
                  style={focused === 'confirmPassword' ? {
                    borderColor: form.confirmPassword && form.password !== form.confirmPassword
                      ? 'rgba(239,68,68,0.5)'
                      : 'rgba(74,222,128,0.5)',
                    background: 'rgba(255,255,255,0.05)'
                  } : {}}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 ml-1">❌ Passwords do not match</p>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-green-400 text-xs mt-1 ml-1">✅ Passwords match</p>
                )}
              </div>

              {/* Role */}
              <div className="animate-fadeUp-4">
                <label className="text-xs text-gray-600 uppercase tracking-wider mb-3 block">Join As</label>
                <div className="flex gap-3">
                  <div onClick={() => setForm({ ...form, role: 'player' })} className={`role-card ${form.role === 'player' ? 'active' : ''}`}>
                    <div className="text-2xl mb-1">⚽</div>
                    <p className="text-white text-sm font-semibold">Player</p>
                    <p className="text-gray-600 text-xs mt-0.5">Find & play sports</p>
                  </div>
                  <div className="role-card disabled">
                    <div className="text-2xl mb-1">🏟️</div>
                    <p className="text-gray-400 text-sm font-semibold">Ground Owner</p>
                    <span className="coming-soon-badge">Coming Soon</span>
                  </div>
                </div>
              </div>

              <div className="animate-fadeUp-5">
                <button type="submit" disabled={loading} className="btn-primary mt-2">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      {useOtp ? 'Sending OTP...' : 'Creating Account...'}
                    </span>
                  ) : useOtp ? 'Continue → (Verify with OTP)' : 'Create Account 🚀'}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-400/10 border border-green-400/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  📧
                </div>
                <p className="text-gray-400 text-sm">We sent a 6-digit OTP to</p>
                <p className="text-white font-semibold mt-1">{form.email}</p>
              </div>

              <div>
                <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block text-center">Enter OTP</label>
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  className="otp-input"
                />
              </div>

              <button
                onClick={handleVerifyAndRegister}
                disabled={loading || otp.length !== 6}
                className="btn-primary"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Verify & Create Account 🚀'}
              </button>

              <button
                onClick={() => { setStep(1); setOtp(''); setError(''); }}
                className="text-gray-600 hover:text-white text-sm transition-colors text-center"
              >
                ← Change Details
              </button>

              <p className="text-gray-700 text-xs text-center">
                Didn't receive OTP?{' '}
                <button
                  onClick={() => API.post('/otp/send', { email: form.email })}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Resend
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="animate-fadeUp-5 text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;