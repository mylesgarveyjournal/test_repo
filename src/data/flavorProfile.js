// Base flavor colors (RGB with alpha for mixing)
// Colors chosen for MAXIMUM distance - spread evenly across color spectrum
const baseFlavorColors = {
  'Orange': { r: 255, g: 140, b: 0, hsl: 'hsl(33, 100%, 50%)' },        // Orange 33°
  'Citrus': { r: 255, g: 255, b: 0, hsl: 'hsl(60, 100%, 50%)' },        // Yellow 60°
  'Tangerine': { r: 255, g: 85, b: 0, hsl: 'hsl(20, 100%, 50%)' },      // Red-Orange 20°
  'Mango': { r: 255, g: 200, b: 0, hsl: 'hsl(47, 100%, 50%)' },         // Gold 47°
  'Lemon': { r: 200, g: 255, b: 0, hsl: 'hsl(73, 100%, 50%)' },         // Chartreuse 73°
  'Sweet': { r: 255, g: 0, b: 128, hsl: 'hsl(330, 100%, 50%)' },        // Hot Pink 330°
  'Skunk': { r: 128, g: 255, b: 0, hsl: 'hsl(90, 100%, 50%)' },         // Lime 90°
  'Earthy': { r: 128, g: 64, b: 0, hsl: 'hsl(30, 100%, 25%)' },         // Brown 30°
  'Pungent': { r: 255, g: 0, b: 255, hsl: 'hsl(300, 100%, 50%)' },      // Magenta 300°
  'Pine': { r: 0, g: 200, b: 100, hsl: 'hsl(150, 100%, 39%)' },         // Emerald 150°
  'Spicy': { r: 255, g: 0, b: 0, hsl: 'hsl(0, 100%, 50%)' },            // Red 0°
  'Grape': { r: 128, g: 0, b: 255, hsl: 'hsl(270, 100%, 50%)' },        // Purple 270°
  'Berry': { r: 200, g: 0, b: 100, hsl: 'hsl(330, 100%, 39%)' },        // Berry 330°
  'Punch': { r: 255, g: 0, b: 64, hsl: 'hsl(345, 100%, 50%)' },         // Crimson 345°
  'Fresh': { r: 0, g: 255, b: 128, hsl: 'hsl(150, 100%, 50%)' },        // Spring Green 150°
  'Diesel': { r: 0, g: 128, b: 255, hsl: 'hsl(210, 100%, 50%)' },       // Azure 210°
  'Chemical': { r: 0, g: 255, b: 255, hsl: 'hsl(180, 100%, 50%)' },     // Cyan 180°
  'Fruity': { r: 255, g: 64, b: 200, hsl: 'hsl(317, 100%, 63%)' }       // Pink 317°
};

// Flavor to emoji/icon mapping
const flavorIcons = {
  'Orange': '🍊',
  'Citrus': '🍋',
  'Tangerine': '🍊',
  'Mango': '🥭',
  'Lemon': '🍋',
  'Sweet': '🍯',
  'Skunk': '💨',
  'Earthy': '🌍',
  'Pungent': '👃',
  'Pine': '🌲',
  'Spicy': '🌶️',
  'Grape': '🍇',
  'Berry': '🫐',
  'Punch': '👊',
  'Fresh': '💨',
  'Diesel': '⛽',
  'Chemical': '⚗️',
  'Fruity': '🍓'
};

// Mix colors from multiple flavors
export const mixFlavorColors = (flavors) => {
  if (!flavors || flavors.length === 0) return 'rgb(200, 200, 200)';
  
  let r = 0, g = 0, b = 0;
  let count = 0;
  
  flavors.forEach(flavor => {
    if (baseFlavorColors[flavor]) {
      const color = baseFlavorColors[flavor];
      r += color.r;
      g += color.g;
      b += color.b;
      count++;
    }
  });
  
  if (count === 0) return 'rgb(200, 200, 200)';
  
  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);
  
  return `rgb(${r}, ${g}, ${b})`;
};

// Get flavor icons for display
export const getFlavorIcon = (flavor) => {
  return flavorIcons[flavor] || '🌿';
};

// Get all base flavors from entire tree
export const getBaseFlavorSet = (strainTree) => {
  const flavors = new Set();
  
  const traverse = (node) => {
    if (node.publicFlavors) {
      node.publicFlavors.forEach(f => flavors.add(f));
    }
    if (node.parents) {
      Object.values(node.parents).forEach(parent => traverse(parent));
    }
  };
  
  traverse(strainTree);
  return Array.from(flavors);
};

// Get top 3 flavors for a strain (already provided in data)
export const getStrainFlavors = (strain) => {
  return strain.publicFlavors || [];
};

// Get mixed flavor name based on ingredients
export const getMixedFlavorName = (flavors) => {
  if (!flavors || flavors.length === 0) return 'Neutral';
  if (flavors.length === 1) return flavors[0];
  if (flavors.length === 2) return `${flavors[0]}-${flavors[1]}`;
  return flavors.slice(0, 3).join('-');
};

// Export individual items
export { baseFlavorColors, flavorIcons };

export default {
  mixFlavorColors,
  getFlavorIcon,
  getBaseFlavorSet,
  getStrainFlavors,
  getMixedFlavorName,
  baseFlavorColors,
  flavorIcons
};
