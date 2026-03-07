import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [preview, setPreview] = useState(user?.avatar || null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      .font-bebas { font-family: 'Bebas Neue', cursive !important; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes ping-slow {
        0% { transform: scale(1); opacity: 0.6; }
        100% { transform: scale(2); opacity: 0; }
      }
      @keyframes shimmer {
        from { background-position: -200% center; }
        to { background-position: 200% center; }
      }
      @keyframes gradientBorder {
        0%, 100% { border-color: rgba(74,222,128,0.4); }
        50% { border-color: rgba(74,222,128,0.8); }
      }

      .animate-fadeUp-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; opacity: 0; }
      .animate-fadeUp-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; opacity: 0; }
      .animate-fadeUp-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards; opacity: 0; }
      .animate-fadeUp-4 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s forwards; opacity: 0; }
      .animate-float { animation: float 4s ease-in-out infinite; }
      .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      .animate-ping-slow { animation: ping-slow 2s ease-out infinite; }

      .shimmer-text {
        background: linear-gradient(90deg, #fff 0%, #4ade80 50%, #fff 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 3s linear infinite;
      }

      .avatar-ring {
        animation: gradientBorder 3s ease-in-out infinite;
      }

      .grid-dots {
        background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 28px 28px;
      }

      .noise {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      }

      .info-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        padding: 16px 20px;
        transition: all 0.3s ease;
      }
      .info-card:hover {
        background: rgba(255,255,255,0.04);
        border-color: rgba(74,222,128,0.2);
        transform: translateX(4px);
      }

      .upload-zone {
        border: 2px dashed rgba(74,222,128,0.2);
        border-radius: 16px;
        transition: all 0.3s ease;
      }
      .upload-zone:hover {
        border-color: rgba(74,222,128,0.5);
        background: rgba(74,222,128,0.03);
      }

      .save-btn {
        background: linear-gradient(135deg, #4ade80, #22c55e);
        color: black;
        font-weight: 700;
        border-radius: 14px;
        padding: 14px;
        width: 100%;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .save-btn::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s ease;
      }
      .save-btn:hover::before { left: 100%; }
      .save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(74,222,128,0.3); }
      .save-btn:disabled { opacity: 0.5; transform: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await API.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ avatar: data.avatar });
      setMessage('Profile photo updated ✅');
      setFile(null);
    } catch {
      setError('Upload failed ❌');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    if (user?.role === 'player') return { label: 'Player', emoji: '⚽', color: 'text-green-400 bg-green-400/10 border-green-400/20' };
    return { label: 'Ground Owner', emoji: '🏟️', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' };
  };

  const badge = getRoleBadge();

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="fixed inset-0 grid-dots pointer-events-none opacity-50" />
      <div className="fixed inset-0 noise pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-green-400/30 to-transparent pointer-events-none" />

      <Navbar />

      <div className="relative max-w-2xl mx-auto px-4 py-12">
        <div className="animate-fadeUp-1 mb-10">
          <p className="text-green-400 text-xs uppercase tracking-[0.3em] mb-2">Account</p>
          <h1 className="font-bebas text-5xl tracking-wide shimmer-text">MY PROFILE</h1>
        </div>

        <div className="animate-fadeUp-2 mb-6">
          <div className="relative bg-white/2 border border-white/6 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/3 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full animate-spin-slow opacity-60"
                  style={{ background: 'conic-gradient(from 0deg, transparent 0%, #4ade80 50%, transparent 100%)', padding: '2px', borderRadius: '50%' }}
                />
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#060606]">
                  {preview ? (
                    <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400/20 to-green-400/5 flex items-center justify-center">
                      <span className="font-bebas text-4xl text-green-400">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <label
                  htmlFor="avatarInput"
                  className="absolute -bottom-1 -right-1 w-9 h-9 bg-green-400 hover:bg-green-300 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg hover:scale-110"
                >
                  <span className="text-base">📷</span>
                </label>
                <input id="avatarInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{user?.email}</p>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${badge.color}`}>
                    <span>{badge.emoji}</span>
                    {badge.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 text-gray-400 bg-white/3">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                    </span>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {file && (
          <div className="animate-fadeUp-2 mb-6">
            <div className="bg-green-400/5 border border-green-400/20 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={preview} alt="" className="w-12 h-12 rounded-xl object-cover border border-green-400/30" />
                <div>
                  <p className="text-white text-sm font-medium">New photo selected</p>
                  <p className="text-gray-500 text-xs">{file.name}</p>
                </div>
              </div>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="save-btn"
                style={{ width: 'auto', padding: '10px 20px' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Uploading...
                  </span>
                ) : 'Save Photo ✅'}
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="animate-fadeUp-2 mb-6">
            <div className="bg-green-400/8 border border-green-400/20 text-green-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
              <span>✅</span> {message}
            </div>
          </div>
        )}

        {error && (
          <div className="animate-fadeUp-2 mb-6">
            <div className="bg-red-400/8 border border-red-400/20 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
              <span>❌</span> {error}
            </div>
          </div>
        )}

        <div className="animate-fadeUp-3">
          <p className="text-gray-600 text-xs uppercase tracking-[0.2em] mb-4">Profile Info</p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Full Name', value: user?.name, icon: '👤' },
              { label: 'Email Address', value: user?.email, icon: '📧' },
              { label: 'Phone Number', value: user?.phone || 'Not added', icon: '📞' },
              { label: 'Account Role', value: user?.role === 'player' ? 'Player ⚽' : 'Ground Owner 🏟️', icon: '🎭' },
            ].map((item, i) => (
              <div key={i} className="info-card">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-gray-600 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fadeUp-4 mt-8">
          <div className="upload-zone p-6 text-center cursor-pointer" onClick={() => document.getElementById('avatarInput').click()}>
            <div className="text-3xl mb-3">📷</div>
            <p className="text-gray-400 text-sm font-medium">Click to change profile photo</p>
            <p className="text-gray-600 text-xs mt-1">JPG, PNG or WEBP — Max 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;