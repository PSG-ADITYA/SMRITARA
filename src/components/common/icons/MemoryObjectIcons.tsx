import React from 'react';

export type MemoryObjectKey =
  | 'diya'
  | 'bell'
  | 'lotus'
  | 'conch'
  | 'mala'
  | 'palm_leaf'
  | 'peacock'
  | 'flute'
  | 'chandan'
  | 'tree'
  | 'sun'
  | 'moon'
  | 'truth'
  | 'virtue'
  | 'peace'
  | 'mind'
  | 'breath'
  | 'flame';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

export const DiyaSVG: React.FC<IconProps> = ({ size = 36, color = '#D97706', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Base Lamp Bowl */}
    <path
      d="M10 36C10 47.0457 19.8497 56 32 56C44.1503 56 54 47.0457 54 36H10Z"
      fill={color}
      stroke="#B45309"
      strokeWidth="2.5"
    />
    <ellipse cx="32" cy="36" rx="22" ry="5" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
    {/* Flame */}
    <path
      d="M32 10C32 10 38 18 38 24C38 27.3137 35.3137 30 32 30C28.6863 30 26 27.3137 26 24C26 18 32 10 32 10Z"
      fill="#EF4444"
    />
    <path
      d="M32 15C32 15 35 20 35 24C35 25.6569 33.6569 27 32 27C30.3431 27 29 25.6569 29 24C29 20 32 15 32 15Z"
      fill="#FBBF24"
    />
  </svg>
);

export const BellSVG: React.FC<IconProps> = ({ size = 36, color = '#F59E0B', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Handle */}
    <path d="M32 8V20M27 8H37" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="8" r="4" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
    {/* Body */}
    <path
      d="M18 42C18 28 22 20 32 20C42 20 46 28 46 42C48 44 50 46 50 48H14C14 46 16 44 18 42Z"
      fill={color}
      stroke="#B45309"
      strokeWidth="2.5"
    />
    {/* Clapper */}
    <ellipse cx="32" cy="52" rx="4" ry="4" fill="#92400E" />
  </svg>
);

export const LotusSVG: React.FC<IconProps> = ({ size = 36, color = '#EC4899', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Central Petal */}
    <path
      d="M32 12C28 22 26 36 32 46C38 36 36 22 32 12Z"
      fill={color}
      stroke="#BE185D"
      strokeWidth="2"
    />
    {/* Left Outer Petals */}
    <path
      d="M30 46C20 44 12 34 16 22C24 26 28 36 30 46Z"
      fill="#F472B6"
      stroke="#BE185D"
      strokeWidth="2"
    />
    {/* Right Outer Petals */}
    <path
      d="M34 46C44 44 52 34 48 22C40 26 36 36 34 46Z"
      fill="#F472B6"
      stroke="#BE185D"
      strokeWidth="2"
    />
    {/* Base Leaves */}
    <path
      d="M14 48C20 46 26 48 32 50C38 48 44 46 50 48C44 54 20 54 14 48Z"
      fill="#10B981"
      stroke="#047857"
      strokeWidth="2"
    />
  </svg>
);

