import React from 'react';
import { useParams } from 'react-router-dom';
import FlavorTree from '../components/FlavorTree';
import strainTreeData from '../data/strainTree.json';
import '../styles/FlavorTreeExplorer.css';

const FlavorTreeExplorer = () => {
  const { strainName } = useParams();
  const strain = strainName?.toLowerCase() || 'mimosa';
  const strainData = strainTreeData[strain.charAt(0).toUpperCase() + strain.slice(1)];

  if (!strainData) {
    return (
      <div className="flavor-tree-explorer">
        <div className="error-message">
          <h2>Strain not found</h2>
          <p>The strain "{strainName}" is not available in the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flavor-tree-explorer">
      <FlavorTree strainData={strainData} />
    </div>
  );
};

export default FlavorTreeExplorer;
