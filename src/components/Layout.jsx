import { useState, useEffect } from "react";
import "../styles/nav.css";
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import OwnerSideBar from "../components/Owner_SideBar";
import StaffSideBar from "../components/Staff_SideBar";

function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth <= 992);

  return (
    <>
      <TopBar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />

      <OwnerSideBar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
      <div
        className="content-section fade-in"
        style={{
          // Adjust margin and width based on collapsed state
          marginLeft: isSidebarCollapsed ? 0 : "240px", 
          width: isSidebarCollapsed ? "100%" : "calc(100% - 240px)", 
          transition: 'margin-left 0.3s ease, width 0.3s ease'
        }}
      >
        {children}
      </div>
    </>
  );
}

export default Layout;