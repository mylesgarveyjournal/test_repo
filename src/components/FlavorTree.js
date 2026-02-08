import React, { useState, useRef, useEffect } from 'react';
import { mixFlavorColors, getFlavorIcon, getStrainFlavors } from '../data/flavorProfile';
import '../styles/FlavorTree.css';

const FlavorTree = ({ strainData }) => {
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate tree layout
  const getTreeLayout = (node, level = 0, siblingIndex = 0, siblingCount = 1) => {
    const horizontalSpacing = 250;
    const verticalSpacing = 150;
    
    const parentKeys = Object.keys(node.parents || {});
    const childCount = parentKeys.length;
    
    const layout = {
      id: node.id,
      name: node.name,
      type: node.type,
      flavors: getStrainFlavors(node),
      x: (siblingIndex - siblingCount / 2) * horizontalSpacing,
      y: level * verticalSpacing,
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

  // Flatten tree for rendering
  const flattenTree = (node, parentNode = null, connections = []) => {
    const nodes = [node];
    
    if (parentNode) {
      connections.push({
        x1: parentNode.x,
        y1: parentNode.y,
        x2: node.x,
        y2: node.y
      });
    }

    node.children?.forEach(child => {
      const childFlat = flattenTree(child, node, connections);
      nodes.push(...childFlat);
    });

    return { nodes, connections };
  };

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

  // Mouse wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Mouse drag pan
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch controls
  const [touchStart, setTouchStart] = useState(null);
  const [touchDistance, setTouchDistance] = useState(0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setTouchDistance(Math.sqrt(dx * dx + dy * dy));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && touchStart) {
      setPanX(e.touches[0].clientX - touchStart.x);
      setPanY(e.touches[0].clientY - touchStart.y);
    } else if (e.touches.length === 2 && touchDistance > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);
      const zoomFactor = newDistance / touchDistance;
      setScale(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)));
      setTouchDistance(newDistance);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setTouchDistance(0);
  };

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
    >
      <svg
        ref={svgRef}
        className="flavor-tree-svg"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
          transformOrigin: 'center',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Render connections */}
        {connections.map((conn, idx) => (
          <line
            key={`conn-${idx}`}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            className="tree-connection"
          />
        ))}

        {/* Render nodes */}
        {flatNodes.map(node => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* Colored oval background */}
            <ellipse
              cx="0"
              cy="0"
              rx="50"
              ry="45"
              fill={mixFlavorColors(node.flavors)}
              stroke="#1e5631"
              strokeWidth="2"
              className="strain-node"
            />

            {/* Strain name */}
            <text
              x="0"
              y="-8"
              textAnchor="middle"
              className="strain-name"
            >
              {node.name}
            </text>

            {/* Type indicator */}
            <text
              x="0"
              y="10"
              textAnchor="middle"
              className="strain-type"
            >
              {node.type === 'Landrace' ? '🌿' : '✕'}
            </text>

            {/* Flavor icons */}
            <g className="flavor-icons">
              {node.flavors.slice(0, 3).map((flavor, idx) => (
                <text
                  key={`${node.id}-flavor-${idx}`}
                  x={-30 + idx * 30}
                  y="35"
                  textAnchor="middle"
                  className="flavor-icon"
                  title={flavor}
                >
                  {getFlavorIcon(flavor)}
                </text>
              ))}
            </g>
          </g>
        ))}
      </svg>

      {/* Controls */}
      <div className="tree-controls">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>−</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(3, s + 0.1))}>+</button>
        <button onClick={() => { setScale(1); setPanX(0); setPanY(0); }}>Reset</button>
      </div>

      {/* Instructions */}
      <div className="tree-instructions">
        <p>🖱️ Drag to pan | 🔄 Scroll to zoom | 👆 Touch to pan/pinch to zoom</p>
      </div>
    </div>
  );
};

export default FlavorTree;
