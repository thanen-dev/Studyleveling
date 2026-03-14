// Simple pixel-art style character placeholder as a data URL
// Used in place of the Figma asset that isn't available in local dev
const characterPlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20" width="64" height="80">
  <!-- Head -->
  <rect x="5" y="1" width="6" height="6" fill="#FFDBAC"/>
  <!-- Hair -->
  <rect x="5" y="1" width="6" height="2" fill="#4A3728"/>
  <!-- Eyes -->
  <rect x="6" y="4" width="1" height="1" fill="#222"/>
  <rect x="9" y="4" width="1" height="1" fill="#222"/>
  <!-- Shirt -->
  <rect x="4" y="7" width="8" height="5" fill="#FFFFFF"/>
  <!-- Pants -->
  <rect x="4" y="12" width="8" height="4" fill="#3B82F6"/>
  <!-- Legs -->
  <rect x="4" y="16" width="3" height="3" fill="#3B82F6"/>
  <rect x="9" y="16" width="3" height="3" fill="#3B82F6"/>
  <!-- Shoes -->
  <rect x="4" y="18" width="3" height="1" fill="#1F2937"/>
  <rect x="9" y="18" width="3" height="1" fill="#1F2937"/>
</svg>`)}`;

export default characterPlaceholder;