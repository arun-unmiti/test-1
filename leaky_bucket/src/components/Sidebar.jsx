// src/components/Sidebar.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PATH_STATE = {
  '/overview':          { active: 'overview',         openDropdown: 'dashboard',      openSubDropdown: null },
  '/farmer':            { active: 'farmer',           openDropdown: 'dashboard',      openSubDropdown: null },
  '/crop-ledger':       { active: 'crop',             openDropdown: 'dashboard',      openSubDropdown: null },
  '/stakeholder':       { active: 'stakeholder',      openDropdown: 'dashboard',      openSubDropdown: null },
  '/reg-farmer':        { active: 'regFarmer',        openDropdown: 'datamanagement', openSubDropdown: 'registration' },
  '/reg-farm':          { active: 'regFarm',          openDropdown: 'datamanagement', openSubDropdown: 'registration' },
  '/reg-crop':          { active: 'regCrop',          openDropdown: 'datamanagement', openSubDropdown: 'registration' },
  '/reg-buyer':         { active: 'regBuyer',         openDropdown: 'datamanagement', openSubDropdown: 'registration' },
  '/reg-supplier':      { active: 'regSupplier',      openDropdown: 'datamanagement', openSubDropdown: 'registration' },
  '/activity-income':   { active: 'activityIncome',   openDropdown: 'datamanagement', openSubDropdown: 'activity' },
  '/activity-expenses': { active: 'activityExpenses', openDropdown: 'datamanagement', openSubDropdown: 'activity' },
  '/user-management':   { active: 'usermanagement',   openDropdown: null,             openSubDropdown: null },
  '/settings':          { active: 'settings',         openDropdown: null,             openSubDropdown: null },
  '/farms':             { active: 'dmFarms',          openDropdown: 'datamanagement', openSubDropdown: null },
  '/dm-stakeholders':   { active: 'dmStakeholder',    openDropdown: 'datamanagement', openSubDropdown: null },
};

