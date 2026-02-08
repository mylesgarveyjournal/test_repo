import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="app-frame">
      <Header />
      <div className="content-frame">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
