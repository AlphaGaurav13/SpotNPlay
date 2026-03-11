import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    fetchStats();
    fetchCoaches();
  }, [user]);

  useEffect(() => { fetchCoaches(); }, [filter]);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch {}
  };

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/coaches?status=${filter}`);
      setCoaches(data);
    } catch { setCoaches([]); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      await API.patch(`/admin/coaches/${id}/approve`);
      setMessage('Coach approved! ✅');
      fetchCoaches();
      fetchStats();
      setTimeout(() => setMessage(''), 3000);
    } catch {}
  };

  const handleReject = async () => {
    try {
      await API.patch(`/admin/coaches/${rejectModal}/reject`, { reason: rejectReason });
      setMessage('Coach rejected');
      setRejectModal(null);
      setRejectReason('');
      fetchCoaches();
      fetchStats();
      setTimeout(() => setMessage(''), 3000);
    } catch {}
  };

  const SPORT_EMOJI = { football: '⚽', cricket: '🏏', basketball: '🏀', tennis: '🎾', badminton: '🏸', volleyball: '🏐', boxing: '🥊' };

  return (
    <div className="min-h-screen bg-[#060606] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <Navbar />

      {message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium bg-green-400/15 border border-green-400/25 text-green-400 shadow-2xl">
          {message}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-4">Reject Coach Application</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="flex-1 bg-white/5 border border-white/10 text-gray-400 rounded-xl py-3 text-sm font-semibold hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button onClick={handleReject} className="flex-1 bg-red-400/15 border border-red-400/25 text-red-400 rounded-xl py-3 text-sm font-semibold hover:bg-red-400/25 transition-all">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-green-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
          <h1 className="text-5xl font-black tracking-wide text-white" style={{ fontFamily: 'Bebas Neue, cursive' }}>ADMIN PANEL</h1>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, color: '#4ade80' },
              { label: 'Total Coaches', value: stats.totalCoaches, color: '#60a5fa' },
              { label: 'Pending Review', value: stats.pendingCoaches, color: '#fbbf24' },
              { label: 'Approved', value: stats.approvedCoaches, color: '#4ade80' },
            ].map((s, i) => (
              <div key={i} className="bg-white/2 border border-white/6 rounded-2xl p-5">
                <p style={{ color: s.color }} className="font-black text-3xl" style={{ fontFamily: 'Bebas Neue, cursive', color: s.color }}>{s.value}</p>
                <p className="text-gray-600 text-xs uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize"
              style={filter === f ? {
                background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)'
              } : {
                background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              {f} Coaches
            </button>
          ))}
        </div>

        {/* Coaches List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
          </div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-16 text-gray-600">No {filter} coaches</div>
        ) : (
          <div className="flex flex-col gap-4">
            {coaches.map((coach) => (
              <div key={coach._id} className="bg-white/2 border border-white/6 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {coach.user?.avatar ? (
                    <img src={coach.user.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center text-green-400 font-bold">
                      {coach.fullName?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{coach.fullName}</p>
                    <p className="text-gray-600 text-xs">@{coach.username} · {coach.user?.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-white/5 border border-white/8 text-gray-400 px-2 py-0.5 rounded-full capitalize">
                        {SPORT_EMOJI[coach.sport]} {coach.sport}
                      </span>
                      <span className="text-xs bg-white/5 border border-white/8 text-gray-400 px-2 py-0.5 rounded-full capitalize">
                        {coach.coachingLevel}
                      </span>
                      <span className="text-xs bg-white/5 border border-white/8 text-gray-400 px-2 py-0.5 rounded-full">
                        {coach.experience} yrs · 📍 {coach.city}, {coach.state}
                      </span>
                    </div>
                    {coach.bio && <p className="text-gray-600 text-xs mt-1 line-clamp-1">{coach.bio}</p>}
                    {coach.rejectionReason && (
                      <p className="text-red-400 text-xs mt-1">Reason: {coach.rejectionReason}</p>
                    )}
                  </div>
                </div>

                {filter === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(coach._id)}
                      className="bg-green-400/15 border border-green-400/25 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-400/25 transition-all"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => setRejectModal(coach._id)}
                      className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-400/20 transition-all"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;