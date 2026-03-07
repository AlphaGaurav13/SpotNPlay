import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const FloatingCard = ({ style, children }) => (
  <div className="absolute bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-sm hidden lg:flex items-center gap-2 shadow-2xl" style={style}>
    {children}
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [featuresRef, featuresInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      * { font-family: 'DM Sans', sans-serif; }
      .font-bebas { font-family: 'Bebas Neue', cursive !important; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes float1 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-15px) rotate(2deg); }
        66% { transform: translateY(-8px) rotate(-1deg); }
      }
      @keyframes float2 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(-3deg); }
      }
      @keyframes float3 {
        0%, 100% { transform: translateY(0px); }
        40% { transform: translateY(-12px); }
      }
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes glitch {
        0%, 100% { clip-path: inset(0 0 100% 0); }
        10% { clip-path: inset(10% 0 60% 0); transform: translate(-3px); }
        20% { clip-path: inset(50% 0 30% 0); transform: translate(3px); }
        30% { clip-path: inset(80% 0 5% 0); transform: translate(-2px); }
        40% { clip-path: inset(0 0 100% 0); }
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }
      @keyframes slide-right {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes orbit {
        from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
        to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes ping-slow {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes card-in {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .animate-fadeUp { animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-fadeUp-1 { animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
      .animate-fadeUp-2 { animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards; opacity: 0; }
      .animate-fadeUp-3 { animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
      .animate-fadeUp-4 { animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards; opacity: 0; }
      .animate-fadeIn { animation: fadeIn 1.2s ease forwards; }
      .animate-float1 { animation: float1 6s ease-in-out infinite; }
      .animate-float2 { animation: float2 8s ease-in-out infinite; }
      .animate-float3 { animation: float3 5s ease-in-out infinite; }
      .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      .animate-ping-slow { animation: ping-slow 2s ease-out infinite; }
      .animate-marquee { animation: marquee 20s linear infinite; }

      .card-visible { animation: card-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .card-hidden { opacity: 0; transform: translateY(30px) scale(0.95); }

      .scanline {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(74,222,128,0.1), transparent);
        animation: scanline 8s linear infinite;
        pointer-events: none;
        z-index: 1;
      }

      .glitch-text::before {
        content: attr(data-text);
        position: absolute;
        left: 3px;
        top: 0;
        color: #4ade80;
        animation: glitch 4s infinite;
        clip-path: inset(0 0 100% 0);
      }

      .noise {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
      }

      .grid-dots {
        background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
        background-size: 32px 32px;
      }

      .text-gradient {
        background: linear-gradient(135deg, #fff 0%, #4ade80 50%, #fff 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradientShift 4s linear infinite;
      }

      @keyframes gradientShift {
        from { background-position: 0% center; }
        to { background-position: 200% center; }
      }

      .glow-green { box-shadow: 0 0 40px rgba(74, 222, 128, 0.3); }
      .glow-green-sm { box-shadow: 0 0 20px rgba(74, 222, 128, 0.2); }

      .btn-primary {
        position: relative;
        overflow: hidden;
        background: #4ade80;
        color: black;
        font-weight: 700;
        border-radius: 14px;
        padding: 14px 32px;
        font-size: 16px;
        transition: all 0.3s ease;
      }
      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s ease;
      }
      .btn-primary:hover::before { left: 100%; }
      .btn-primary:hover { background: #86efac; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(74,222,128,0.4); }

      .btn-secondary {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: white;
        font-weight: 600;
        border-radius: 14px;
        padding: 14px 32px;
        font-size: 16px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }
      .btn-secondary:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(74,222,128,0.4);
        transform: translateY(-2px);
      }

      .feature-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 24px;
        padding: 28px;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      }
      .feature-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(74,222,128,0.08), transparent 60%);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .feature-card:hover::before { opacity: 1; }
      .feature-card:hover {
        border-color: rgba(74,222,128,0.25);
        transform: translateY(-6px);
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--x', `${x}%`);
    card.style.setProperty('--y', `${y}%`);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white overflow-x-hidden">
        <Navbar />   
      <div className="scanline" />

      <div className="fixed inset-0 grid-dots pointer-events-none opacity-40" />
      <div className="fixed inset-0 noise pointer-events-none" />

      <div
        className="fixed inset-0 pointer-events-none transition-transform duration-75"
        style={{
          background: `radial-gradient(ellipse 600px 600px at ${50 + mousePos.x}% ${30 + mousePos.y}%, rgba(74,222,128,0.06), transparent)`,
        }}
      />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent pointer-events-none" />

      <div className="relative pt-8">
        <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none">
            <div className="absolute inset-0 rounded-full border border-green-400/5 animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-green-400/5" style={{ animation: 'spin-slow 15s linear infinite reverse' }} />
            <div className="absolute inset-16 rounded-full border border-green-400/8" style={{ animation: 'spin-slow 10s linear infinite' }} />
          </div>

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)',
            }}
          />

          <FloatingCard style={{ top: '20%', left: '8%', animation: 'float1 7s ease-in-out infinite' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-gray-300">Rahul is available nearby</span>
          </FloatingCard>

          <FloatingCard style={{ top: '30%', right: '6%', animation: 'float2 9s ease-in-out infinite' }}>
            <span>🏏</span>
            <span className="text-gray-300">Cricket · 2.3km away</span>
          </FloatingCard>

          <FloatingCard style={{ bottom: '28%', left: '5%', animation: 'float3 6s ease-in-out infinite' }}>
            <span>🏟️</span>
            <div>
              <div className="text-white text-xs font-semibold">Punjab Cricket Ground</div>
              <div className="text-green-400 text-xs">Slot available — ₹500/hr</div>
            </div>
          </FloatingCard>

          <FloatingCard style={{ bottom: '25%', right: '7%', animation: 'float1 8s ease-in-out 1s infinite' }}>
            <span>👥</span>
            <span className="text-gray-300">Sunday Gang · 4/11 joined</span>
          </FloatingCard>

          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <div className="animate-fadeUp inline-flex items-center gap-2 bg-green-400/8 border border-green-400/15 rounded-full px-5 py-2 text-green-400 text-sm mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Live players active near you right now
            </div>

            <div className="overflow-hidden mb-2">
              <h1
                className="font-bebas animate-fadeUp-1 relative"
                style={{ fontSize: 'clamp(5rem, 18vw, 13rem)', lineHeight: 0.9, letterSpacing: '0.05em' }}
                data-text="PLAYNSPORTS"
              >
                <span className="text-gradient">PLAYNSPORTS</span>
              </h1>
            </div>

            <div className="animate-fadeUp-2 mt-6 mb-10">
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Find players near you, book premium grounds, and never miss a game again.
                <br />
                <span className="text-white font-medium">Your sports community — live on the map.</span>
              </p>
            </div>

            <div className="animate-fadeUp-3 flex flex-wrap gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/map" className="btn-primary">
                    Open Live Map 🗺️
                  </Link>
                  <Link to={user.role === 'player' ? '/player/dashboard' : '/owner/dashboard'} className="btn-secondary">
                    My Dashboard →
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary">
                    Get Started — Free 🚀
                  </Link>
                  <Link to="/otp-login" className="btn-secondary">
                    Login with OTP 📧
                  </Link>
                </>
              )}
            </div>

            <div ref={statsRef} className="animate-fadeUp-4 flex justify-center gap-12 mt-16">
              <div className="text-center">
                <div className="font-bebas text-4xl text-green-400">
                  <AnimatedCounter target={500} suffix="+" />
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-widest mt-1">Players</div>
              </div>
              <div className="w-px bg-white/8" />
              <div className="text-center">
                <div className="font-bebas text-4xl text-green-400">
                  <AnimatedCounter target={50} suffix="+" />
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-widest mt-1">Grounds</div>
              </div>
              <div className="w-px bg-white/8" />
              <div className="text-center">
                <div className="font-bebas text-4xl text-green-400">
                  <AnimatedCounter target={6} />
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-widest mt-1">Sports</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fadeUp-4 flex flex-col items-center gap-2">
            <span className="text-gray-600 text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent" style={{ animation: 'float2 2s ease-in-out infinite' }} />
          </div>
        </section>

        <div className="relative py-6 overflow-hidden border-y border-white/5">
          <div className="flex animate-marquee whitespace-nowrap">
            {['FOOTBALL', 'CRICKET', 'BASKETBALL', 'TENNIS', 'BADMINTON', 'VOLLEYBALL',
              'FOOTBALL', 'CRICKET', 'BASKETBALL', 'TENNIS', 'BADMINTON', 'VOLLEYBALL'].map((sport, i) => (
              <span key={i} className="mx-8 font-bebas text-2xl tracking-widest text-white/10">
                {sport} <span className="text-green-400/30">✦</span>
              </span>
            ))}
          </div>
        </div>

        <section className="py-28 px-4" ref={featuresRef}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-green-400 text-xs uppercase tracking-[0.3em] mb-4">How It Works</p>
              <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-wide">
                THREE SIMPLE STEPS
              </h2>
              <div className="w-16 h-px bg-green-400/40 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '📍', title: 'Mark Yourself Available', desc: 'Drop your pin, pick your sport and skill level. Go live and appear on the map for nearby players to find you instantly.', num: '01' },
                { icon: '🗺️', title: 'Discover & Connect', desc: 'Browse the live map for available players and bookable grounds. Filter by sport, radius and skill level.', num: '02' },
                { icon: '🏆', title: 'Play & Win', desc: 'Create groups, send invitations, book premium grounds and play your favourite sport — anytime, anywhere.', num: '03' },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`feature-card ${featuresInView ? 'card-visible' : 'card-hidden'}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                  onMouseMove={handleCardMouseMove}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-green-400/10 border border-green-400/20 rounded-2xl flex items-center justify-center text-2xl">
                      {f.icon}
                    </div>
                    <span className="font-bebas text-5xl text-white/5">{f.num}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-gray-700 text-xs uppercase tracking-[0.3em] text-center mb-10">Supported Sports</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { emoji: '⚽', name: 'Football' },
                { emoji: '🏏', name: 'Cricket' },
                { emoji: '🏀', name: 'Basketball' },
                { emoji: '🎾', name: 'Tennis' },
                { emoji: '🏸', name: 'Badminton' },
                { emoji: '🏐', name: 'Volleyball' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center gap-3 bg-white/2 border border-white/5 rounded-2xl p-5 hover:border-green-400/30 hover:bg-green-400/5 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{s.emoji}</span>
                  <span className="text-xs text-gray-600 group-hover:text-green-400 transition-colors uppercase tracking-wider">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {!user && (
          <section className="py-28 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 rounded-full bg-green-400/10 animate-ping-slow" />
                <div className="relative w-16 h-16 bg-green-400/15 border border-green-400/30 rounded-full flex items-center justify-center text-2xl">
                  🏆
                </div>
              </div>
              <h2 className="font-bebas text-5xl md:text-8xl text-white tracking-wide mb-6">
                READY TO <span className="text-green-400">PLAY?</span>
              </h2>
              <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of players already on the map. Find your next game today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register" className="btn-primary">Join as Player 🚀</Link>
                <Link to="/register" className="btn-secondary">List Your Ground 🏟️</Link>
              </div>
            </div>
          </section>
        )}

        <footer className="border-t border-white/5 py-10 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                <span className="text-black text-sm font-black">P</span>
              </div>
              <span className="font-bebas text-xl tracking-widest text-white">PLAYNSPORTS</span>
            </div>
            <p className="text-gray-700 text-sm">© 2026 PLAYNSPORTS — Built for players, by players.</p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
              <Link to="/map" className="hover:text-white transition-colors">Map</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;