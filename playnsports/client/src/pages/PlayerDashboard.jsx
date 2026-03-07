import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

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
    } catch {
      setProfile(null);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data);
    } catch {
      setBookings([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({ ...form, coordinates: [pos.coords.longitude, pos.coords.latitude] });
      setMessage('Location detected ✅');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.post('/players/availability', form);
      setMessage('Availability updated ✅');
      fetchProfile();
    } catch {
      setMessage('Failed to update availability ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleOffline = async () => {
    try {
      await API.patch('/players/offline');
      setMessage('You are now offline');
      fetchProfile();
    } catch {
      setMessage('Failed to go offline ❌');
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await API.patch(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch {
      setMessage('Failed to cancel booking ❌');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-green-400 mb-8">Player Dashboard</h1>

        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Set Availability</h2>

          {message && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Sport</label>
                <select
                  name="sport"
                  value={form.sport}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="football">Football</option>
                  <option value="cricket">Cricket</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="badminton">Badminton</option>
                  <option value="volleyball">Volleyball</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Skill Level</label>
                <select
                  name="skillLevel"
                  value={form.skillLevel}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Bio</label>
              <input
                type="text"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Looking for a cricket match!"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleLocation}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded-lg text-sm font-semibold transition"
              >
                📍 Detect My Location
              </button>
              {form.coordinates[0] && (
                <span className="text-gray-400 text-sm">
                  {form.coordinates[1]}, {form.coordinates[0]}
                </span>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-800 px-6 py-3 rounded-lg font-semibold transition"
              >
                {loading ? 'Saving...' : 'Mark Available ✅'}
              </button>
              <button
                type="button"
                onClick={handleOffline}
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                Go Offline 🔴
              </button>
            </div>
          </form>
        </div>

        {profile && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Sport</p>
                <p className="text-green-400 font-bold capitalize">{profile.sport}</p>
              </div>
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Status</p>
                <p className={`font-bold ${profile.isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                  {profile.isAvailable ? 'Available' : 'Offline'}
                </p>
              </div>
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Skill</p>
                <p className="text-green-400 font-bold capitalize">{profile.skillLevel}</p>
              </div>
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Bookings</p>
                <p className="text-green-400 font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Bookings</h2>
            <Link to="/map" className="text-green-400 text-sm hover:underline">Find Grounds →</Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-gray-400 text-sm">No bookings yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-gray-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{booking.ground?.name}</p>
                    <p className="text-gray-400 text-sm">{booking.date} • {booking.startTime} - {booking.endTime}</p>
                    <p className="text-green-400 text-sm">₹{booking.totalPrice}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-400 text-xs hover:underline"
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