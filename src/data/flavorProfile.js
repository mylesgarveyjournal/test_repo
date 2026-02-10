// Base flavor colors (RGB with alpha for mixing)
const baseFlavorColors = {
  'Orange': { r: 255, g: 140, b: 0, hsl: 'hsl(33, 100%, 50%)' },
  'Citrus': { r: 255, g: 200, b: 0, hsl: 'hsl(47, 100%, 50%)' },
  'Tangerine': { r: 255, g: 130, b: 0, hsl: 'hsl(31, 100%, 50%)' },
  'Mango': { r: 255, g: 165, b: 0, hsl: 'hsl(39, 100%, 50%)' },
  'Lemon': { r: 255, g: 240, b: 0, hsl: 'hsl(56, 100%, 50%)' },
  'Sweet': { r: 255, g: 105, b: 180, hsl: 'hsl(330, 100%, 71%)' },
  'Skunk': { r: 101, g: 67, b: 33, hsl: 'hsl(30, 51%, 26%)' },
  'Earthy': { r: 101, g: 67, b: 33, hsl: 'hsl(30, 51%, 26%)' },
  'Pungent': { r: 128, g: 100, b: 0, hsl: 'hsl(47, 100%, 25%)' },
  'Pine': { r: 34, g: 139, b: 34, hsl: 'hsl(120, 61%, 34%)' },
  'Spicy': { r: 220, g: 20, b: 60, hsl: 'hsl(349, 83%, 47%)' },
  'Grape': { r: 128, g: 0, b: 128, hsl: 'hsl(300, 100%, 25%)' },
  'Berry': { r: 199, g: 21, b: 133, hsl: 'hsl(322, 81%, 43%)' },
  'Punch': { r: 178, g: 34, b: 34, hsl: 'hsl(0, 68%, 42%)' },
  'Fresh': { r: 144, g: 238, b: 144, hsl: 'hsl(120, 73%, 75%)' },
  'Diesel': { r: 139, g: 69, b: 19, hsl: 'hsl(25, 76%, 31%)' },
  'Chemical': { r: 150, g: 150, b: 150, hsl: 'hsl(0, 0%, 59%)' },
  'Fruity': { r: 255, g: 105, b: 180, hsl: 'hsl(330, 100%, 71%)' }
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
