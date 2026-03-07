import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const GroundOwnerDashboard = () => {
  const [grounds, setGrounds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedGround, setSelectedGround] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [groundForm, setGroundForm] = useState({
    name: '',
    sport: 'cricket',
    address: '',
    pricePerHour: '',
    coordinates: ['', ''],
    amenities: '',
  });

  const [slotForm, setSlotForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      const { data } = await API.get('/grounds/my');
      setGrounds(data);
    } catch {
      setGrounds([]);
    }
  };

  const fetchBookings = async (groundId) => {
    try {
      const { data } = await API.get(`/bookings/grounds/${groundId}`);
      setBookings(data);
      setSelectedGround(groundId);
    } catch {
      setBookings([]);
    }
  };

  const handleGroundChange = (e) => {
    setGroundForm({ ...groundForm, [e.target.name]: e.target.value });
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setGroundForm({ ...groundForm, coordinates: [pos.coords.longitude, pos.coords.latitude] });
      setMessage('Location detected ✅');
    });
  };

  const handleCreateGround = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.post('/grounds', {
        ...groundForm,
        pricePerHour: Number(groundForm.pricePerHour),
        amenities: groundForm.amenities.split(',').map((a) => a.trim()),
      });
      setMessage('Ground created ✅');
      fetchGrounds();
      setGroundForm({ name: '', sport: 'cricket', address: '', pricePerHour: '', coordinates: ['', ''], amenities: '' });
    } catch {
      setMessage('Failed to create ground ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!selectedGround) return;
    try {
      await API.post(`/grounds/${selectedGround}/slots`, { slots: [slotForm] });
      setMessage('Slot added ✅');
      setSlotForm({ date: '', startTime: '', endTime: '' });
    } catch {
      setMessage('Failed to add slot ❌');
    }
  };

  const handleDeleteGround = async (id) => {
    try {
      await API.delete(`/grounds/${id}`);
      setMessage('Ground deleted ✅');
      fetchGrounds();
    } catch {
      setMessage('Failed to delete ground ❌');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-green-400 mb-8">Ground Owner Dashboard</h1>

        {message && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">List a New Ground</h2>
          <form onSubmit={handleCreateGround} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Ground Name</label>
                <input
                  type="text"
                  name="name"
                  value={groundForm.name}
                  onChange={handleGroundChange}
                  placeholder="Punjab Cricket Ground"
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Sport</label>
                <select
                  name="sport"
                  value={groundForm.sport}
                  onChange={handleGroundChange}
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
                <label className="text-sm text-gray-400 mb-1 block">Address</label>
                <input
                  type="text"
                  name="address"
                  value={groundForm.address}
                  onChange={handleGroundChange}
                  placeholder="Jalandhar, Punjab"
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Price Per Hour (₹)</label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={groundForm.pricePerHour}
                  onChange={handleGroundChange}
                  placeholder="500"
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Amenities (comma separated)</label>
              <input
                type="text"
                name="amenities"
                value={groundForm.amenities}
                onChange={handleGroundChange}
                placeholder="parking, washroom, floodlights"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleLocation}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded-lg text-sm font-semibold transition"
              >
                📍 Detect Location
              </button>
              {groundForm.coordinates[0] && (
                <span className="text-gray-400 text-sm">
                  {groundForm.coordinates[1]}, {groundForm.coordinates[0]}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-800 px-6 py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Creating...' : 'Create Ground 🏟️'}
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Slot to Ground</h2>
          <form onSubmit={handleAddSlot} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Select Ground</label>
              <select
                value={selectedGround || ''}
                onChange={(e) => setSelectedGround(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select a ground</option>
                {grounds.map((g) => (
                  <option key={g._id} value={g._id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Date</label>
                <input
                  type="date"
                  value={slotForm.date}
                  onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Start Time</label>
                <input
                  type="time"
                  value={slotForm.startTime}
                  onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">End Time</label>
                <input
                  type="time"
                  value={slotForm.endTime}
                  onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Add Slot ➕
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">My Grounds</h2>
          {grounds.length === 0 ? (
            <p className="text-gray-400 text-sm">No grounds listed yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {grounds.map((ground) => (
                <div key={ground._id} className="bg-gray-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{ground.name}</p>
                    <p className="text-gray-400 text-sm capitalize">{ground.sport} • {ground.address}</p>
                    <p className="text-green-400 text-sm">₹{ground.pricePerHour}/hr • {ground.slots.length} slots</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => fetchBookings(ground._id)}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm transition"
                    >
                      Bookings
                    </button>
                    <button
                      onClick={() => handleDeleteGround(ground._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {bookings.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Ground Bookings</h2>
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-gray-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{booking.player?.name}</p>
                    <p className="text-gray-400 text-sm">{booking.date} • {booking.startTime} - {booking.endTime}</p>
                    <p className="text-gray-400 text-sm">📞 {booking.player?.phone}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {booking.status}
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

export default GroundOwnerDashboard;