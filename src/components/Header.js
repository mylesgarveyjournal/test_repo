import React from 'react';

export default function Header(){
  return (
    <header className="top-header">
      <div className="container header-inner">
        <div className="header-left">
          <div className="brand-small">
            <img src="/logo.png" alt="logo" className="logo small" />
            <div className="brand-title">Cannaverum</div>
          </div>
        </div>

        <div className="header-right">
          <div className="header-search">
            <input placeholder="Search strains, people, tools..." />
          </div>
          <div className="header-actions">
            <button className="icon-btn">⚙️</button>
            <div className="avatar">CG</div>
          </div>
        </div>
      </div>
    </header>
  );
}