export const ConchSVG: React.FC<IconProps> = ({ size = 36, color = '#F3F4F6', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M16 46C14 36 20 22 34 14C44 8 50 12 50 20C50 34 38 52 24 54C18 54 16 50 16 46Z"
      fill={color}
      stroke="#4B5563"
      strokeWidth="2.5"
    />
    <path d="M26 24C30 20 38 18 42 22C46 26 42 34 36 40" stroke="#9CA3AF" strokeWidth="2" />
    <path d="M22 36C26 34 32 32 36 36" stroke="#9CA3AF" strokeWidth="2" />
  </svg>
);

export const MalaSVG: React.FC<IconProps> = ({ size = 36, color = '#92400E', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Circle loop of beads */}
    <circle cx="32" cy="28" r="18" stroke="#D97706" strokeWidth="2" strokeDasharray="4 4" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
      const rad = (ang * Math.PI) / 180;
      const x = 32 + 18 * Math.cos(rad);
      const y = 28 + 18 * Math.sin(rad);
      return <circle key={i} cx={x} cy={y} r="3" fill={color} stroke="#78350F" strokeWidth="1" />;
    })}
    {/* Tassel */}
    <path d="M32 46V58M28 58H36" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const PalmLeafSVG: React.FC<IconProps> = ({ size = 36, color = '#FDE68A', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="10" y="22" width="44" height="12" rx="3" fill={color} stroke="#B45309" strokeWidth="2" />
    <rect x="10" y="38" width="44" height="12" rx="3" fill={color} stroke="#B45309" strokeWidth="2" />
    {/* Manuscript text lines */}
    <line x1="16" y1="28" x2="48" y2="28" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />
    <line x1="16" y1="44" x2="48" y2="44" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3 2" />
    {/* Binding Sacred Thread */}
    <line x1="24" y1="18" x2="24" y2="54" stroke="#DC2626" strokeWidth="2" />
  </svg>
);

export const PeacockSVG: React.FC<IconProps> = ({ size = 36, color = '#0284C7', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Stem */}
    <path d="M14 56C24 46 34 32 44 14" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
    {/* Feather Eye Outer */}
    <ellipse cx="44" cy="20" rx="14" ry="10" transform="rotate(-35 44 20)" fill="#10B981" />
    <ellipse cx="44" cy="20" rx="9" ry="6" transform="rotate(-35 44 20)" fill="#0284C7" />
    <circle cx="44" cy="20" r="3.5" fill="#4338CA" />
  </svg>
);

export const FluteSVG: React.FC<IconProps> = ({ size = 36, color = '#D97706', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect
      x="8"
      y="28"
      width="48"
      height="8"
      rx="4"
      transform="rotate(-20 32 32)"
      fill={color}
      stroke="#78350F"
      strokeWidth="2"
    />
    {[20, 26, 32, 38, 44].map((x, i) => (
      <circle key={i} cx={x} cy={32} r="1.5" fill="#451A03" transform="rotate(-20 32 32)" />
    ))}
  </svg>
);

export const KalashSVG: React.FC<IconProps> = ({ size = 36, color = '#F59E0B', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Coconut */}
    <ellipse cx="32" cy="20" rx="8" ry="7" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
    {/* Mango Leaves */}
    <path d="M22 24L32 12L42 24" stroke="#059669" strokeWidth="2" fill="#10B981" />
    {/* Pot */}
    <path
      d="M20 28C20 28 14 36 14 44C14 52 22 56 32 56C42 56 50 52 50 44C50 36 44 28 44 28H20Z"
      fill={color}
      stroke="#B45309"
      strokeWidth="2.5"
    />
    {/* Swastika / Auspicious line */}
    <line x1="28" y1="42" x2="36" y2="42" stroke="#DC2626" strokeWidth="2" />
    <line x1="32" y1="38" x2="32" y2="46" stroke="#DC2626" strokeWidth="2" />
  </svg>
);

export const BodhiLeafSVG: React.FC<IconProps> = ({ size = 36, color = '#10B981', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Heart shaped leaf with elongated tip */}
    <path
      d="M32 10C32 10 33 16 35 22C42 20 52 26 50 38C48 50 36 54 32 58C28 54 16 50 14 38C12 26 22 20 29 22C31 16 32 10 32 10Z"
      fill={color}
      stroke="#047857"
      strokeWidth="2.5"
    />
    <path d="M32 20V52" stroke="#047857" strokeWidth="2" />
    <path d="M32 28L42 24M32 36L42 34M32 44L38 43" stroke="#047857" strokeWidth="1.5" />
    <path d="M32 28L22 24M32 36L22 34M32 44L26 43" stroke="#047857" strokeWidth="1.5" />
  </svg>
);

export const SuryaMandalaSVG: React.FC<IconProps> = ({ size = 36, color = '#F59E0B', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Center Sun */}
    <circle cx="32" cy="32" r="12" fill="#FDE68A" stroke={color} strokeWidth="2.5" />
    {/* Rays */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <line
        key={i}
        x1="32"
        y1="12"
        x2="32"
        y2="6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        transform={`rotate(${deg} 32 32)`}
      />
    ))}
  </svg>
);

export const ChandraKalaSVG: React.FC<IconProps> = ({ size = 36, color = '#38BDF8', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M38 12C24 16 16 30 20 44C24 54 34 58 44 54C32 50 26 36 30 24C32 18 36 14 38 12Z"
      fill={color}
      stroke="#0284C7"
      strokeWidth="2"
    />
    <circle cx="46" cy="22" r="2" fill="#FDE68A" />
  </svg>
);

// Match Card Symbols (Values/Philosophy)
export const ScalesOfTruthSVG: React.FC<IconProps> = ({ size = 36, color = '#D97706', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <line x1="32" y1="12" x2="32" y2="52" stroke="#78350F" strokeWidth="3" />
    <line x1="16" y1="20" x2="48" y2="20" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    {/* Left Pan */}
    <path d="M16 20L10 36H22L16 20Z" fill={color} stroke="#78350F" strokeWidth="1.5" />
    {/* Right Pan */}
    <path d="M48 20L42 36H54L48 20Z" fill={color} stroke="#78350F" strokeWidth="1.5" />
    <path d="M24 52H40" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const DharmaWheelSVG: React.FC<IconProps> = ({ size = 36, color = '#2563EB', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="32" cy="32" r="22" stroke={color} strokeWidth="3" />
    <circle cx="32" cy="32" r="6" fill="#DBEAFE" stroke={color} strokeWidth="2.5" />
    {[0, 45, 90, 135].map(deg => (
      <line
        key={deg}
        x1="10"
        y1="32"
        x2="54"
        y2="32"
        stroke={color}
        strokeWidth="2"
        transform={`rotate(${deg} 32 32)`}
      />
    ))}
  </svg>
);

export const ShantiDoveSVG: React.FC<IconProps> = ({ size = 36, color = '#64748B', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M16 38C20 38 28 36 34 28C38 22 46 16 52 18C52 24 46 32 40 38C34 44 26 46 16 46V38Z"
      fill="#F1F5F9"
      stroke={color}
      strokeWidth="2"
    />
    <path d="M34 28C38 32 44 32 50 30" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    <circle cx="48" cy="22" r="1.5" fill="#1E293B" />
  </svg>
);

export const SmritiMindSVG: React.FC<IconProps> = ({ size = 36, color = '#9333EA', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Head profile */}
    <path
      d="M20 52V46C20 42 22 40 26 38C24 34 22 28 24 20C26 12 34 8 42 10C48 12 50 18 50 24C50 30 46 34 42 36V46"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Inner Smriti / Third Eye Spark */}
    <polygon points="36,20 38,24 42,24 39,27 40,31 36,28 32,31 33,27 30,24 34,24" fill="#F59E0B" />
  </svg>
);

export const PranaBreathSVG: React.FC<IconProps> = ({ size = 36, color = '#06B6D4', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 26H36C40 26 44 23 44 19C44 15 40 12 36 12C32 12 28 15 28 19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M8 36H44C48 36 52 39 52 43C52 47 48 50 44 50C40 50 36 47 36 43"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const TejasFlameSVG: React.FC<IconProps> = ({ size = 36, color = '#EF4444', className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M32 8C32 8 44 20 44 32C44 42 38 48 32 54C26 48 20 42 20 32C20 20 32 8 32 8Z"
      fill={color}
      stroke="#B91C1C"
      strokeWidth="2"
    />
    <path
      d="M32 20C32 20 40 28 40 36C40 42 36 46 32 50C28 46 24 42 24 36C24 28 32 20 32 20Z"
      fill="#F59E0B"
    />
    <circle cx="32" cy="38" r="4" fill="#FEF08A" />
  </svg>
);

/**
 * Universal dispatcher for any memory object or match card
 */
export const MemoryObjectSVG: React.FC<{
  objectKey: string;
  size?: number | string;
  className?: string;
}> = ({ objectKey, size = 36, className }) => {
  switch (objectKey) {
    case 'diya':
      return <DiyaSVG size={size} className={className} />;
    case 'bell':
      return <BellSVG size={size} className={className} />;
    case 'lotus':
      return <LotusSVG size={size} className={className} />;
    case 'conch':
      return <ConchSVG size={size} className={className} />;
    case 'mala':
      return <MalaSVG size={size} className={className} />;
    case 'palm_leaf':
      return <PalmLeafSVG size={size} className={className} />;
    case 'peacock':
      return <PeacockSVG size={size} className={className} />;
    case 'flute':
      return <FluteSVG size={size} className={className} />;
    case 'chandan':
      return <KalashSVG size={size} className={className} />;
    case 'tree':
      return <BodhiLeafSVG size={size} className={className} />;
    case 'sun':
      return <SuryaMandalaSVG size={size} className={className} />;
    case 'moon':
      return <ChandraKalaSVG size={size} className={className} />;
    // Card symbols
    case 'truth':
    case 'satya':
    case '⚖️':
      return <ScalesOfTruthSVG size={size} className={className} />;
    case 'virtue':
    case 'dharma':
    case '☸️':
      return <DharmaWheelSVG size={size} className={className} />;
    case 'peace':
    case 'shanti':
    case '🕊️':
      return <ShantiDoveSVG size={size} className={className} />;
    case 'mind':
    case 'smriti':
    case '🧠':
      return <SmritiMindSVG size={size} className={className} />;
    case 'breath':
    case 'prana':
    case '🌬️':
      return <PranaBreathSVG size={size} className={className} />;
    case 'flame':
    case 'tejas':
    case '🔥':
      return <TejasFlameSVG size={size} className={className} />;
    default:
      return <BodhiLeafSVG size={size} className={className} />;
  }
};
