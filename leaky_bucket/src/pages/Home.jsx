// src/pages/Home.js
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { getSelf } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function Home({ onLogout, token, user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getSelf(token)
      .then((d) => {
        const u = d.data || d;
        setProfileImage(u.profile_image || '');
        setDisplayName(u.farmer?.name || u.name || u.email || '');
      })
      .catch(() => {});
  }, [token]);

  const initials = (displayName || user?.email || 'A')[0].toUpperCase();

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={onLogout} />

      <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
        {/* Top bar */}
        <div className="topbar d-flex align-items-center justify-content-end px-4" style={{ height: 56, background: '#fff', borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 100 }}>
          <button
            className="btn p-0 d-flex align-items-center gap-2"
            style={{ background: 'none', border: 'none' }}
            onClick={() => navigate('/settings')}
            title="Profile & Settings"
          >
            {profileImage ? (
              <img src={profileImage} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e0e0' }} onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2e7d32', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>
                {initials}
              </div>
            )}
            <span style={{ fontSize: 13, color: '#333', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName || user?.email || ''}
            </span>
          </button>
        </div>

        <div className="content-inner p-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;
