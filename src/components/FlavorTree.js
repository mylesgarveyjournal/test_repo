import React, { useState, useRef, useEffect } from 'react';
import { mixFlavorColors, getFlavorIcon, getStrainFlavors } from '../data/flavorProfile';
import '../styles/FlavorTree.css';

// Cannabis Bud Node Component
const BudNode = ({ node, x, y, size = 60 }) => {
  const color = mixFlavorColors(node.flavors);
  const radius = size / 2;
  
  return (
    <g transform={`translate(${x}, ${y})`} key={node.id} className="bud-node">
      <defs>
        <filter id="budGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Bud shape - organic cannabis flower look */}
      <ellipse cx="0" cy="5" rx={radius * 0.9} ry={radius * 1.1} fill={color} opacity="0.95" filter="url(#budGlow)" stroke="#1e5631" strokeWidth="2"/>
      
      {/* Top bud pistil detail */}
      <ellipse cx="-8" cy="-15" rx={radius * 0.4} ry={radius * 0.5} fill={color} opacity="0.8" stroke="#1e5631" strokeWidth="1.5"/>
      <ellipse cx="8" cy="-12" rx={radius * 0.35} ry={radius * 0.45} fill={color} opacity="0.85" stroke="#1e5631" strokeWidth="1.5"/>
      
      {/* Sugar leaf highlights */}
      <ellipse cx="-12" cy="5" rx={radius * 0.3} ry={radius * 0.6} fill={color} opacity="0.7" stroke="#1e5631" strokeWidth="1" transform="rotate(-25 -12 5)"/>
      <ellipse cx="12" cy="8" rx={radius * 0.28} ry={radius * 0.55} fill={color} opacity="0.75" stroke="#1e5631" strokeWidth="1" transform="rotate(30 12 8)"/>
      
      {/* Center highlight for dimension */}
      <ellipse cx="0" cy="0" rx={radius * 0.5} ry={radius * 0.7} fill="white" opacity="0.15"/>

      {/* Strain name */}
      <text x="0" y="28" textAnchor="middle" className="strain-name" fontSize="11">
        {node.name}
      </text>

      {/* Type indicator */}
      <text x="0" y="-22" textAnchor="middle" className="strain-type" fontSize="14">
        {node.type === 'Landrace' ? '🌿' : '✕'}
      </text>

      {/* Flavor icons */}
      <g className="flavor-icons">
        {node.flavors.slice(0, 3).map((flavor, idx) => (
          <text
            key={`${node.id}-flavor-${idx}`}
            x={-24 + idx * 24}
            y="44"
            textAnchor="middle"
            className="flavor-icon"
            fontSize="13"
            title={flavor}
          >
            {getFlavorIcon(flavor)}
          </text>
        ))}
      </g>
    </g>
  );
};

// Curved arrow path with marker
const CurvedPath = ({ x1, y1, x2, y2 }) => {
  // Calculate control points for smooth curve
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const offsetX = (y2 - y1) * 0.15;
  const offsetY = (x1 - x2) * 0.15;
  
  const pathData = `M ${x1} ${y1} Q ${midX + offsetX} ${midY + offsetY} ${x2} ${y2}`;
  
  return (
    <g key={`path-${x1}-${y1}-${x2}-${y2}`}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#1e5631" />
        </marker>
      </defs>
      <path d={pathData} className="tree-connection" markerEnd="url(#arrowhead)" />
    </g>
  );
};

