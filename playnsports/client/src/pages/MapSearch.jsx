import { useState, useEffect } from 'react';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const playerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const groundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getAreaName = async (lat, lng) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await res.json();
    const addr = data.address;
    return addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city || addr.county || 'Unknown Area';
  } catch {
    return 'Unknown Area';
  }
};

const MapSearch = () => {
  const { user } = useAuth();
  const [position, setPosition] = useState(null);
  const [players, setPlayers] = useState([]);
  const [grounds, setGrounds] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [playerAreas, setPlayerAreas] = useState({});
  const [sport, setSport] = useState('');
  const [radius, setRadius] = useState(5000);
  const [activeTab, setActiveTab] = useState('players');
  const [loading, setLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState({});
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      .font-bebas { font-family: 'Bebas Neue', cursive !important; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes shimmer {
        from { background-position: -200% center; }
        to { background-position: 200% center; }
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes slideRight {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes cardIn {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .animate-fadeUp-1 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards; opacity: 0; }
      .animate-fadeUp-2 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s forwards; opacity: 0; }
      .animate-fadeUp-3 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s forwards; opacity: 0; }
      .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
      .animate-cardIn { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

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

      .map-container .leaflet-container {
        background: #0a0a0a !important;
        border-radius: 20px;
      }

      .leaflet-tile {
        filter: brightness(0.7) saturate(0.4) hue-rotate(180deg) invert(1) !important;
      }

      .filter-panel {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 20px;
        padding: 20px;
        backdrop-blur: 20px;
      }

      .select-field {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 11px 14px;
        color: white;
        font-size: 14px;
        outline: none;
        transition: all 0.3s ease;
        cursor: pointer;
        appearance: none;
        font-family: 'DM Sans', sans-serif;
      }
      .select-field:focus, .select-field:hover {
        border-color: rgba(74,222,128,0.4);
        background: rgba(255,255,255,0.06);
      }
      .select-field option { background: #111; }

      .search-btn {
        background: linear-gradient(135deg, #4ade80, #22c55e);
        color: black;
        font-weight: 700;
        border-radius: 12px;
        padding: 11px 24px;
        font-size: 14px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        font-family: 'DM Sans', sans-serif;
      }
      .search-btn::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.4s ease;
      }
      .search-btn:hover::before { left: 100%; }
      .search-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(74,222,128,0.35); }
      .search-btn:disabled { opacity: 0.5; transform: none; box-shadow: none; }

      .tab-btn {
        flex: 1;
        padding: 10px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.3s ease;
        font-family: 'DM Sans', sans-serif;
      }
      .tab-active {
        background: rgba(74,222,128,0.15);
        color: #4ade80;
        border: 1px solid rgba(74,222,128,0.25);
      }
      .tab-inactive {
        background: transparent;
        color: rgba(255,255,255,0.3);
        border: 1px solid transparent;
      }
      .tab-inactive:hover {
        color: rgba(255,255,255,0.6);
        border-color: rgba(255,255,255,0.08);
      }

      .player-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        padding: 14px;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      .player-card:hover {
        background: rgba(255,255,255,0.04);
        border-color: rgba(74,222,128,0.2);
        transform: translateX(3px);
      }

      .ground-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        padding: 14px;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      .ground-card:hover {
        background: rgba(255,255,255,0.04);
        border-color: rgba(74,222,128,0.2);
        transform: translateX(3px);
      }

      .invite-btn {
        background: rgba(74,222,128,0.08);
        border: 1px solid rgba(74,222,128,0.2);
        color: #4ade80;
        font-size: 11px;
        font-weight: 600;
        border-radius: 8px;
        padding: 5px 10px;
        transition: all 0.2s ease;
        font-family: 'DM Sans', sans-serif;
      }
      .invite-btn:hover {
        background: rgba(74,222,128,0.15);
        border-color: rgba(74,222,128,0.4);
      }
      .invite-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .skill-badge {
        font-size: 10px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 100px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .skill-beginner { background: rgba(234,179,8,0.1); color: #eab308; border: 1px solid rgba(234,179,8,0.2); }
      .skill-intermediate { background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2); }
      .skill-advanced { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }

      .stat-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 100px;
        padding: 4px 10px;
        font-size: 12px;
        color: rgba(255,255,255,0.4);
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        gap: 12px;
        color: rgba(255,255,255,0.2);
      }

      .leaflet-popup-content-wrapper {
        background: #111 !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 14px !important;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8) !important;
        color: white !important;
      }
      .leaflet-popup-tip { background: #111 !important; }
      .leaflet-popup-close-button { color: rgba(255,255,255,0.4) !important; }
      .leaflet-popup-close-button:hover { color: white !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
    if (user?.role === 'player') fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    try {
      const { data } = await API.get('/groups/my');
      setMyGroups(data.filter((g) => g.isOpen && g.createdBy._id === user._id));
    } catch {
      setMyGroups([]);
    }
  };

  const handleSearch = async () => {
    if (!position) return;
    setLoading(true);
    try {
      const params = `longitude=${position[1]}&latitude=${position[0]}&radius=${radius}${sport ? `&sport=${sport}` : ''}`;
      const [playersRes, groundsRes] = await Promise.all([
        API.get(`/players/nearby?${params}`),
        API.get(`/grounds/nearby?${params}`),
      ]);
      setPlayers(playersRes.data);
      setGrounds(groundsRes.data);
      setSearched(true);

      const areas = {};
      await Promise.all(
        playersRes.data.map(async (player) => {
          const lat = player.location.coordinates[1];
          const lng = player.location.coordinates[0];
          areas[player._id] = await getAreaName(lat, lng);
        })
      );
      setPlayerAreas(areas);
    } catch {
      setPlayers([]);
      setGrounds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (playerId, groupId) => {
    try {
      await API.post(`/groups/${groupId}/invite`, { userId: playerId });
      setInviteStatus({ ...inviteStatus, [playerId]: 'sent' });
    } catch (err) {
      setInviteStatus({ ...inviteStatus, [playerId]: 'failed' });
    }
  };

  const getSkillClass = (level) => {
    if (level === 'beginner') return 'skill-beginner';
    if (level === 'intermediate') return 'skill-intermediate';
    return 'skill-advanced';
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="fixed inset-0 grid-dots pointer-events-none opacity-30" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-green-400/20 to-transparent pointer-events-none" />

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-fadeUp-1 mb-6">
          <p className="text-green-400 text-xs uppercase tracking-[0.3em] mb-1">Live Map</p>
          <h1 className="font-bebas text-4xl md:text-5xl tracking-wide shimmer-text">
            FIND PLAYERS & GROUNDS
          </h1>
        </div>

        <div className="animate-fadeUp-2 filter-panel mb-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-600 uppercase tracking-wider">Sport</label>
              <select value={sport} onChange={(e) => setSport(e.target.value)} className="select-field">
                <option value="">All Sports</option>
                <option value="football">⚽ Football</option>
                <option value="cricket">🏏 Cricket</option>
                <option value="basketball">🏀 Basketball</option>
                <option value="tennis">🎾 Tennis</option>
                <option value="badminton">🏸 Badminton</option>
                <option value="volleyball">🏐 Volleyball</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-600 uppercase tracking-wider">Radius</label>
              <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="select-field">
                <option value={2000}>📍 2 km</option>
                <option value={5000}>📍 5 km</option>
                <option value={10000}>📍 10 km</option>
              </select>
            </div>

            <button onClick={handleSearch} disabled={loading || !position} className="search-btn">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Searching...
                </span>
              ) : '🔍 Search Now'}
            </button>

            {searched && (
              <div className="animate-fadeIn flex items-center gap-4 ml-auto">
                <div className="stat-chip">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  {players.length} Players
                </div>
                <div className="stat-chip">
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                  {grounds.length} Grounds
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="animate-fadeUp-3 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 map-container rounded-3xl overflow-hidden border border-white/6" style={{ height: '560px' }}>
            {position ? (
              <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution=""
                />

                <Marker position={position}>
                  <Popup>
                    <div style={{ color: 'white', fontSize: '13px' }}>
                      <strong>📍 You are here</strong>
                      <p style={{ color: '#4ade80', margin: '4px 0 0' }}>{user?.name}</p>
                    </div>
                  </Popup>
                </Marker>

                <Circle
                  center={position}
                  radius={radius}
                  pathOptions={{ color: '#4ade80', fillColor: '#4ade80', fillOpacity: 0.04, weight: 1, dashArray: '6' }}
                />

                {players.map((player) => {
                  const lat = player.location.coordinates[1];
                  const lng = player.location.coordinates[0];
                  const area = playerAreas[player._id] || '';
                  return (
                    <React.Fragment key={player._id}>
                      <Circle
                        center={[lat, lng]}
                        radius={120}
                        pathOptions={{ color: '#4ade80', fillColor: '#4ade80', fillOpacity: 0.12, weight: 1.5 }}
                      />
                      <Marker position={[lat, lng]} icon={playerIcon}>
                        <Popup>
                          <div style={{ color: 'white', fontSize: '13px', minWidth: '160px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              {player.user?.avatar ? (
                                <img src={player.user.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4ade80' }} />
                              ) : (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#4ade80', fontWeight: 'bold' }}>
                                  {player.user?.name?.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div style={{ fontWeight: 700, color: 'white' }}>{player.user?.name}</div>
                                {area && <div style={{ fontSize: '11px', color: '#6b7280' }}>📍 {area}</div>}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                              <span style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>
                                {player.sport}
                              </span>
                              <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>
                                {player.skillLevel}
                              </span>
                            </div>
                            {player.bio && <p style={{ color: '#6b7280', fontSize: '11px', margin: '4px 0' }}>{player.bio}</p>}
                            <p style={{ color: '#9ca3af', fontSize: '12px' }}>📞 {player.user?.phone}</p>
                            {user?.role === 'player' && player.user?._id !== user._id && myGroups.length > 0 && (
                              <div style={{ marginTop: '8px' }}>
                                {myGroups.map((group) => (
                                  <button
                                    key={group._id}
                                    onClick={() => handleInvite(player.user._id, group._id)}
                                    disabled={inviteStatus[player.user._id] === 'sent'}
                                    style={{
                                      width: '100%', marginTop: '4px',
                                      background: inviteStatus[player.user._id] === 'sent' ? 'rgba(255,255,255,0.05)' : 'rgba(74,222,128,0.15)',
                                      border: '1px solid rgba(74,222,128,0.3)',
                                      color: inviteStatus[player.user._id] === 'sent' ? '#6b7280' : '#4ade80',
                                      fontSize: '12px', fontWeight: 600,
                                      padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
                                    }}
                                  >
                                    {inviteStatus[player.user._id] === 'sent' ? '✅ Invited' : `Invite to ${group.name}`}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  );
                })}

                {grounds.map((ground) => (
                  <Marker
                    key={ground._id}
                    position={[ground.location.coordinates[1], ground.location.coordinates[0]]}
                    icon={groundIcon}
                  >
                    <Popup>
                      <div style={{ color: 'white', fontSize: '13px', minWidth: '160px' }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{ground.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>📍 {ground.address}</div>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>
                            {ground.sport}
                          </span>
                        </div>
                        <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>₹{ground.pricePerHour}/hr</div>
                        <button
                          onClick={() => navigate(`/grounds/${ground._id}`)}
                          style={{
                            width: '100%', background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                            color: 'black', fontWeight: 700, fontSize: '12px',
                            padding: '8px', borderRadius: '8px', cursor: 'pointer',
                          }}
                        >
                          View & Book →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="h-full bg-white/2 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                <p className="text-gray-600 text-sm">Getting your location...</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3" style={{ height: '560px' }}>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('players')} className={`tab-btn ${activeTab === 'players' ? 'tab-active' : 'tab-inactive'}`}>
                🟢 Players {searched && `(${players.length})`}
              </button>
              <button onClick={() => setActiveTab('grounds')} className={`tab-btn ${activeTab === 'grounds' ? 'tab-active' : 'tab-inactive'}`}>
                🔵 Grounds {searched && `(${grounds.length})`}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {activeTab === 'players' && (
                <>
                  {!searched ? (
                    <div className="empty-state">
                      <span className="text-4xl">🗺️</span>
                      <p className="text-sm">Search to find nearby players</p>
                    </div>
                  ) : players.length === 0 ? (
                    <div className="empty-state">
                      <span className="text-4xl">😕</span>
                      <p className="text-sm">No players found in this area</p>
                      <p className="text-xs opacity-60">Try increasing the radius</p>
                    </div>
                  ) : (
                    players.map((player, i) => (
                      <div key={player._id} className="player-card animate-cardIn" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex items-center gap-3 mb-2">
                          {player.user?.avatar ? (
                            <img src={player.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-green-400/30 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center text-green-400 font-bold flex-shrink-0">
                              {player.user?.name?.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{player.user?.name}</p>
                            {playerAreas[player._id] && (
                              <p className="text-gray-600 text-xs truncate">📍 {playerAreas[player._id]}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-green-400 text-xs">Live</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-xs bg-white/5 border border-white/8 text-gray-400 px-2 py-0.5 rounded-full capitalize">⚽ {player.sport}</span>
                          <span className={`skill-badge ${getSkillClass(player.skillLevel)}`}>{player.skillLevel}</span>
                        </div>

                        {player.bio && <p className="text-gray-600 text-xs mb-2 line-clamp-1">{player.bio}</p>}
                        <p className="text-gray-600 text-xs mb-2">📞 {player.user?.phone}</p>

                        {user?.role === 'player' && player.user?._id !== user._id && myGroups.length > 0 && (
                          <div className="flex flex-col gap-1">
                            {myGroups.map((group) => (
                              <button
                                key={group._id}
                                onClick={() => handleInvite(player.user._id, group._id)}
                                disabled={inviteStatus[player.user._id] === 'sent'}
                                className="invite-btn"
                              >
                                {inviteStatus[player.user._id] === 'sent' ? '✅ Invited' : `+ Invite to ${group.name}`}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'grounds' && (
                <>
                  {!searched ? (
                    <div className="empty-state">
                      <span className="text-4xl">🏟️</span>
                      <p className="text-sm">Search to find nearby grounds</p>
                    </div>
                  ) : grounds.length === 0 ? (
                    <div className="empty-state">
                      <span className="text-4xl">😕</span>
                      <p className="text-sm">No grounds found in this area</p>
                    </div>
                  ) : (
                    grounds.map((ground, i) => (
                      <div
                        key={ground._id}
                        onClick={() => navigate(`/grounds/${ground._id}`)}
                        className="ground-card animate-cardIn"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-semibold text-white text-sm">{ground.name}</p>
                          <span className="text-green-400 font-bold text-sm flex-shrink-0">₹{ground.pricePerHour}/hr</span>
                        </div>
                        <p className="text-gray-600 text-xs mb-2">📍 {ground.address}</p>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-xs bg-blue-400/8 border border-blue-400/15 text-blue-400 px-2 py-0.5 rounded-full capitalize">🏟️ {ground.sport}</span>
                          <span className="text-xs bg-white/4 border border-white/8 text-gray-500 px-2 py-0.5 rounded-full">{ground.slots?.filter(s => !s.isBooked).length || 0} slots free</span>
                        </div>
                        <p className="text-green-400/60 text-xs">Tap to view & book →</p>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSearch;