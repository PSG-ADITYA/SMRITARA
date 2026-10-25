import React from 'react';

export interface BadgeProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

export const BadgeFruitPath: React.FC<BadgeProps> = ({ size = 32, className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="24" cy="24" r="22" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
    {/* Stepping Path nodes */}
    <circle cx="16" cy="30" r="5" fill="#F59E0B" />
    <circle cx="24" cy="18" r="5" fill="#EF4444" />
    <circle cx="33" cy="28" r="5" fill="#10B981" />
    {/* Path connectors */}
    <path d="M16 30 L24 18 L33 28" stroke="#D97706" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
  </svg>
);

export const BadgeMelody: React.FC<BadgeProps> = ({ size = 32, className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="24" cy="24" r="22" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" />
    {/* Musical Clef / Double Note */}
    <path
      d="M18 31 C18 33.2 16.2 35 14 35 C11.8 35 10 33.2 10 31 C10 28.8 11.8 27 14 27 C15 27 16 27.4 16.7 28 L17 15 L32 12 L32 27 C32 29.2 30.2 31 28 31 C25.8 31 24 29.2 24 27 C24 24.8 25.8 23 28 23 C29 23 30 23.4 30.7 24 L31 16 L18 19 L18 31 Z"
      fill="#4F46E5"
    />
    <path d="M18 19 L31 16" stroke="#4338CA" strokeWidth="2" />
  </svg>
);

export const BadgePattern: React.FC<BadgeProps> = ({ size = 32, className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="24" cy="24" r="22" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
    {/* Geometric 2x2 symmetry */}
    <rect x="14" y="14" width="8" height="8" rx="2" fill="#059669" />
    <polygon points="30,14 34,22 26,22" fill="#10B981" />
    <circle cx="18" cy="30" r="4" fill="#34D399" />
    <rect x="26" y="26" width="8" height="8" rx="2" fill="#047857" transform="rotate(45 30 30)" />
  </svg>
);

export const BadgeDice3D: React.FC<BadgeProps> = ({ size = 32, className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="24" cy="24" r="22" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" />
    {/* Isometric Cube Die */}
    <polygon points="24,11 37,18 24,25 11,18" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
    <polygon points="11,18 24,25 24,37 11,30" fill="#EC4899" stroke="#DB2777" strokeWidth="1.5" />
    <polygon points="37,18 24,25 24,37 37,30" fill="#BE185D" stroke="#DB2777" strokeWidth="1.5" />
    {/* Pips */}
    <circle cx="24" cy="18" r="1.8" fill="#FFFFFF" />
    <circle cx="17" cy="26" r="1.5" fill="#FFFFFF" />
    <circle cx="17" cy="31" r="1.5" fill="#FFFFFF" />
    <circle cx="31" cy="25" r="1.5" fill="#FFFFFF" />
    <circle cx="31" cy="29" r="1.5" fill="#FFFFFF" />
    <circle cx="31" cy="33" r="1.5" fill="#FFFFFF" />
  </svg>
);

export const BadgeAccuracyAward: React.FC<BadgeProps> = ({ size = 32, className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="24" cy="24" r="22" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2" />
    <circle cx="24" cy="24" r="14" stroke="#F97316" strokeWidth="2" strokeDasharray="2 2" />
    <circle cx="24" cy="24" r="8" fill="#EA580C" />
    <circle cx="24" cy="24" r="3" fill="#FFFFFF" />
  </svg>
);

export const BadgeAdaptiveBrain: React.FC<BadgeProps> = ({ size = 32, className, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="24" cy="24" r="22" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2" />
    {/* Synapse nodes */}
    <circle cx="18" cy="19" r="3.5" fill="#0D9488" />
    <circle cx="30" cy="19" r="3.5" fill="#0D9488" />
    <circle cx="24" cy="29" r="4" fill="#0F766E" />
    <circle cx="17" cy="30" r="3" fill="#14B8A6" />
    <circle cx="31" cy="30" r="3" fill="#14B8A6" />
    {/* Neural paths */}
    <path d="M18 19 L30 19 L24 29 L18 19 M17 30 L24 29 L31 30" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export type GameBadgeKey = 'fruit-path' | 'melody' | 'pattern' | 'dice-3d' | 'accuracy' | 'adaptive' | 'default';

export const GameBadgeSVG: React.FC<{
  badgeKey: GameBadgeKey;
  size?: number | string;
  className?: string;
}> = ({ badgeKey, size = 32, className }) => {
  switch (badgeKey) {
    case 'fruit-path':
      return <BadgeFruitPath size={size} className={className} />;
    case 'melody':
      return <BadgeMelody size={size} className={className} />;
    case 'pattern':
      return <BadgePattern size={size} className={className} />;
    case 'dice-3d':
      return <BadgeDice3D size={size} className={className} />;
    case 'accuracy':
      return <BadgeAccuracyAward size={size} className={className} />;
    case 'adaptive':
    case 'default':
    default:
      return <BadgeAdaptiveBrain size={size} className={className} />;
  }
};

