import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const SPORTS = [
  { value: 'football', label: 'Football', emoji: '⚽' },
  { value: 'cricket', label: 'Cricket', emoji: '🏏' },
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
  { value: 'volleyball', label: 'Volleyball', emoji: '🏐' },
];

const SKILLS = [
  { value: 'beginner', label: 'Beginner', color: 'text-blue-400' },
  { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-400' },
  { value: 'advanced', label: 'Advanced', color: 'text-green-400' },
];

const PlayerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    sport: 'cricket',
    isAvailable: true,
    coordinates: ['', ''],
    skillLevel: 'beginner',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      .font-bebas { font-family: 'Bebas Neue', cursive !important; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shimmer {
        from { background-position: -200% center; }
        to { background-position: 200% center; }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }

      .animate-fadeUp-1 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; opacity: 0; }
      .animate-fadeUp-2 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; opacity: 0; }
      .animate-fadeUp-3 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s forwards; opacity: 0; }
      .animate-fadeUp-4 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s forwards; opacity: 0; }
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

      .card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 24px;
        backdrop-filter: blur(8px);
      }

      .input-field {
        width: 100%;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 13px 16px;
        color: white;
        font-size: 15px;
        transition: all 0.3s ease;
        outline: none;
        font-family: 'DM Sans', sans-serif;
      }
      .input-field:focus, .input-focused {
        background: rgba(255,255,255,0.05) !important;
        border-color: rgba(74,222,128,0.5) !important;
        box-shadow: 0 0 0 3px rgba(74,222,128,0.08) !important;
      }
      .input-field::placeholder { color: rgba(255,255,255,0.2); }

      /* Sport pills selector */
      .sport-option {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 14px;
        padding: 10px 12px;
        color: rgba(255,255,255,0.35);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        font-family: 'DM Sans', sans-serif;
      }
      .sport-option:hover {
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.6);
        border-color: rgba(255,255,255,0.12);
      }
      .sport-option.active {
        background: rgba(74,222,128,0.08);
        border-color: rgba(74,222,128,0.4);
        color: #4ade80;
      }

      /* Skill toggle */
      .skill-option {
        flex: 1;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 12px;
        padding: 10px;
        color: rgba(255,255,255,0.3);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
        text-align: center;
        font-family: 'DM Sans', sans-serif;
      }
      .skill-option:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); }
      .skill-option.beginner-active { background: rgba(96,165,250,0.1); border-color: rgba(96,165,250,0.4); color: #60a5fa; }
      .skill-option.intermediate-active { background: rgba(250,204,21,0.1); border-color: rgba(250,204,21,0.4); color: #facc15; }
      .skill-option.advanced-active { background: rgba(74,222,128,0.1); border-color: rgba(74,222,128,0.4); color: #4ade80; }

      /* Buttons */
      .btn-primary {
        background: linear-gradient(135deg, #4ade80, #22c55e);
        color: black; font-weight: 700; font-size: 15px;
        border-radius: 14px; padding: 13px 24px;
        transition: all 0.3s ease; position: relative; overflow: hidden;
        font-family: 'DM Sans', sans-serif;
        white-space: nowrap;
      }
      .btn-primary::before {
        content: ''; position: absolute; top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
        transition: left 0.5s ease;
      }
      .btn-primary:hover::before { left: 100%; }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(74,222,128,0.3); }
      .btn-primary:disabled { opacity: 0.5; transform: none; box-shadow: none; }

      .btn-danger {
        background: rgba(248,113,113,0.08);
        border: 1px solid rgba(248,113,113,0.2);
        color: #f87171; font-weight: 600; font-size: 15px;
        border-radius: 14px; padding: 13px 24px;
        transition: all 0.3s ease;
        font-family: 'DM Sans', sans-serif;
        white-space: nowrap;
      }
      .btn-danger:hover { background: rgba(248,113,113,0.14); border-color: rgba(248,113,113,0.4); transform: translateY(-1px); }

      .btn-location {
        background: rgba(96,165,250,0.08);
        border: 1px solid rgba(96,165,250,0.2);
        color: #60a5fa; font-weight: 600; font-size: 14px;
        border-radius: 12px; padding: 11px 18px;
        transition: all 0.3s ease;
        font-family: 'DM Sans', sans-serif;
        white-space: nowrap;
      }
      .btn-location:hover { background: rgba(96,165,250,0.14); border-color: rgba(96,165,250,0.4); }

      /* Stat cards */
      .stat-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 18px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
      }
      .stat-card:hover {
        background: rgba(255,255,255,0.04);
        border-color: rgba(74,222,128,0.15);
        transform: translateY(-2px);
      }

      /* Booking card */
      .booking-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        padding: 16px 20px;
        transition: all 0.25s ease;
      }
      .booking-card:hover {
        background: rgba(255,255,255,0.04);
        border-color: rgba(255,255,255,0.1);
      }

      .status-badge {
        font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
        padding: 4px 12px; border-radius: 100px;
        font-family: 'DM Sans', sans-serif;
      }

      .section-label {
        font-size: 11px; color: rgba(255,255,255,0.25);
        text-transform: uppercase; letter-spacing: 0.1em;
        font-family: 'DM Sans', sans-serif;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/players/me');
      setProfile(data);
      setForm({
        sport: data.sport,
        isAvailable: data.isAvailable,
        coordinates: data.location.coordinates,
        skillLevel: data.skillLevel,
        bio: data.bio,
      });
    } catch { setProfile(null); }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data);
    } catch { setBookings([]); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({ ...form, coordinates: [pos.coords.longitude, pos.coords.latitude] });
      setMessage('location');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.post('/players/availability', form);
      setMessage('saved');
      fetchProfile();
    } catch {
      setMessage('error');
    } finally {
      setLoading(false);
    }
  };

  const handleOffline = async () => {
    try {
      await API.patch('/players/offline');
      setMessage('offline');
      fetchProfile();
    } catch {
      setMessage('error');
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await API.patch(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch {
      setMessage('error');
    }
  };

  const messageConfig = {
    saved: { bg: 'bg-green-400/8 border-green-400/20 text-green-400', text: 'Availability updated ✅' },
    location: { bg: 'bg-blue-400/8 border-blue-400/20 text-blue-400', text: 'Location detected 📍' },
    offline: { bg: 'bg-red-400/8 border-red-400/20 text-red-400', text: 'You are now offline 🔴' },
    error: { bg: 'bg-red-400/8 border-red-400/20 text-red-400', text: 'Something went wrong ❌' },
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 grid-dots pointer-events-none opacity-30" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.03) 0%, transparent 70%)' }} />

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="animate-fadeUp-1 mb-10">
          <p className="section-label mb-2">Dashboard</p>
          <h1 className="font-bebas text-5xl tracking-wide shimmer-text">PLAYER HUB</h1>
        </div>

        {/* Toast message */}
        {message && messageConfig[message] && (
          <div className={`animate-slideIn border px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-2 ${messageConfig[message].bg}`}>
            {messageConfig[message].text}
          </div>
        )}

        {/* Profile Stats */}
        {profile && (
          <div className="animate-fadeUp-2 card p-6 mb-6">
            <p className="section-label mb-4">My Stats</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="stat-card">
                <p className="text-2xl mb-1">
                  {SPORTS.find(s => s.value === profile.sport)?.emoji || '🏅'}
                </p>
                <p className="text-xs text-gray-600 mb-1">Sport</p>
                <p className="text-green-400 font-bold capitalize text-sm">{profile.sport}</p>
              </div>
              <div className="stat-card">
                <div className="flex justify-center mb-1">
                  <span className={`relative flex h-3 w-3`}>
                    {profile.isAvailable && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    )}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${profile.isAvailable ? 'bg-green-400' : 'bg-red-400'}`} />
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <p className={`font-bold text-sm ${profile.isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                  {profile.isAvailable ? 'Available' : 'Offline'}
                </p>
              </div>
              <div className="stat-card">
                <p className="text-2xl mb-1">🎯</p>
                <p className="text-xs text-gray-600 mb-1">Skill</p>
                <p className="text-green-400 font-bold capitalize text-sm">{profile.skillLevel}</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl mb-1">📅</p>
                <p className="text-xs text-gray-600 mb-1">Bookings</p>
                <p className="text-green-400 font-bold text-sm">{bookings.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Availability form */}
        <div className="animate-fadeUp-3 card p-6 mb-6">
          <p className="section-label mb-1">Availability</p>
          <h2 className="text-lg font-semibold text-white mb-5">Set Your Status</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Sport picker */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wider mb-3 block">Sport</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {SPORTS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm({ ...form, sport: s.value })}
                    className={`sport-option ${form.sport === s.value ? 'active' : ''}`}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skill level */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wider mb-3 block">Skill Level</label>
              <div className="flex gap-2">
                {SKILLS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm({ ...form, skillLevel: s.value })}
                    className={`skill-option ${form.skillLevel === s.value ? `${s.value}-active` : ''}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Bio</label>
              <input
                type="text"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                onFocus={() => setFocused('bio')}
                onBlur={() => setFocused('')}
                placeholder="Looking for a cricket match!"
                className={`input-field ${focused === 'bio' ? 'input-focused' : ''}`}
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 flex-wrap">
              <button type="button" onClick={handleLocation} className="btn-location">
                📍 Detect My Location
              </button>
              {form.coordinates[0] && (
                <span className="text-xs text-gray-600 bg-white/3 border border-white/6 px-3 py-2 rounded-xl">
                  {parseFloat(form.coordinates[1]).toFixed(4)}, {parseFloat(form.coordinates[0]).toFixed(4)}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving...
                  </span>
                ) : 'Mark Available ✅'}
              </button>
              <button type="button" onClick={handleOffline} className="btn-danger">
                Go Offline 🔴
              </button>
            </div>
          </form>
        </div>

        {/* Bookings */}
        <div className="animate-fadeUp-4 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-label mb-1">History</p>
              <h2 className="text-lg font-semibold text-white">My Bookings</h2>
            </div>
            <Link
              to="/map"
              className="text-sm text-green-400 hover:text-green-300 transition-colors border border-green-400/20 hover:border-green-400/40 px-4 py-2 rounded-xl"
            >
              Find Grounds →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🏟️</p>
              <p className="text-gray-600 text-sm">No bookings yet.</p>
              <Link to="/map" className="text-green-400 text-sm hover:text-green-300 transition-colors mt-2 inline-block">
                Book your first ground →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{booking.ground?.name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{booking.date} · {booking.startTime} – {booking.endTime}</p>
                    <p className="text-green-400 text-xs font-semibold mt-1">₹{booking.totalPrice}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`status-badge ${
                      booking.status === 'confirmed' ? 'bg-green-400/10 text-green-400' :
                      booking.status === 'cancelled' ? 'bg-red-400/10 text-red-400' :
                      'bg-yellow-400/10 text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-xs text-red-400/60 hover:text-red-400 transition-colors border border-red-400/10 hover:border-red-400/30 px-3 py-1 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PlayerDashboard;