const Sidebar = ({ collapsed, setCollapsed, onLogout }) => {
  const location = useLocation();
  const init = PATH_STATE[location.pathname] || { active: 'dashboard', openDropdown: 'dashboard', openSubDropdown: null };

  const [active, setActive] = useState(init.active);
  const [openDropdown, setOpenDropdown] = useState(init.openDropdown);
  const [openSubDropdown, setOpenSubDropdown] = useState(init.openSubDropdown);

  const toggleSubDropdown = (menu) => {
    setOpenSubDropdown(openSubDropdown === menu ? null : menu);
  };

  const navigate = useNavigate();

  const handleMenuClick = (menu, path) => {
    setActive(menu);
    if (path) {
      navigate(path);
    }
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <>
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="d-flex justify-content-between align-items-center sideBarPd">
          <h3 className="mb-0 logo-text">Leaky Bucket</h3>

          <button
            className="toggle-btn bg-transparent border-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            <img src="./assets/images/menu-arrow.png" alt="Arrow" />
          </button>
        </div>

        <ul className="list-unstyled mt-2 px-0">
          {/* Dashboard */}
          <li
            className={`menu-item d-flex justify-content-between align-items-center
          ${openDropdown === "dashboard" ? "active" : ""}`}
            onClick={() => toggleDropdown("dashboard")}
          >
            <div> <img src="./assets/images/dashboard.png" alt="Arrow" /> <span className="ps-2"> Dashboard </span> </div>
            {!collapsed && <span className="arrow">▾</span>}
          </li>

          {openDropdown === "dashboard" && !collapsed && (
            <ul className="submenu list-unstyled">
              <li
                className={`submenu-item ${active === "overview" ? "active" : ""}`}
                onClick={() => handleMenuClick("overview", "/overview")}
              >
                Overview
              </li>

              <li
                className={`submenu-item ${active === "farmer" ? "active" : ""}`}
                onClick={() => handleMenuClick("farmer", "/farmer")}
              >
                Farmer
              </li>
              <li
                className={`submenu-item ${active === "crop" ? "active" : ""}`}
                onClick={() => handleMenuClick("crop", "/crop-ledger")}
              >
                Crop ledger
              </li>
              {/* <li
                className={`submenu-item ${active === "livestock" ? "active" : ""}`}
                onClick={() => handleMenuClick("livestock", "/livestock")}
              >
                Livestock
              </li> */}
              <li
                className={`submenu-item ${active === "stakeholder" ? "active" : ""}`}
                onClick={() => handleMenuClick("stakeholder", "/stakeholder")}
              >
                Stakeholder
              </li>

            </ul>
          )}

          {/* Data Management with Dropdown */}
          <li
            className={`menu-item d-flex justify-content-between align-items-center
          ${openDropdown === "datamanagement" ? "active" : ""}`}
            onClick={() => toggleDropdown("datamanagement")}
          >
            <div> <img src="./assets/images/data-managment.png" alt="Data Management" /> <span className="ps-2"> Data Management </span> </div>
            {!collapsed && <span className="arrow">▾</span>}
          </li>

          {openDropdown === "datamanagement" && !collapsed && (
            <ul className="submenu list-unstyled">
              {/* <li
                className={`submenu-item ${active === "dmFarms" ? "active" : ""}`}
                onClick={() => handleMenuClick("dmFarms", "/farms")}
              >
                Farms
              </li>
              <li
                className={`submenu-item ${active === "dmCrops" ? "active" : ""}`}
                onClick={() => handleMenuClick("dmCrops", "/crops")}
              >
                Crops Page
              </li>
              <li
                className={`submenu-item ${active === "dmLivestock" ? "active" : ""}`}
                onClick={() => handleMenuClick("dmLivestock", "/dm-livestock")}
              >
                Livestock
              </li>
              <li
                className={`submenu-item ${active === "dmStakeholder" ? "active" : ""}`}
                onClick={() => handleMenuClick("dmStakeholder", "/dm-stakeholders")}
              >
                Stakeholder
              </li> */}

              {/* Registration sub-group */}
              <li
                className="submenu-item d-flex justify-content-between align-items-center"
                style={{ fontWeight: 600, cursor: "pointer" }}
                onClick={() => toggleSubDropdown("registration")}
              >
                <span>Registration</span>
                <span className="arrow">▾</span>
              </li>
              {openSubDropdown === "registration" && (
                <ul className="submenu list-unstyled" style={{ paddingLeft: 12 }}>
                  <li
                    className={`submenu-item ${active === "regFarmer" ? "active" : ""}`}
                    onClick={() => handleMenuClick("regFarmer", "/reg-farmer")}
                  >
                    Farmer
                  </li>
                  <li
                    className={`submenu-item ${active === "regFarm" ? "active" : ""}`}
                    onClick={() => handleMenuClick("regFarm", "/reg-farm")}
                  >
                    Farm
                  </li>
                  <li
                    className={`submenu-item ${active === "regCrop" ? "active" : ""}`}
                    onClick={() => handleMenuClick("regCrop", "/reg-crop")}
                  >
                    Crop
                  </li>
                  <li
                    className={`submenu-item ${active === "regBuyer" ? "active" : ""}`}
                    onClick={() => handleMenuClick("regBuyer", "/reg-buyer")}
                  >
                    Buyer
                  </li>
                  <li
                    className={`submenu-item ${active === "regSupplier" ? "active" : ""}`}
                    onClick={() => handleMenuClick("regSupplier", "/reg-supplier")}
                  >
                    Supplier
                  </li>
                </ul>
              )}

              {/* Activity sub-group */}
              <li
                className="submenu-item d-flex justify-content-between align-items-center"
                style={{ fontWeight: 600, cursor: "pointer" }}
                onClick={() => toggleSubDropdown("activity")}
              >
                <span>Activity</span>
                <span className="arrow">▾</span>
              </li>
              {openSubDropdown === "activity" && (
                <ul className="submenu list-unstyled" style={{ paddingLeft: 12 }}>
                  <li
                    className={`submenu-item ${active === "activityIncome" ? "active" : ""}`}
                    onClick={() => handleMenuClick("activityIncome", "/activity-income")}
                  >
                    Income
                  </li>
                  <li
                    className={`submenu-item ${active === "activityExpenses" ? "active" : ""}`}
                    onClick={() => handleMenuClick("activityExpenses", "/activity-expenses")}
                  >
                    Expenses
                  </li>
                </ul>
              )}
            </ul>
          )}

          {/* Settings */}

          <li
            className={`menu-item ${active === "usermanagement" ? "active" : ""}`}
            onClick={() => handleMenuClick("usermanagement", "/user-management")}
          >
            <div> <img src="./assets/images/user-management.png" alt="Data Management" /> <span className="ps-2"> User Management </span> </div>
          </li>

          <li
            className={`menu-item ${active === "settings" ? "active" : ""}`}
            onClick={() => handleMenuClick("settings", "/settings")}
          >
            <div> <img src="./assets/images/settings.png" alt="Settings" /> <span className="ps-2"> Settings </span> </div>
          </li>

        </ul>

        <ul className="list-unstyled posBottom mb-0">
          <li
            className="menu-item"
            onClick={handleLogout}
          >
            <div> <img src="./assets/images/logout.png" alt="Logout" /> <span className="ps-2"> Logout </span> </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;