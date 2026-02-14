import React, { useState, useCallback, useMemo } from 'react';
import dagre from 'dagre';
import { mixFlavorColors, getStrainFlavors, getFlavorIcon, baseFlavorColors } from '../data/flavorProfile';
import '../styles/FlavorTree.css';

// Generate psychedelic swirl pattern for a node
// All nodes use THE SAME swirl pattern, only colors differ
const createPsychedelicPattern = (nodeId, flavors) => {
  if (!flavors || flavors.length === 0) return null;
  
  // Get exactly 3 colors for the swirl
  const colors = flavors.slice(0, 3).map(flavor => {
    const colorData = baseFlavorColors[flavor];
    if (!colorData) return 'rgb(200, 200, 200)';
    return `rgb(${colorData.r}, ${colorData.g}, ${colorData.b})`;
  });
  
  // Ensure we have exactly 3 colors
  while (colors.length < 3) {
    colors.push(colors[colors.length - 1]);
  }
  
  return {
    id: `swirl-${nodeId}`,
    colors: colors
  };
};

// Build graph structure: ONE node per unique strain, edges for parent-child relationships
const buildGraphFromTree = (rootNode) => {
  const nodes = new Map(); // Map of id -> node data
  const edges = []; // Array of {source, target}
  const edgeSet = new Set(); // Track unique edges
  
  const traverse = (node, childId = null) => {
    const nodeId = node.id || node.name.toLowerCase().replace(/\s+/g, '_');
    const flavors = getStrainFlavors(node);
    
    // Add node if not already in map (ONLY ONCE)
    if (!nodes.has(nodeId)) {
      nodes.set(nodeId, {
        id: nodeId,
        name: node.name,
        type: node.type,
        flavors: flavors,
        thc: node.thc,
        cbd: node.cbd
      });
    }
    
    // Add edge from this node to child (avoid duplicates)
    if (childId) {
      const edgeKey = `${nodeId}->${childId}`;
      if (!edgeSet.has(edgeKey)) {
        edges.push({ source: nodeId, target: childId });
        edgeSet.add(edgeKey);
      }
    }
    
    // Process parents (only if we haven't processed this node yet to avoid infinite loops)
    if (node.parents) {
      Object.values(node.parents).forEach(parent => {
        traverse(parent, nodeId);
      });
    }
  };
  
  traverse(rootNode);
  
  return {
    nodes: Array.from(nodes.values()),
    edges: edges
  };
};

// Calculate layout using dagre
const calculateLayout = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ 
    rankdir: 'TB', // Top to bottom - landraces at top, Mimosa at bottom
    nodesep: 100,
    ranksep: 180,
    marginx: 60,
    marginy: 60
  });
  g.setDefaultEdgeLabel(() => ({}));
  
  // Add nodes
  nodes.forEach(node => {
    g.setNode(node.id, { width: 180, height: 100 });
  });
  
  // Add edges
  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });
  
  // Calculate layout
  dagre.layout(g);
  
  // Extract positions
  return nodes.map(node => {
    const position = g.node(node.id);
    return {
      ...node,
      x: position.x,
      y: position.y
    };
  });
};

