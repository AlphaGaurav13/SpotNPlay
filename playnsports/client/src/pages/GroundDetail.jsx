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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [myPayments, setMyPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('slots');

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
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes cardIn {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .animate-fadeUp-1 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards; opacity: 0; }
      .animate-fadeUp-2 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s forwards; opacity: 0; }
      .animate-fadeUp-3 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s forwards; opacity: 0; }
      .animate-fadeUp-4 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s forwards; opacity: 0; }
      .animate-cardIn { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
      .animate-slideIn { animation: slideIn 0.3s ease forwards; }
      .animate-spin { animation: spin 1s linear infinite; }
      .animate-pulse { animation: pulse 2s ease-in-out infinite; }

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

      .glass-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 24px;
        padding: 24px;
      }

      .slot-card {
        border-radius: 16px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .slot-available {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.08);
      }
      .slot-available:hover {
        border-color: rgba(74,222,128,0.4);
        background: rgba(74,222,128,0.04);
        transform: translateY(-2px);
      }
      .slot-selected {
        background: rgba(74,222,128,0.08);
        border: 1px solid rgba(74,222,128,0.4);
        box-shadow: 0 0 20px rgba(74,222,128,0.1);
      }
      .slot-booked {
        background: rgba(255,255,255,0.01);
        border: 1px solid rgba(255,255,255,0.04);
        opacity: 0.4;
        cursor: not-allowed;
      }

      .pay-btn {
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
      .pay-btn::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s ease;
      }
      .pay-btn:hover::before { left: 100%; }
      .pay-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(74,222,128,0.35); }
      .pay-btn:disabled { opacity: 0.5; transform: none; box-shadow: none; }

      .final-pay-btn {
        background: rgba(59,130,246,0.12);
        border: 1px solid rgba(59,130,246,0.25);
        color: #60a5fa;
        font-weight: 600;
        font-size: 13px;
        border-radius: 10px;
        padding: 9px 18px;
        transition: all 0.2s ease;
        font-family: 'DM Sans', sans-serif;
      }
      .final-pay-btn:hover {
        background: rgba(59,130,246,0.2);
        transform: translateY(-1px);
      }

      .cancel-btn {
        background: rgba(239,68,68,0.06);
        border: 1px solid rgba(239,68,68,0.15);
        color: rgba(239,68,68,0.7);
        font-weight: 600;
        font-size: 13px;
        border-radius: 10px;
        padding: 9px 18px;
        transition: all 0.2s ease;
        font-family: 'DM Sans', sans-serif;
      }
      .cancel-btn:hover {
        background: rgba(239,68,68,0.12);
        color: #ef4444;
      }

      .tab-btn {
        padding: 10px 24px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.3s ease;
        font-family: 'DM Sans', sans-serif;
      }
      .tab-active {
        background: rgba(74,222,128,0.12);
        color: #4ade80;
        border: 1px solid rgba(74,222,128,0.2);
      }
      .tab-inactive {
        background: transparent;
        color: rgba(255,255,255,0.25);
        border: 1px solid transparent;
      }
      .tab-inactive:hover { color: rgba(255,255,255,0.5); }

      .amenity-chip {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        color: rgba(255,255,255,0.5);
        font-size: 12px;
        padding: 5px 12px;
        border-radius: 100px;
        transition: all 0.2s ease;
      }
      .amenity-chip:hover {
        border-color: rgba(74,222,128,0.2);
        color: rgba(255,255,255,0.7);
      }

      .payment-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        padding: 16px;
        transition: all 0.3s ease;
      }
      .payment-card:hover {
        border-color: rgba(74,222,128,0.15);
      }

      .status-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 100px;
      }

      .price-breakdown {
        background: rgba(74,222,128,0.04);
        border: 1px solid rgba(74,222,128,0.1);
        border-radius: 16px;
        padding: 16px;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchGround();
    if (user?.role === 'player') fetchMyPayments();
  }, [id]);

  const fetchGround = async () => {
    try {
      const { data } = await API.get(`/grounds/${id}`);
      setGround(data);
    } catch {
      showMessage('Failed to load ground', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPayments = async () => {
    try {
      const { data } = await API.get('/payments/my');
      setMyPayments(data.filter((p) => p.ground?._id === id));
    } catch {
      setMyPayments([]);
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAdvancePayment = async () => {
    if (!selectedSlot) return;
    setPaymentLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      showMessage('Razorpay failed to load. Check internet connection.', 'error');
      setPaymentLoading(false);
      return;
    }

    try {
      const { data } = await API.post(`/payments/grounds/${id}/advance-order`, {
        slotId: selectedSlot._id,
      });

      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: 'PLAYNSPORTS',
        description: `Advance (30%) — ${data.ground.name}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await API.post(`/payments/grounds/${id}/verify-advance`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              slotId: selectedSlot._id,
            });
            showMessage('Advance payment successful! Slot booked ✅');
            setSelectedSlot(null);
            fetchGround();
            fetchMyPayments();
            setActiveTab('payments');
          } catch {
            showMessage('Payment verification failed ❌', 'error');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: '#4ade80' },
        modal: {
          ondismiss: () => {
            showMessage('Payment cancelled', 'error');
            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to create order', 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFinalPayment = async (bookingId) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) return showMessage('Razorpay failed to load', 'error');

    try {
      const { data } = await API.post(`/payments/bookings/${bookingId}/final-order`);

      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: 'PLAYNSPORTS',
        description: 'Final Payment (Remaining 70%)',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await API.post(`/payments/bookings/${bookingId}/verify-final`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            showMessage('Final payment done! Booking completed 🎉');
            fetchMyPayments();
          } catch {
            showMessage('Final payment verification failed ❌', 'error');
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#4ade80' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleCancelRefund = async (bookingId) => {
    if (!window.confirm('Cancel booking and get advance refund?')) return;
    try {
      await API.post(`/payments/bookings/${bookingId}/cancel-refund`);
      showMessage('Booking cancelled & advance refunded ✅');
      fetchMyPayments();
      fetchGround();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      advance_pending: { label: 'Advance Pending', color: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' },
      advance_paid: { label: 'Advance Paid ✅', color: 'bg-blue-400/10 text-blue-400 border border-blue-400/20' },
      final_pending: { label: 'Final Due', color: 'bg-orange-400/10 text-orange-400 border border-orange-400/20' },
      completed: { label: 'Completed 🎉', color: 'bg-green-400/10 text-green-400 border border-green-400/20' },
      refunded: { label: 'Refunded', color: 'bg-gray-400/10 text-gray-400 border border-gray-400/20' },
      cancelled: { label: 'Cancelled', color: 'bg-red-400/10 text-red-400 border border-red-400/20' },
    };
    return map[status] || { label: status, color: 'bg-white/10 text-white' };
  };

  const getSportEmoji = (sport) => {
    const map = { football: '⚽', cricket: '🏏', basketball: '🏀', tennis: '🎾', badminton: '🏸', volleyball: '🏐' };
    return map[sport] || '🏆';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
          <p className="text-gray-600 text-sm">Loading ground...</p>
        </div>
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <p className="text-gray-500">Ground not found</p>
      </div>
    );
  }

  const availableSlots = ground.slots?.filter((s) => !s.isBooked) || [];
  const bookedSlots = ground.slots?.filter((s) => s.isBooked) || [];

  return (
    <div className="min-h-screen bg-[#060606] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="fixed inset-0 grid-dots pointer-events-none opacity-30" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-green-400/20 to-transparent pointer-events-none" />

      <Navbar />

      {message && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slideIn px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 shadow-2xl whitespace-nowrap ${
          messageType === 'success'
            ? 'bg-green-400/15 border border-green-400/25 text-green-400'
            : 'bg-red-400/15 border border-red-400/25 text-red-400'
        }`}>
          {messageType === 'success' ? '✅' : '⚠️'} {message}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="animate-fadeUp-1 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-white text-sm mb-5 transition-colors">
            ← Back
          </button>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-green-400 text-xs uppercase tracking-[0.3em] mb-1">Ground Detail</p>
              <h1 className="font-bebas text-4xl md:text-5xl tracking-wide shimmer-text">{ground.name}</h1>
              <p className="text-gray-500 mt-1">📍 {ground.address}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-bebas text-3xl text-green-400">₹{ground.pricePerHour}<span className="text-lg text-gray-600">/hr</span></span>
              <span className="text-xs bg-white/4 border border-white/8 text-gray-400 px-3 py-1.5 rounded-full capitalize">
                {getSportEmoji(ground.sport)} {ground.sport}
              </span>
            </div>
          </div>
        </div>

        {ground.images?.length > 0 && (
          <div className="animate-fadeUp-2 mb-6 grid grid-cols-3 gap-3">
            {ground.images.slice(0, 3).map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-video bg-white/4 border border-white/6">
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        )}

        <div className="animate-fadeUp-3 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {ground.amenities?.length > 0 && (
              <div className="glass-card">
                <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {ground.amenities.map((a, i) => (
                    <span key={i} className="amenity-chip">✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card">
              <div className="flex gap-2 mb-5">
                {[
                  { id: 'slots', label: `Available (${availableSlots.length})` },
                  { id: 'booked', label: `Booked (${bookedSlots.length})` },
                  ...(user?.role === 'player' ? [{ id: 'payments', label: `My Payments (${myPayments.length})` }] : []),
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'slots' && (
                <div className="flex flex-col gap-3">
                  {availableSlots.length === 0 ? (
                    <div className="flex flex-col items-center py-10 gap-3 text-center">
                      <span className="text-4xl">😕</span>
                      <p className="text-gray-500 text-sm">No available slots</p>
                    </div>
                  ) : availableSlots.map((slot, i) => (
                    <div
                      key={slot._id}
                      onClick={() => user?.role === 'player' && setSelectedSlot(selectedSlot?._id === slot._id ? null : slot)}
                      className={`slot-card animate-cardIn ${
                        selectedSlot?._id === slot._id ? 'slot-selected' : 'slot-available'
                      }`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold text-sm">📅 {slot.date}</p>
                          <p className="text-gray-500 text-xs mt-0.5">🕐 {slot.startTime} — {slot.endTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-sm">₹{ground.pricePerHour}</p>
                          {selectedSlot?._id === slot._id && (
                            <p className="text-green-400/60 text-xs">Selected ✓</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'booked' && (
                <div className="flex flex-col gap-3">
                  {bookedSlots.length === 0 ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <span className="text-4xl">✅</span>
                      <p className="text-gray-500 text-sm">No booked slots</p>
                    </div>
                  ) : bookedSlots.map((slot, i) => (
                    <div key={slot._id} className="slot-card slot-booked animate-cardIn" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold text-sm">📅 {slot.date}</p>
                          <p className="text-gray-500 text-xs mt-0.5">🕐 {slot.startTime} — {slot.endTime}</p>
                        </div>
                        <span className="text-xs bg-red-400/10 text-red-400 border border-red-400/20 px-3 py-1 rounded-full">Booked</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'payments' && user?.role === 'player' && (
                <div className="flex flex-col gap-3">
                  {myPayments.length === 0 ? (
                    <div className="flex flex-col items-center py-10 gap-3 text-center">
                      <span className="text-4xl">💳</span>
                      <p className="text-gray-500 text-sm">No payments for this ground yet</p>
                    </div>
                  ) : myPayments.map((payment, i) => {
                    const badge = getStatusBadge(payment.status);
                    return (
                      <div key={payment._id} className="payment-card animate-cardIn" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {payment.booking?.date} · {payment.booking?.startTime} — {payment.booking?.endTime}
                            </p>
                            <p className="text-gray-600 text-xs mt-0.5">Booking #{payment.booking?._id?.slice(-6)}</p>
                          </div>
                          <span className={`status-badge ${badge.color}`}>{badge.label}</span>
                        </div>

                        <div className="price-breakdown mb-3">
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-500">Total Amount</span>
                            <span className="text-white font-semibold">₹{payment.totalAmount}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-500">Advance Paid (30%)</span>
                            <span className="text-green-400 font-semibold">₹{payment.advanceAmount}</span>
                          </div>
                          <div className="w-full h-px bg-white/5 my-2" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Remaining (70%)</span>
                            <span className={`font-semibold ${payment.finalPayment?.status === 'paid' ? 'text-green-400' : 'text-orange-400'}`}>
                              {payment.finalPayment?.status === 'paid' ? '✅ Paid' : `₹${payment.remainingAmount} due`}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {payment.status === 'advance_paid' && (
                            <button onClick={() => handleFinalPayment(payment.booking?._id)} className="final-pay-btn">
                              💳 Pay Remaining ₹{payment.remainingAmount}
                            </button>
                          )}
                          {['advance_paid'].includes(payment.status) && (
                            <button onClick={() => handleCancelRefund(payment.booking?._id)} className="cancel-btn">
                              Cancel & Refund
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right — Booking Panel */}
          <div className="flex flex-col gap-4">
            {user?.role === 'player' && (
              <div className="glass-card sticky top-24">
                <h3 className="font-bebas text-xl tracking-wide text-white mb-4">BOOK THIS GROUND</h3>

                {selectedSlot ? (
                  <div className="flex flex-col gap-4">
                    <div className="bg-white/3 border border-white/8 rounded-16 p-4 rounded-2xl">
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Selected Slot</p>
                      <p className="text-white font-semibold text-sm">📅 {selectedSlot.date}</p>
                      <p className="text-gray-400 text-sm">🕐 {selectedSlot.startTime} — {selectedSlot.endTime}</p>
                    </div>

                    <div className="price-breakdown">
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">Payment Breakdown</p>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Total Price</span>
                        <span className="text-white font-semibold">₹{ground.pricePerHour}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Pay Now (30%)</span>
                        <span className="text-green-400 font-bold">₹{Math.round(ground.pricePerHour * 0.3)}</span>
                      </div>
                      <div className="w-full h-px bg-white/5 my-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">After Playing (70%)</span>
                        <span className="text-orange-400 font-semibold">₹{ground.pricePerHour - Math.round(ground.pricePerHour * 0.3)}</span>
                      </div>
                    </div>

                    <button onClick={handleAdvancePayment} disabled={paymentLoading} className="pay-btn">
                      {paymentLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Processing...
                        </span>
                      ) : `Pay ₹${Math.round(ground.pricePerHour * 0.3)} Now 🚀`}
                    </button>

                    <p className="text-gray-700 text-xs text-center">
                      Secure payment via Razorpay · UPI, Cards, NetBanking
                    </p>

                    <button onClick={() => setSelectedSlot(null)} className="text-gray-600 hover:text-white text-sm transition-colors text-center">
                      ✕ Clear selection
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6 gap-3 text-center">
                    <span className="text-4xl">👆</span>
                    <p className="text-gray-500 text-sm">Select a slot from the list to book</p>
                    <p className="text-gray-700 text-xs">Only 30% advance needed to confirm</p>
                  </div>
                )}
              </div>
            )}

            <div className="glass-card">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Ground Info</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Sport', value: `${getSportEmoji(ground.sport)} ${ground.sport}` },
                  { label: 'Price', value: `₹${ground.pricePerHour}/hr` },
                  { label: 'Total Slots', value: ground.slots?.length || 0 },
                  { label: 'Available', value: availableSlots.length },
                  { label: 'Location', value: ground.address },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-4">
                    <span className="text-gray-600 text-xs uppercase tracking-wider flex-shrink-0">{item.label}</span>
                    <span className="text-gray-300 text-sm text-right capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundDetail;