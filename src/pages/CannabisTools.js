import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CannabisTools.css';

const CannabisTools = () => {
  const tools = [
    {
      id: 'flavor-tree',
      name: 'Flavor Tree Explorer',
      description: 'Interactive family tree visualization with complete flavor profile analysis. Track strain ancestry from modern cultivars back to landrace origins.',
      icon: '🍊',
      status: 'Available',
      route: '/tools/flavor-tree',
      color: 'orange'
    },
    {
      id: 'terpene-analyzer',
      name: 'Terpene Analyzer',
      description: 'Deep dive into terpene profiles. Understand which aromatic compounds create specific flavors and effects.',
      icon: '🧪',
      status: 'Coming Soon',
      route: '#',
      color: 'purple'
    },
    {
      id: 'effect-matcher',
      name: 'Effect Matcher',
      description: 'Find strains based on desired effects. Match your needs with the perfect cultivar from our database.',
      icon: '🎯',
      status: 'Coming Soon',
      route: '#',
      color: 'green'
    },
    {
      id: 'breeder-guide',
      name: 'Breeder\'s Guide',
      description: 'Learn about strain breeding techniques, genetics, and how to create unique cultivars through selective crosses.',
      icon: '🧬',
      status: 'Coming Soon',
      route: '#',
      color: 'blue'
    },
    {
      id: 'growth-calc',
      name: 'Growth Calculator',
      description: 'Estimate flowering times, yield expectations, and growing difficulty for different strains.',
      icon: '📈',
      status: 'Coming Soon',
      route: '#',
      color: 'gold'
    },
    {
      id: 'compare-strains',
      name: 'Strain Comparison',
      description: 'Side-by-side comparison of multiple strains. Analyze differences in potency, flavor, and effects.',
      icon: '⚖️',
      status: 'Coming Soon',
      route: '#',
      color: 'red'
    }
  ];

  return (
    <div className="cannabis-tools">
      <div className="tools-header">
        <h1>🛠️ Cannabis Tools</h1>
        <p>A suite of interactive tools for cannabis enthusiasts, breeders, and researchers</p>
      </div>

      <div className="tools-grid">
        {tools.map(tool => (
          <div key={tool.id} className={`tool-card ${tool.status === 'Coming Soon' ? 'disabled' : ''} color-${tool.color}`}>
            <div className="tool-icon">{tool.icon}</div>
            
            <h2 className="tool-name">{tool.name}</h2>
            
            <p className="tool-description">{tool.description}</p>
            
            <div className="tool-footer">
              <span className={`status-badge ${tool.status === 'Available' ? 'available' : 'coming-soon'}`}>
                {tool.status}
              </span>
              
              {tool.status === 'Available' ? (
                <Link to={tool.route} className="tool-launch-btn">
                  Explore →
                </Link>
              ) : (
                <button className="tool-launch-btn" disabled>
                  Soon »
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="tools-footer">
        <div className="footer-content">
          <h3>About These Tools</h3>
          <p>
            These interactive tools are designed to help you understand cannabis genetics, flavor profiles, and cultivar characteristics in unprecedented detail. 
            Whether you're a casual enthusiast exploring strain families or a serious breeder tracking genetic lineage, our tools provide the data and visualization 
            you need to make informed decisions.
          </p>
          <p>
            All tools use publicly available information from reputable cannabis research sources and strain databases. 
            Data is continuously updated as new research and cultivars become available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CannabisTools;
