import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-w-0">
        <Header />
        <main id="main" className="flex-1 p-8 max-w-6xl w-full mx-auto space-y-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