// Draggable Color Legend
const ColorLegend = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [collapsed, setCollapsed] = useState(false);

  const handleMouseDown = (e) => {
    if (e.target.closest('.legend-toggle')) return;
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.legend-toggle')) return;
    setIsDragging(true);
    setDragStart({ 
      x: e.touches[0].clientX - position.x, 
      y: e.touches[0].clientY - position.y 
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div 
      className={`color-legend ${collapsed ? 'collapsed' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="legend-header">
        <h3>Flavor Guide</h3>
        <button 
          className="legend-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          onTouchEnd={(e) => {
            e.stopPropagation();
            setCollapsed(!collapsed);
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '▶' : '▼'}
        </button>
      </div>
      {!collapsed && (
        <div className="legend-items">
          {Object.entries(baseFlavorColors).map(([flavor, colorData]) => (
            <div 
              key={flavor} 
              className="legend-item"
              style={{ backgroundColor: colorData.hsl }}
            >
              <span className="legend-icon">{getFlavorIcon(flavor)}</span>
              <span className="legend-name">{flavor}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FlavorTree = ({ strainData }) => {
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(0.7);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState(0);
  const [pinchCenter, setPinchCenter] = useState({ x: 0, y: 0 });
  const [hiddenNodes, setHiddenNodes] = useState(new Set());
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [touchMoved, setTouchMoved] = useState(false);
  const containerRef = React.useRef(null);
  const svgRef = React.useRef(null);

  // Build graph structure - ONE node per strain
  const graphData = useMemo(() => buildGraphFromTree(strainData), [strainData]);
  const positionedNodes = useMemo(() => calculateLayout(graphData.nodes, graphData.edges), [graphData]);

  // Calculate bounds
  const bounds = useMemo(() => {
    if (positionedNodes.length === 0) return { minX: 0, maxX: 800, minY: 0, maxY: 600 };
    const xs = positionedNodes.map(n => n.x);
    const ys = positionedNodes.map(n => n.y);
    return {
      minX: Math.min(...xs) - 150,
      maxX: Math.max(...xs) + 150,
      minY: Math.min(...ys) - 100,
      maxY: Math.max(...ys) + 100
    };
  }, [positionedNodes]);

 // Center view on mount
  React.useEffect(() => {
    if (containerRef.current) {
      const dimensions = containerRef.current.getBoundingClientRect();
      const graphWidth = bounds.maxX - bounds.minX;
      const graphHeight = bounds.maxY - bounds.minY;
      setPanX((dimensions.width - graphWidth * zoom) / 2 - bounds.minX * zoom);
      setPanY((dimensions.height - graphHeight * zoom) / 2 - bounds.minY * zoom);
    }
  }, [bounds, zoom]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    // Don't start dragging if clicking on a node
    if (e.target.closest('rect')) return;
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

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers
  const handleTouchStart = (e) => {
    // Don't start dragging if touching a node
    if (e.target.closest('rect')) {
      setTouchStartTime(Date.now());
      setTouchMoved(false);
      return;
    }
    if (e.touches.length === 1) {
      setIsDragging(true);
      setTouchMoved(false);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      setIsDragging(false); // Stop dragging when starting pinch
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setTouchDistance(Math.sqrt(dx * dx + dy * dy));
      // Store pinch center point
      setPinchCenter({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      });
    }
  };

  const handleTouchMove = (e) => {
    // Always prevent default to stop page zoom/scroll
    e.preventDefault();
    setTouchMoved(true);
    
    if (e.touches.length === 2 && touchDistance > 0) {
      // Pinch zoom - do this first
      setIsDragging(false); // Make sure we're not dragging
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);
      const zoomFactor = newDistance / touchDistance;
      
      // Calculate new zoom
      const newZoom = Math.max(0.2, Math.min(3, zoom * zoomFactor));
      
      // Adjust pan to zoom at pinch center point
      const zoomRatio = newZoom / zoom;
      setPanX(prev => pinchCenter.x - (pinchCenter.x - prev) * zoomRatio);
      setPanY(prev => pinchCenter.y - (pinchCenter.y - prev) * zoomRatio);
      setZoom(newZoom);
      
      setTouchDistance(newDistance);
    } else if (e.touches.length === 1 && isDragging) {
      // Pan
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;
      setPanX(prev => prev + dx);
      setPanY(prev => prev + dy);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(0);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.2, Math.min(3, prev * delta)));
  };

  React.useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (svg) {
      svg.addEventListener('wheel', handleWheel, { passive: false });
      return () => svg.removeEventListener('wheel', handleWheel);
    }
  }, []);

  // Prevent touch navigation on container only for drags, not taps
  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const preventNav = (e) => {
        // Always prevent to stop page zoom/scroll during graph interaction
        e.preventDefault();
      };
      container.addEventListener('touchstart', preventNav, { passive: false });
      container.addEventListener('touchmove', preventNav, { passive: false });
      return () => {
        container.removeEventListener('touchstart', preventNav);
        container.removeEventListener('touchmove', preventNav);
      };
    }
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.2));
  const handleReset = () => {
    setZoom(0.7);
    if (containerRef.current) {
      const dimensions = containerRef.current.getBoundingClientRect();
      const graphWidth = bounds.maxX - bounds.minX;
      const graphHeight = bounds.maxY - bounds.minY;
      setPanX((dimensions.width - graphWidth * 0.7) / 2 - bounds.minX * 0.7);
      setPanY((dimensions.height - graphHeight * 0.7) / 2 - bounds.minY * 0.7);
    }
  };

  const toggleNodeAndAncestors = (nodeId) => {
    setHiddenNodes(prev => {
      const next = new Set(prev);
      
      // Check if this node is currently hidden
      const isHidden = prev.has(nodeId);
      
      if (isHidden) {
        // Show this node and all its ancestors
        const toShow = new Set([nodeId]);
        
        // Find all ancestors
        const findAncestors = (id) => {
          graphData.edges.forEach(edge => {
            if (edge.target === id) {
              toShow.add(edge.source);
              findAncestors(edge.source);
            }
          });
        };
        findAncestors(nodeId);
        
        // Remove them from hidden set
        toShow.forEach(id => next.delete(id));
      } else {
        // Hide this node and all its ancestors
        const toHide = new Set([nodeId]);
        
        // Find all ancestors (parents, grandparents, etc)
        const findAncestors = (id) => {
          graphData.edges.forEach(edge => {
            if (edge.target === id) {
              toHide.add(edge.source);
              findAncestors(edge.source);
            }
          });
        };
        findAncestors(nodeId);
        
        // Add them to hidden set
        toHide.forEach(id => next.add(id));
      }
      
      return next;
    });
  };

  // Filter nodes and edges based on hidden nodes
  const visibleData = useMemo(() => {
    // Filter out hidden nodes
    const visibleNodes = positionedNodes.map(node => ({
      ...node,
      isHidden: hiddenNodes.has(node.id)
    }));
    
    // Filter edges - only show edges where both nodes are visible
    const visibleEdges = graphData.edges.filter(e => 
      !hiddenNodes.has(e.source) && !hiddenNodes.has(e.target)
    );
    
    return {
      nodes: visibleNodes,
      edges: visibleEdges
    };
  }, [positionedNodes, graphData.edges, hiddenNodes]);

  const width = 180;
  const height = 100;

  return (
    <div 
      className="flavor-tree-container" 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <ColorLegend />
      
      <div className="tree-controls">
        <button onClick={handleZoomOut} title="Zoom Out">−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={handleZoomIn} title="Zoom In">+</button>
        <button onClick={handleReset} title="Reset View">⟲</button>
      </div>

      <div className="tree-instructions">
        <p>🖱️ Drag to pan | 🔄 Scroll to zoom | 👆 Touch: drag to pan, pinch to zoom</p>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        {/* Definitions - must be outside transform */}
        <defs>
          {/* Create smooth swirl pattern using SVG filters - same for all boxes, only colors differ */}
          {visibleData.nodes.map(node => {
            const pattern = createPsychedelicPattern(node.id, node.flavors.slice(0, 3));
            if (!pattern) return null;
            
            // Create SMOOTH swirl using turbulence and displacement filters
            return (
              <React.Fragment key={pattern.id}>
                {/* Base gradient with 3 colors */}
                <radialGradient id={`${pattern.id}-base`} cx="50%" cy="50%">
                  <stop offset="0%" stopColor={pattern.colors[0]} />
                  <stop offset="20%" stopColor={pattern.colors[1]} />
                  <stop offset="40%" stopColor={pattern.colors[2]} />
                  <stop offset="60%" stopColor={pattern.colors[0]} />
                  <stop offset="80%" stopColor={pattern.colors[1]} />
                  <stop offset="100%" stopColor={pattern.colors[2]} />
                </radialGradient>
                
                {/* Swirl distortion filter */}
                <filter id={`${pattern.id}-swirl`} x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence 
                    type="turbulence" 
                    baseFrequency="0.02" 
                    numOctaves="3" 
                    result="turbulence"
                    seed="1"
                  />
                  <feDisplacementMap 
                    in="SourceGraphic" 
                    in2="turbulence" 
                    scale="30" 
                    xChannelSelector="R" 
                    yChannelSelector="G"
                  />
                </filter>
                
                <pattern 
                  id={pattern.id}
                  x="0" y="0" 
                  width="180" height="100"
                  patternUnits="userSpaceOnUse"
                >
                  {/* Apply base gradient with swirl filter */}
                  <rect width="180" height="100" fill={`url(#${pattern.id}-base)`} filter={`url(#${pattern.id}-swirl)`} />
                </pattern>
              </React.Fragment>
            );
          })}
          
          <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L0,12 L12,6 z" fill="#1a5c36" />
          </marker>
        </defs>
        
        <g transform={`translate(${panX}, ${panY}) scale(${zoom})`}>
          {/* Render edges with curved paths */}
          {visibleData.edges.map((edge, idx) => {
            const source = visibleData.nodes.find(n => n.id === edge.source);
            const target = visibleData.nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;
            
            // Calculate edge start and end points
            const x1 = source.x;
            const y1 = source.y + height / 2; // Bottom of source node
            const x2 = target.x;
            const y2 = target.y - height / 2; // Top of target node
            
            // Create smooth curved path
            const midY = (y1 + y2) / 2;
            const curve = Math.abs(x2 - x1) * 0.3;
            
            const path = `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`;
            
            return (
              <path
                key={`edge-${idx}`}
                d={path}
                stroke="#1a5c36"
                strokeWidth="3"
                fill="none"
                opacity="0.7"
                markerEnd="url(#arrowhead)"
                style={{ transition: 'opacity 0.3s ease' }}
              />
            );
          })}
          
          {/* Render nodes */}
          {visibleData.nodes.map(node => {
            const patternId = `url(#swirl-${node.id})`;
            const isHidden = node.isHidden;
            
            const handleNodeInteraction = (e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleNodeAndAncestors(node.id);
            };
            
            return (
              <g 
                key={node.id} 
                transform={`translate(${node.x}, ${node.y})`}
                style={{ transition: 'opacity 0.4s ease' }}
                opacity={isHidden ? 0.15 : 1}
              >
                <rect
                  x={-width / 2}
                  y={-height / 2}
                  width={width}
                  height={height}
                  rx={12}
                  ry={12}
                  fill={patternId}
                  stroke="#1a5c36"
                  strokeWidth={isHidden ? "2" : "3"}
                  opacity="0.95"
                  filter="url(#drop-shadow)"
                  onClick={handleNodeInteraction}
                  onTouchEnd={(e) => {
                    // Only trigger if it was a tap, not a drag
                    const touchDuration = Date.now() - touchStartTime;
                    if (!touchMoved && touchDuration < 300) {
                      handleNodeInteraction(e);
                    }
                  }}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'stroke-width 0.3s ease',
                    pointerEvents: 'all'
                  }}
                />
                
                {/* White fade at bottom 1/5th of box */}
                <defs>
                  <linearGradient id={`fade-${node.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                <rect
                  x={-width / 2}
                  y={height / 2 - 20}
                  width={width}
                  height={20}
                  fill={`url(#fade-${node.id})`}
                  style={{ pointerEvents: 'none' }}
                />
                
                {/* Toggle indicator */}
                <circle
                  cx={width / 2 - 15}
                  cy={-height / 2 + 15}
                  r="10"
                  fill={isHidden ? "#7d5a9a" : "#1a5c36"}
                  stroke="white"
                  strokeWidth="2"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'fill 0.3s ease',
                    pointerEvents: 'all'
                  }}
                />
                <text
                  x={width / 2 - 15}
                  y={-height / 2 + 20}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {isHidden ? '+' : '−'}
                </text>
                
                <text
                  fill="white"
                  strokeWidth="4"
                  stroke="#000"
                  paintOrder="stroke"
                  fontSize="17"
                  fontWeight="900"
                  textAnchor="middle"
                  y="-25"
                  style={{ pointerEvents: 'none', letterSpacing: '0.3px' }}
                >
                  {node.name}
                </text>
                
                <g transform="translate(0, 0)">
                  {node.flavors.slice(0, 3).map((flavor, idx) => (
                    <g key={idx}>
                      {/* Oval background for flavor icon */}
                      <ellipse
                        cx={(idx - 1) * 30}
                        cy={5}
                        rx={16}
                        ry={14}
                        fill="rgba(255, 255, 255, 0.4)"
                        stroke="rgba(255, 255, 255, 0.6)"
                        strokeWidth="1"
                        style={{ pointerEvents: 'none' }}
                      />
                      <text
                        fontSize="22"
                        textAnchor="middle"
                        x={(idx - 1) * 30}
                        y="5"
                        style={{ pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}
                      >
                        {getFlavorIcon(flavor)}
                      </text>
                    </g>
                  ))}
                </g>
                
                <text
                  fill="#1a5c36"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                  y="40"
                  style={{ pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: '0.8px' }}
                >
                  {node.type}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default FlavorTree;
