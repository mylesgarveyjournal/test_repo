import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dataProvider from '../api/dataProvider';

export default function Home() {
  const [strains, setStrains] = useState([]);

  useEffect(() => {
    let mounted = true;
    dataProvider.getStrains().then(list => {
      if (mounted) setStrains(list);
    });
    return () => { mounted = false };
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-logo-container">
            <img src="/logo.png" alt="Cannaverum Logo" className="hero-logo" />
          </div>
          <h1 className="hero-title">Welcome to Cannaverum</h1>
          <p className="hero-subtitle">Your comprehensive cannabis genetics database — explore strain lineage, flavor profiles, and breeding history.</p>
          <div className="hero-actions">
            <Link to="/tools/flavor-tree/mimosa" className="btn-primary">🌳 Explore Flavor Tree</Link>
            <Link to="/strains" className="btn-secondary">🔍 Browse Strains</Link>
          </div>
        </div>
      </div>

      <section className="features-section">
        <h2 className="section-title">What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧬</div>
            <h3>Strain Genetics</h3>
            <p>Trace the complete lineage of modern cultivars back to landrace origins</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍊</div>
            <h3>Flavor Profiles</h3>
            <p>Detailed terpene and flavor analysis for each strain</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛠️</div>
            <h3>Interactive Tools</h3>
            <p>Visual family trees, comparisons, and breeding guides</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Research Database</h3>
            <p>Comprehensive information on breeders, growers, and cultivars</p>
          </div>
        </div>
      </section>

      <section className="strains-section">
        <h2 className="section-title">Featured Strains</h2>
        <div className="strains-grid">
          {strains.slice(0, 6).map(s => (
            <div key={s.id} className="strain-card">
              <div className="strain-card-icon">🌿</div>
              <h3 className="strain-name">{s.name}</h3>
              <span className={`strain-type-badge ${s.type.toLowerCase()}`}>{s.type}</span>
              <p className="strain-thc">THC: {s.thc}%</p>
            </div>
          ))}
        </div>
        <div className="view-all">
          <Link to="/strains" className="btn-link">View All Strains →</Link>
        </div>
      </section>
    </div>
  );
}
