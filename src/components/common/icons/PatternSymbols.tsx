import React from 'react';

export interface SymbolIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * 8-Petal Sacred Lotus Symbol
 */
export const SymbolLotus: React.FC<SymbolIconProps> = ({ size = 44, color = 'currentColor', className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    {/* Central Petal */}
    <path d="M32 10 C36 22, 38 34, 32 48 C26 34, 28 22, 32 10 Z" fill={color} opacity="0.9" />
    {/* Left Petals */}
    <path d="M32 20 C24 22, 14 28, 16 38 C22 42, 28 36, 32 30" fill={color} opacity="0.75" />
    <path d="M32 28 C20 34, 12 44, 16 52 C26 52, 30 42, 32 36" fill={color} opacity="0.6" />
    {/* Right Petals */}
    <path d="M32 20 C40 22, 50 28, 48 38 C42 42, 36 36, 32 30" fill={color} opacity="0.75" />
    <path d="M32 28 C44 34, 52 44, 48 52 C38 52, 34 42, 32 36" fill={color} opacity="0.6" />
    {/* Base Lotus Pad */}
    <path d="M22 52 C27 55, 37 55, 42 52 C37 54, 27 54, 22 52 Z" fill={color} />
  </svg>
);

/**
 * Geometric Concentric Mandala Symbol
 */
export const SymbolMandala: React.FC<SymbolIconProps> = ({ size = 44, color = 'currentColor', className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="32" cy="32" r="26" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="18" stroke={color} strokeWidth="2" />
    <circle cx="32" cy="32" r="8" fill={color} opacity="0.4" stroke={color} strokeWidth="2" />
    {/* 8 Cardinal rays */}
    <path d="M32 6 L32 58 M6 32 L58 32 M14 14 L50 50 M14 50 L50 14" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

/**
 * Geometric Sri Yantra Interlocking Triangles
 */
export const SymbolYantra: React.FC<SymbolIconProps> = ({ size = 44, color = 'currentColor', className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    {/* Outer square portal */}
    <rect x="8" y="8" width="48" height="48" rx="4" stroke={color} strokeWidth="2" />
    {/* Upward triangle */}
    <polygon points="32,14 50,46 14,46" stroke={color} strokeWidth="2" fill="none" />
    {/* Downward triangle */}
    <polygon points="32,50 14,18 50,18" stroke={color} strokeWidth="2" fill="none" />
    {/* Central Bindu */}
    <circle cx="32" cy="32" r="3.5" fill={color} />
  </svg>
);

/**
 * Radiant Solar Sun Wheel
 */
export const SymbolSun: React.FC<SymbolIconProps> = ({ size = 44, color = 'currentColor', className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="32" cy="32" r="12" fill={color} opacity="0.5" stroke={color} strokeWidth="2" />
    {/* 8 radiating flame rays */}
    <path d="M32 8 L32 14 M32 50 L32 56 M8 32 L14 32 M50 32 L56 32 M15 15 L19 19 M45 45 L49 49 M15 49 L19 45 M45 19 L49 15" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * Mindful Crescent Moon & Star
 */
export const SymbolCrescent: React.FC<SymbolIconProps> = ({ size = 44, color = 'currentColor', className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path
      d="M36 10 C24 10, 14 20, 14 32 C14 44, 24 54, 36 54 C26 48, 24 36, 28 26 C30 20, 33 14, 36 10 Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Companion 4-point star */}
    <polygon points="46,20 48,26 54,28 48,30 46,36 44,30 38,28 44,26" fill={color} />
  </svg>
);

/**
 * Precision Diamond Vajra
 */
export const SymbolDiamond: React.FC<SymbolIconProps> = ({ size = 44, color = 'currentColor', className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <polygon points="32,8 54,32 32,56 10,32" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.25" />
    <polygon points="32,18 44,32 32,46 20,32" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="32" cy="32" r="3" fill={color} />
  </svg>
);

/**
 * Concentric Hexagonal Hive
 */
export const SymbolHexagon: React.FC<SymbolIconProps> = ({ size = 44, color = 'currentColor', className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <polygon points="32,8 52,20 52,44 32,56 12,44 12,20" stroke={color} strokeWidth="2" fill="none" />
    <polygon points="32,16 45,24 45,40 32,48 19,40 19,24" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.3" />
    <circle cx="32" cy="32" r="3" fill={color} />
  </svg>
);

/**
 * Sacred Spiral Kundalini
 */
export const SymbolSpiral: React.FC<SymbolIconProps> = ({ size = 44, color = 'currentColor', className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path
      d="M32 32 A 4 4 0 0 1 36 32 A 8 8 0 0 1 28 32 A 12 12 0 0 1 40 32 A 16 16 0 0 1 24 32 A 20 20 0 0 1 44 32 A 24 24 0 0 1 20 32"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export type PatternSymbolKey = 'lotus' | 'mandala' | 'yantra' | 'sun' | 'crescent' | 'diamond' | 'hexagon' | 'spiral';

export interface PatternSymbolDef {
  id: PatternSymbolKey;
  name: string;
  defaultColor: string;
  component: React.FC<SymbolIconProps>;
}

export const PATTERN_SYMBOLS_CATALOGUE: Record<PatternSymbolKey, PatternSymbolDef> = {
  lotus: { id: 'lotus', name: 'Padma Lotus', defaultColor: '#E11D48', component: SymbolLotus },
  mandala: { id: 'mandala', name: 'Chakra Mandala', defaultColor: '#285443', component: SymbolMandala },
  yantra: { id: 'yantra', name: 'Sri Yantra', defaultColor: '#C68019', component: SymbolYantra },
  sun: { id: 'sun', name: 'Surya Sun', defaultColor: '#EA580C', component: SymbolSun },
  crescent: { id: 'crescent', name: 'Chandra Moon', defaultColor: '#1E3A8A', component: SymbolCrescent },
  diamond: { id: 'diamond', name: 'Vajra Diamond', defaultColor: '#7C3AED', component: SymbolDiamond },
  hexagon: { id: 'hexagon', name: 'Shatkona Hexagon', defaultColor: '#059669', component: SymbolHexagon },
  spiral: { id: 'spiral', name: 'Kundalini Spiral', defaultColor: '#0891B2', component: SymbolSpiral },
};

export const ALL_PATTERN_SYMBOLS: PatternSymbolKey[] = [
  'lotus',
  'mandala',
  'yantra',
  'sun',
  'crescent',
  'diamond',
  'hexagon',
  'spiral',
];

export const PatternSymbolSVG: React.FC<{
  symbolKey: PatternSymbolKey;
  size?: number | string;
  color?: string;
  className?: string;
}> = ({ symbolKey, size = 44, color, className }) => {
  const def = PATTERN_SYMBOLS_CATALOGUE[symbolKey];
  if (!def) return null;
  const Component = def.component;
  return <Component size={size} color={color || def.defaultColor} className={className} />;
};

