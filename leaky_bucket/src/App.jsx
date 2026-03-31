// src/App.js
import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "leaflet/dist/leaflet.css";
import './App.css';

import Login from './pages/Login';
import Home from './pages/Home';
import Overview from './pages/Overview';
import Filters from './pages/Filters';
import DashboardFarmer from './pages/DashboardFarmer';
import CropLedger from './pages/CropLedger';
import Livestock from './pages/Livestock';
import Stakeholder from './pages/Stakeholder';
import DmFarms from './pages/DmFarms';
import DmCrops from './pages/DmCrops';
import DmLivestock from './pages/DmLivestock';
import DmStakeholders from './pages/DmStakeholders';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import RegFarmer from './pages/RegFarmer';
import RegFarm from './pages/RegFarm';
import RegCrop from './pages/RegCrop';
import RegBuyer from './pages/RegBuyer';
import RegSupplier from './pages/RegSupplier';
import ActivityIncome from './pages/ActivityIncome';
import ActivityExpenses from './pages/ActivityExpenses';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const onSessionExpired = () => handleLogout();
    window.addEventListener('session_expired', onSessionExpired);
    return () => window.removeEventListener('session_expired', onSessionExpired);
  }, []);

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Home onLogout={handleLogout} token={token} user={user} />}>
          <Route index element={<Overview token={token} user={user} />} />
          <Route path="/overview" element={<Overview token={token} user={user} />} />
          <Route path="/filters" element={<Filters token={token} user={user} />} />
          <Route path="/farmer" element={<DashboardFarmer token={token} user={user} />} />
          <Route path="/crop-ledger" element={<CropLedger token={token} user={user} />} />
          <Route path="/livestock" element={<Livestock token={token} user={user} />} />
          <Route path="/stakeholder" element={<Stakeholder token={token} user={user} />} />
          <Route path="/farms" element={<DmFarms token={token} user={user} />} />
          <Route path="/crops" element={<DmCrops token={token} user={user} />} />
          <Route path="/dm-livestock" element={<DmLivestock token={token} user={user} />} />
          <Route path="/dm-stakeholders" element={<DmStakeholders token={token} user={user} />} />
          <Route path="/user-management" element={<UserManagement token={token} user={user} />} />
          <Route path="/settings" element={<Settings token={token} user={user} />} />
          <Route path="/reg-farmer" element={<RegFarmer token={token} user={user} />} />
          <Route path="/reg-farm" element={<RegFarm token={token} user={user} />} />
          <Route path="/reg-crop" element={<RegCrop token={token} user={user} />} />
          <Route path="/reg-buyer" element={<RegBuyer token={token} user={user} />} />
          <Route path="/reg-supplier" element={<RegSupplier token={token} user={user} />} />
          <Route path="/activity-income" element={<ActivityIncome token={token} user={user} />} />
          <Route path="/activity-expenses" element={<ActivityExpenses token={token} user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;