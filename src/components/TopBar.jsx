import "../styles/nav.css";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";

function TopBar({ collapsed, setCollapsed }) {
  const { imageSrc, fullName } = useContext(UserContext);
//  const currentPath = window.location.pathname;

//  const isActive = (path) => (currentPath === path ? "active-link" : "");

  const handleExpand = () => {
    if (collapsed) { // Only expand if it's currently collapsed
    setCollapsed(false);
    }
  };

  return (
    <div className={`nav-top ${collapsed ? "expanded-top" : "shifted-top"}`}>
      <div className={`top-content ${collapsed ? "expanded-top" : "shifted-top"}`}>
        {collapsed && (
          <div
            className="logo-part-small-toggle" 
            alt="MK Inventory Logo"
            onClick={handleExpand}
            style={{ cursor: 'pointer' }}
            title="Click to expand sidebar"
          >
          </div>
        )}
        <div className={`inventory-name ${collapsed ? "pushed-right" : ""}`}> 
           MK Inventory Ledger
        </div>
        <div className="user_top-bar">
          <div className="user-dropdown">
            <button className="user-settings">
              <img src={imageSrc} className="user-logo" alt="User Avatar" />
            </button>
            <div className="dropdown-content">
              <Link to="/account">Edit Profile</Link>
              <Link to="/"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm("Logging out of MK Inventory Ledger...")) {
                  window.location.href = "/";
                }
              }}>Log Out</Link>
              <Link to="/change-credentials">Change Username/Password</Link>
            </div>
          </div>
          <b>{fullName}</b>
        </div>
      </div>
    </div>
  );
}

export default TopBar;