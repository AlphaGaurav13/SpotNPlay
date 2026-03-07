import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PlayerDashboard from './pages/PlayerDashboard';
import GroundOwnerDashboard from './pages/GroundOwnerDashboard';
import MapSearch from './pages/MapSearch';
import GroundDetail from './pages/GroundDetail';
import ProfilePage from './pages/ProfilePage';
import GroupPage from './pages/GroupPage';
import OTPLogin from './pages/OTPLogin';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/map" element={<ProtectedRoute><MapSearch /></ProtectedRoute>} />
      <Route path="/grounds/:id" element={<ProtectedRoute><GroundDetail /></ProtectedRoute>} />
      <Route path="/player/dashboard" element={<ProtectedRoute role="player"><PlayerDashboard /></ProtectedRoute>} />
      <Route path="/owner/dashboard" element={<ProtectedRoute role="ground_owner"><GroundOwnerDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/groups" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
      <Route path="/otp-login" element={<OTPLogin />} />
    </Routes>
  );
};

export default App;