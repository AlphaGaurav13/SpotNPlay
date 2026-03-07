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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGround();
  }, [id]);

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
    if (user?.role !== 'player') {
      setError('Only players can book slots');
      return;
    }
    setBookingLoading(true);
    setMessage('');
    setError('');
    try {
      await API.post(`/bookings/grounds/${id}/book`, { slotId });
      setMessage('Slot booked successfully ✅');
      fetchGround();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed ❌');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-gray-400 text-lg">Loading ground details...</p>
        </div>
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-red-400 text-lg">Ground not found</p>
        </div>
      </div>
    );
  }

  const availableSlots = ground.slots.filter((slot) => !slot.isBooked);
  const bookedSlots = ground.slots.filter((slot) => slot.isBooked);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">

        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition"
        >
          ← Back
        </button>

        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{ground.name}</h1>
              <p className="text-gray-400">📍 {ground.address}</p>
              <p className="text-gray-400 capitalize mt-1">🏟️ {ground.sport}</p>
              <p className="text-gray-400 mt-1">👤 Owner: {ground.owner?.name} • 📞 {ground.owner?.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-400">₹{ground.pricePerHour}</p>
              <p className="text-gray-400 text-sm">per hour</p>
            </div>
          </div>

          {ground.amenities?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {ground.amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full capitalize"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        {message && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Available Slots
            <span className="text-green-400 text-sm ml-2">({availableSlots.length} available)</span>
          </h2>

          {availableSlots.length === 0 ? (
            <p className="text-gray-400 text-sm">No available slots right now.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSlots.map((slot) => (
                <div
                  key={slot._id}
                  className="bg-gray-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">📅 {slot.date}</p>
                    <p className="text-gray-400 text-sm">
                      🕐 {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-green-400 text-sm">₹{ground.pricePerHour}</p>
                  </div>
                  {user?.role === 'player' && (
                    <button
                      onClick={() => handleBookSlot(slot._id)}
                      disabled={bookingLoading}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-green-800 px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {bookedSlots.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Booked Slots
              <span className="text-red-400 text-sm ml-2">({bookedSlots.length} booked)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookedSlots.map((slot) => (
                <div
                  key={slot._id}
                  className="bg-gray-700 rounded-xl p-4 opacity-60"
                >
                  <p className="font-semibold text-white">📅 {slot.date}</p>
                  <p className="text-gray-400 text-sm">
                    🕐 {slot.startTime} - {slot.endTime}
                  </p>
                  <span className="text-red-400 text-xs">Booked</span>
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