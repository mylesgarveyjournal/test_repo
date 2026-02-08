import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', key: 'home', icon: 'home' },
  { to: '/strains', label: 'Strains', key: 'strains', icon: 'leaf' },
  { to: '/tree', label: 'Tree', key: 'tree', icon: 'tree' },
  { to: '/growers', label: 'Growers', key: 'growers', icon: 'shop' },
  { to: '/breeders', label: 'Breeders', key: 'breeders', icon: 'dna' },
  { to: '/people', label: 'People', key: 'people', icon: 'users' },
  { to: '/tools', label: 'Cannabis Tools', key: 'tools', icon: 'tools' }
];

function Icon({ name }){
  switch(name){
    case 'home': return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'leaf': return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21s4-7 10-9 8-7 8-7-6 1-10 5S3 21 3 21z" stroke="#bfe39a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'tree': return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2s4 3 4 6-2 4-4 4-4-2-4-4 4-6 4-6z" stroke="#bfe39a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'shop': return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18v13H3zM3 7l2-4h14l2 4" stroke="#bfe39a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'dna': return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5c6 6 12 6 18 0M3 19c6-6 12-6 18 0" stroke="#bfe39a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'users': return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="#bfe39a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#bfe39a" strokeWidth="1.2"/></svg>);
    case 'tools': return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l6-6M21 3l-6 6" stroke="#bfe39a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    default: return null;
  }
}

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside className={"sidebar " + (open ? 'open' : 'collapsed')} aria-expanded={open}>
      <div className="brand">
        <button
          className="toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Collapse navigation' : 'Expand navigation'}
          aria-pressed={!open}
        >
          {open ? '◀' : '▶'}
        </button>
        <div className="logo-wrap" aria-hidden={!open}>
          <div className="logo-large">
            <img src="/logo.png" alt="Cannaverum" className="logo" />
          </div>
        </div>
      </div>

      <nav className="nav" role="navigation">
        {links.map(l => (
          <NavLink
            key={l.key}
            to={l.to}
            className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}
          >
            <Icon name={l.icon} />
            <span className={`nav-label ${open ? 'show' : 'hide'}`}>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <footer className="sidebar-footer">
        <small aria-hidden={!open}>{open ? 'Veritas Cannabis' : 'VC'}</small>
      </footer>
    </aside>
  );
}
