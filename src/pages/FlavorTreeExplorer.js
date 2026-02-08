import React from 'react';
import FlavorTree from '../components/FlavorTree';
import strainTreeData from '../data/strainTree.json';
import '../styles/FlavorTreeExplorer.css';

const FlavorTreeExplorer = () => {
  const mimosaData = strainTreeData.Mimosa;

  return (
    <div className="flavor-tree-explorer">
      <div className="explorer-header">
        <h1>🍊 Flavor Tree Explorer</h1>
        <p>Interactive family tree visualization with flavor profiles</p>
      </div>

      <div className="explorer-hero">
        <div className="hero-content">
          <h2>Mimosa Strain Family</h2>
          <p className="hero-description">
            Explore the complete lineage of Mimosa from the current cultivar back to its landrace ancestors. 
            Each node's color represents a mix of its top three flavor profiles.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-label">THC</span>
              <span className="stat-value">{mimosaData.thc}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">CBD</span>
              <span className="stat-value">{mimosaData.cbd}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Type</span>
              <span className="stat-value">{mimosaData.type}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Top Flavors</span>
              <span className="stat-value">{mimosaData.publicFlavors.join(', ')}</span>
            </div>
          </div>
        </div>
        <div className="logo-placeholder">
          📊
        </div>
      </div>

      <div className="tree-viewer">
        <FlavorTree strainData={mimosaData} />
      </div>

      <div className="explorer-info">
        <div className="info-section">
          <h3>📖 How to Read This Tree</h3>
          <ul>
            <li><strong>Colored Ovals:</strong> Each strain is shown as an oval with a mixed color from its top 3 flavors</li>
            <li><strong>🌿 Landrace Marker:</strong> Landrace strains (ancestors) are marked with a plant icon</li>
            <li><strong>✕ Hybrid Marker:</strong> Hybrid strains are marked with a cross icon</li>
            <li><strong>Flavor Icons:</strong> The three emoji icons below each strain represent its top flavors</li>
            <li><strong>Connections:</strong> Lines show parent-child relationships in the strain lineage</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>🎮 Interactive Controls</h3>
          <ul>
            <li><strong>Pan:</strong> Click and drag with mouse or one finger on touch</li>
            <li><strong>Zoom In/Out:</strong> Scroll wheel or use +/- buttons</li>
            <li><strong>Pinch Zoom:</strong> Two-finger pinch on touch devices</li>
            <li><strong>Reset:</strong> Click "Reset" button to return to default view</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>🍃 Flavor Profile Science</h3>
          <p>
            Cannabis flavor profiles are determined by terpenes—aromatic compounds that create distinct tastes and aromas.
            By tracking the lineage of strains, we can see how flavors propagate through generations. A strain's color 
            is calculated by mixing the RGB values of its top three flavors, creating a visual representation of its 
            unique flavor combination.
          </p>
          <p>
            The "base flavors" visible in the tree include: Orange, Citrus, Mango, Lemon, Sweet, Earthy, Pine, Spicy, 
            Grape, Berry, Punch, Diesel, and more. These come from the terpene profiles of landrace strains and have 
            been carefully preserved and mixed through selective breeding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlavorTreeExplorer;