const FlavorTree = ({ strainData }) => {
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Calculate tree layout - strain at bottom, parents above
  const getTreeLayout = (node, level = 0, siblingIndex = 0, siblingCount = 1) => {
    const horizontalSpacing = 300;
    const verticalSpacing = 200;
    
    const parentKeys = Object.keys(node.parents || {});
    const childCount = Math.max(parentKeys.length, 1);
    
    const layout = {
      id: node.id,
      name: node.name,
      type: node.type,
      flavors: getStrainFlavors(node),
      x: (siblingIndex - (childCount - 1) / 2) * horizontalSpacing,
      y: -level * verticalSpacing, // Negative to go UP
      children: []
    };

    parentKeys.forEach((parentKey, idx) => {
      const parent = node.parents[parentKey];
      layout.children.push(
        getTreeLayout(parent, level + 1, idx, childCount)
      );
    });

    return layout;
  };

  const treeLayout = getTreeLayout(strainData, 0, 0, 1);

  // Calculate tree bounds
  const calculateBounds = (node) => {
    let minX = node.x, maxX = node.x, minY = node.y, maxY = node.y;
    
    const traverse = (n) => {
      minX = Math.min(minX, n.x - 100);
      maxX = Math.max(maxX, n.x + 100);
      minY = Math.min(minY, n.y - 100);
      maxY = Math.max(maxY, n.y + 100);
      n.children?.forEach(child => traverse(child));
    };
    
    traverse(node);
    return { minX, maxX, minY, maxY };
  };

  const bounds = calculateBounds(treeLayout);
  const treeWidth = bounds.maxX - bounds.minX;
  const treeHeight = bounds.maxY - bounds.minY;
  const padding = 150;

  // Flatten tree for rendering
  const { nodes: flatNodes, connections } = (() => {
    const n = [];
    const c = [];
    
    const traverse = (node, parentNode = null) => {
      n.push(node);
      if (parentNode) {
        c.push({
          x1: parentNode.x,
          y1: parentNode.y,
          x2: node.x,
          y2: node.y
        });
      }
      node.children?.forEach(child => traverse(child, node));
    };
    
    traverse(treeLayout);
    return { nodes: n, connections: c };
  })();

  // Mouse/touch event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPanX(prev => prev + dx);
    setPanY(prev => prev + dy);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.85 : 1.15;
    setScale(prev => Math.max(0.3, Math.min(4, prev * zoomFactor)));
  };

  // Touch handlers
  const [touchStart, setTouchStart] = useState(null);
  const [touchDistance, setTouchDistance] = useState(0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setTouchDistance(Math.sqrt(dx * dx + dy * dy));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && touchStart) {
      const dx = e.touches[0].clientX - touchStart.x;
      const dy = e.touches[0].clientY - touchStart.y;
      setPanX(prev => prev + dx);
      setPanY(prev => prev + dy);
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2 && touchDistance > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);
      const zoomFactor = newDistance / touchDistance;
      setScale(prev => Math.max(0.3, Math.min(4, prev * zoomFactor)));
      setTouchDistance(newDistance);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setTouchDistance(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flavor-tree-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <svg
        ref={svgRef}
        className="flavor-tree-svg"
        viewBox={`${bounds.minX - padding} ${bounds.minY - padding} ${treeWidth + padding * 2} ${treeHeight + padding * 2}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
          transformOrigin: 'center',
          willChange: 'transform'
        }}
      >
        {/* Render curved connections with arrows */}
        {connections.map((conn, idx) => (
          <CurvedPath key={idx} x1={conn.x1} y1={conn.y1} x2={conn.x2} y2={conn.y2} />
        ))}

        {/* Render bud nodes */}
        {flatNodes.map(node => (
          <BudNode key={node.id} node={node} x={node.x} y={node.y} size={70} />
        ))}
      </svg>

      {/* Controls */}
      <div className="tree-controls">
        <button onClick={() => setScale(s => Math.max(0.3, s - 0.15))}>−</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(4, s + 0.15))}>+</button>
        <button onClick={() => { setScale(1); setPanX(0); setPanY(0); }}>Reset</button>
      </div>

      {/* Instructions */}
      <div className="tree-instructions">
        <p>🖱️ Drag to pan | 🔄 Scroll to zoom | 👆 Touch: drag to pan, pinch to zoom</p>
      </div>
    </div>
  );
};

export default FlavorTree;
