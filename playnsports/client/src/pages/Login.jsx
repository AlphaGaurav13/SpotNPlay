import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-12px) rotate(2deg); }
      }
      @keyframes shimmer {
        from { background-position: -200% center; }
        to { background-position: 200% center; }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .animate-fadeUp-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; opacity: 0; }
      .animate-fadeUp-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; opacity: 0; }
      .animate-fadeUp-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards; opacity: 0; }
      .animate-fadeUp-4 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s forwards; opacity: 0; }
      .animate-fadeUp-5 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s forwards; opacity: 0; }
      .animate-float { animation: float 6s ease-in-out infinite; }
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
      }
      .input-field:focus {
        background: rgba(255,255,255,0.05);
        border-color: rgba(74,222,128,0.5);
        box-shadow: 0 0 0 3px rgba(74,222,128,0.08);
      }
      .input-field::placeholder { color: rgba(255,255,255,0.2); }
      .input-focused {
        background: rgba(255,255,255,0.05) !important;
        border-color: rgba(74,222,128,0.5) !important;
        box-shadow: 0 0 0 3px rgba(74,222,128,0.08) !important;
      }
      .btn-login {
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
      .btn-login::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s ease;
      }
      .btn-login:hover::before { left: 100%; }
      .btn-login:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(74,222,128,0.35); }
      .btn-login:disabled { opacity: 0.6; transform: none; box-shadow: none; }
      .otp-btn {
        width: 100%;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.7);
        font-weight: 500;
        font-size: 15px;
        border-radius: 14px;
        padding: 14px;
        transition: all 0.3s ease;
        font-family: 'DM Sans', sans-serif;
        text-align: center;
        display: block;
      }
      .otp-btn:hover {
        background: rgba(255,255,255,0.06);
        border-color: rgba(255,255,255,0.15);
        color: white;
        transform: translateY(-1px);
      }
      .google-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.8);
        font-weight: 500;
        font-size: 15px;
        border-radius: 14px;
        padding: 14px;
        transition: all 0.3s ease;
        font-family: 'DM Sans', sans-serif;
        text-decoration: none;
      }
      .google-btn:hover {
        background: rgba(255,255,255,0.06);
        border-color: rgba(255,255,255,0.15);
        color: white;
        transform: translateY(-1px);
      }
      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        color: rgba(255,255,255,0.15);
        font-size: 12px;
      }
      .divider::before, .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: rgba(255,255,255,0.08);
      }
      .sport-pill {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 100px;
        padding: 6px 14px;
        font-size: 12px;
        color: rgba(255,255,255,0.3);
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        avatar: data.avatar || '',
      }, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-dots pointer-events-none opacity-40" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-green-400/5 animate-spin-slow" />
        <div className="absolute inset-12 rounded-full border border-green-400/4" style={{ animation: 'spin-slow 15s linear infinite reverse' }} />
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)' }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-green-400/30 to-transparent pointer-events-none" />

      <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '0s' }}>
        <div className="bg-black/40 backdrop-blur-xl border border-white/8 rounded-2xl px-4 py-3 text-sm hidden lg:flex items-center gap-2">
          <span>⚽</span>
          <span className="text-gray-400">Football · 3 players nearby</span>
        </div>
      </div>
      <div className="absolute bottom-32 left-16 animate-float" style={{ animationDelay: '2s' }}>
        <div className="bg-black/40 backdrop-blur-xl border border-white/8 rounded-2xl px-4 py-3 text-sm hidden lg:flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-gray-400">24 players active now</span>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="animate-fadeUp-1 text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-green-400 rounded-xl flex items-center justify-center">
              <span className="text-black font-black text-sm">P</span>
            </div>
            <span className="font-bebas text-2xl tracking-widest text-white">PLAYNSPORTS</span>
          </Link>
          <h1 className="font-bebas text-5xl tracking-wide shimmer-text mb-2">WELCOME BACK</h1>
          <p className="text-gray-600 text-sm">Sign in to find players and book grounds</p>
        </div>

        <div className="animate-fadeUp-2 bg-white/2 border border-white/6 rounded-3xl p-8 backdrop-blur-sm">
          {error && (
            <div className="animate-slideIn bg-red-400/8 border border-red-400/20 text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="animate-fadeUp-3">
              <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Email Address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                placeholder="gaurav@gmail.com" required
                className={`input-field ${focused === 'email' ? 'input-focused' : ''}`}
              />
            </div>
            <div className="animate-fadeUp-3">
              <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                placeholder="••••••••" required
                className={`input-field ${focused === 'password' ? 'input-focused' : ''}`}
              />
            </div>
            <div className="animate-fadeUp-4">
              <button type="submit" disabled={loading} className="btn-login">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </div>
          </form>

          <div className="animate-fadeUp-4 divider my-5">OR</div>

          {/* Google Login */}
          <div className="animate-fadeUp-5 flex flex-col gap-3">
            
            <a  href="https://spotnplay-1.onrender.com/api/auth/google"
              className="google-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </a>

            <Link to="/otp-login" className="otp-btn">
              Login with OTP 📧
            </Link>
          </div>
        </div>

        <div className="animate-fadeUp-5 text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Create one free →
            </Link>
          </p>
        </div>

        <div className="animate-fadeUp-5 flex flex-wrap justify-center gap-2 mt-8">
          {['⚽ Football', '🏏 Cricket', '🏀 Basketball', '🎾 Tennis', '🏸 Badminton'].map((s, i) => (
            <span key={i} className="sport-pill">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;