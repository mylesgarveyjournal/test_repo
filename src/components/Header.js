import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  // Extract strain name from URL if on flavor tree page
  const pathParts = location.pathname.split('/');
  const isFlavorTree = pathParts[2] === 'flavor-tree';
  const strainName = isFlavorTree && pathParts[3] 
    ? pathParts[3].charAt(0).toUpperCase() + pathParts[3].slice(1)
    : null;

  return (
    <header className="top-header">
      <div className="header-inner">
        <div className="header-logo">
          <img src="/logo.png" alt="Cannaverum" className="logo-img" />
          {strainName && (
            <div className="strain-title">
              {strainName}
            </div>
          )}
        </div>

        <div className="header-search-wrapper">
          <input 
            type="text"
            className="header-search" 
            placeholder="Search strains, people, tools..." 
          />
        </div>
      </div>
    </header>
  );
}
