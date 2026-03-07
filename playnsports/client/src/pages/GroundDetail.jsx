import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const GroundDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ground, setGround] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedSlotId, setBookedSlotId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.92); }
        to { opacity: 1; transform: scale(1); }
      }

      .animate-fadeUp-1 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; opacity: 0; }
      .animate-fadeUp-2 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; opacity: 0; }
      .animate-fadeUp-3 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s forwards; opacity: 0; }
      .animate-fadeUp-4 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s forwards; opacity: 0; }
      .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      .animate-slideIn { animation: slideIn 0.3s ease forwards; }
      .animate-popIn { animation: popIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }

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

      .section-label {
        font-size: 11px; color: rgba(255,255,255,0.25);
        text-transform: uppercase; letter-spacing: 0.1em;
        font-family: 'DM Sans', sans-serif;
      }

      .amenity-pill {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 100px;
        padding: 5px 14px;
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        text-transform: capitalize;
        font-family: 'DM Sans', sans-serif;
        transition: all 0.2s ease;
      }
      .amenity-pill:hover {
        background: rgba(255,255,255,0.07);
        color: rgba(255,255,255,0.8);
      }

      /* Slot cards */
      .slot-available {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 18px;
        padding: 16px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        transition: all 0.25s ease;
      }
      .slot-available:hover {
        background: rgba(74,222,128,0.04);
        border-color: rgba(74,222,128,0.2);
        transform: translateY(-1px);
      }

      .slot-booked {
        background: rgba(255,255,255,0.01);
        border: 1px solid rgba(255,255,255,0.04);
        border-radius: 18px;
        padding: 16px 18px;
        opacity: 0.45;
      }

      .btn-book {
        background: linear-gradient(135deg, #4ade80, #22c55e);
        color: black; font-weight: 700; font-size: 13px;
        border-radius: 12px; padding: 9px 18px;
        transition: all 0.3s ease; position: relative; overflow: hidden;
        font-family: 'DM Sans', sans-serif;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .btn-book::before {
        content: ''; position: absolute; top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
        transition: left 0.4s ease;
      }
      .btn-book:hover::before { left: 100%; }
      .btn-book:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(74,222,128,0.3); }
      .btn-book:disabled { opacity: 0.5; transform: none; box-shadow: none; }

      .btn-back {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        color: rgba(255,255,255,0.4);
        border-radius: 12px; padding: 9px 16px;
        font-size: 13px; font-weight: 500;
        transition: all 0.2s ease;
        font-family: 'DM Sans', sans-serif;
        display: flex; align-items: center; gap: 6px;
      }
      .btn-back:hover {
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.8);
        border-color: rgba(255,255,255,0.12);
      }

      /* Skeleton loader */
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.7; }
      }
      .skeleton {
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => { fetchGround(); }, [id]);

  const fetchGround = async () => {
    try {
      const { data } = await API.get(`/grounds/${id}`);
      setGround(data);
    } catch {
      setError('Ground not found');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId) => {
    if (user?.role !== 'player') { setError('Only players can book slots'); return; }
    setBookingLoading(true);
    setBookedSlotId(slotId);
    setMessage(''); setError('');
    try {
      await API.post(`/bookings/grounds/${id}/book`, { slotId });
      setMessage('Slot booked successfully ✅');
      fetchGround();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed ❌');
    } finally {
      setBookingLoading(false);
      setBookedSlotId(null);
    }
  };

  const sportEmojis = { football: '⚽', cricket: '🏏', basketball: '🏀', tennis: '🎾', badminton: '🏸', volleyball: '🏐' };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060606] text-white">
        <div className="fixed inset-0 grid-dots pointer-events-none opacity-30" />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="skeleton h-8 w-24 mb-8" />
          <div className="card p-6 mb-6">
            <div className="skeleton h-9 w-64 mb-3" />
            <div className="skeleton h-4 w-48 mb-2" />
            <div className="skeleton h-4 w-40" />
          </div>
          <div className="card p-6">
            <div className="skeleton h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!ground) {
    return (
      <div className="min-h-screen bg-[#060606] text-white">
        <div className="fixed inset-0 grid-dots pointer-events-none opacity-30" />
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <p className="text-6xl">🏟️</p>
          <p className="text-red-400 text-lg font-semibold">Ground not found</p>
          <button onClick={() => navigate(-1)} className="btn-back">← Go Back</button>
        </div>
      </div>
    );
  }

  const availableSlots = ground.slots.filter(s => !s.isBooked);
  const bookedSlots = ground.slots.filter(s => s.isBooked);

  return (
    <div className="min-h-screen bg-[#060606] text-white relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 grid-dots pointer-events-none opacity-30" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.03) 0%, transparent 70%)' }} />

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Back button */}
        <div className="animate-fadeUp-1 mb-7">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
        </div>

        {/* Toast messages */}
        {message && (
          <div className="animate-slideIn bg-green-400/8 border border-green-400/20 text-green-400 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-2">
            <span>✅</span> {message}
          </div>
        )}
        {error && (
          <div className="animate-slideIn bg-red-400/8 border border-red-400/20 text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Ground info card */}
        <div className="animate-fadeUp-2 card p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{sportEmojis[ground.sport] || '🏅'}</span>
                <h1 className="font-bebas text-4xl tracking-wide shimmer-text leading-none">{ground.name}</h1>
              </div>
              <p className="text-gray-600 text-sm mt-2">📍 {ground.address}</p>
              <p className="text-gray-600 text-sm mt-1 capitalize">🏟️ {ground.sport}</p>
              <p className="text-gray-600 text-sm mt-1">
                👤 {ground.owner?.name}
                {ground.owner?.phone && <span className="ml-2">· 📞 {ground.owner.phone}</span>}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bebas text-5xl text-green-400 leading-none">₹{ground.pricePerHour}</p>
              <p className="text-gray-600 text-xs mt-1">per hour</p>
            </div>
          </div>

          {ground.amenities?.length > 0 && (
            <div className="mt-5 pt-5 border-t border-white/5">
              <p className="section-label mb-3">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {ground.amenities.map((amenity, i) => (
                  <span key={i} className="amenity-pill">✓ {amenity}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Slots */}
        <div className="animate-fadeUp-3 card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-label mb-1">Booking</p>
              <h2 className="text-lg font-semibold text-white">
                Available Slots
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-green-400/10 text-green-400 border border-green-400/20">
              {availableSlots.length} open
            </span>
          </div>

          {availableSlots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">😔</p>
              <p className="text-gray-600 text-sm">No available slots right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableSlots.map((slot) => (
                <div key={slot._id} className="slot-available animate-popIn">
                  <div>
                    <p className="font-semibold text-white text-sm">📅 {slot.date}</p>
                    <p className="text-gray-600 text-xs mt-0.5">🕐 {slot.startTime} – {slot.endTime}</p>
                    <p className="text-green-400 text-xs font-semibold mt-1">₹{ground.pricePerHour}</p>
                  </div>
                  {user?.role === 'player' && (
                    <button
                      onClick={() => handleBookSlot(slot._id)}
                      disabled={bookingLoading}
                      className="btn-book"
                    >
                      {bookingLoading && bookedSlotId === slot._id ? (
                        <span className="flex items-center gap-1.5">
                          <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Booking...
                        </span>
                      ) : 'Book →'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booked Slots */}
        {bookedSlots.length > 0 && (
          <div className="animate-fadeUp-4 card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="section-label mb-1">Unavailable</p>
                <h2 className="text-lg font-semibold text-white">Booked Slots</h2>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-400/10 text-red-400 border border-red-400/20">
                {bookedSlots.length} booked
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookedSlots.map((slot) => (
                <div key={slot._id} className="slot-booked">
                  <p className="font-semibold text-white text-sm">📅 {slot.date}</p>
                  <p className="text-gray-600 text-xs mt-0.5">🕐 {slot.startTime} – {slot.endTime}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-red-400/70 bg-red-400/8 border border-red-400/15 px-3 py-0.5 rounded-full">
                    Booked
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GroundDetail;