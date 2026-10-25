import React from 'react';

export interface DieFaceProps extends React.SVGProps<SVGSVGElement> {
  value: 1 | 2 | 3 | 4 | 5 | 6;
  size?: number | string;
  faceColor?: string;
  pipColor?: string;
  borderColor?: string;
  className?: string;
}

/**
 * Authentic SVG Die Face with precise geometric pips
 */
export const DieFaceSVG: React.FC<DieFaceProps> = ({
  value,
  size = 64,
  faceColor = '#FFFFFF',
  pipColor = '#1F2937',
  borderColor = '#D1D5DB',
  className,
  ...props
}) => {
  const pipR = 4.5;

  const renderPips = () => {
    switch (value) {
      case 1:
        return <circle cx="32" cy="32" r={pipR * 1.3} fill={pipColor} />;
      case 2:
        return (
          <>
            <circle cx="20" cy="20" r={pipR} fill={pipColor} />
            <circle cx="44" cy="44" r={pipR} fill={pipColor} />
          </>
        );
      case 3:
        return (
          <>
            <circle cx="18" cy="18" r={pipR} fill={pipColor} />
            <circle cx="32" cy="32" r={pipR} fill={pipColor} />
            <circle cx="46" cy="46" r={pipR} fill={pipColor} />
          </>
        );
      case 4:
        return (
          <>
            <circle cx="18" cy="18" r={pipR} fill={pipColor} />
            <circle cx="46" cy="18" r={pipR} fill={pipColor} />
            <circle cx="18" cy="46" r={pipR} fill={pipColor} />
            <circle cx="46" cy="46" r={pipR} fill={pipColor} />
          </>
        );
      case 5:
        return (
          <>
            <circle cx="18" cy="18" r={pipR} fill={pipColor} />
            <circle cx="46" cy="18" r={pipR} fill={pipColor} />
            <circle cx="32" cy="32" r={pipR} fill={pipColor} />
            <circle cx="18" cy="46" r={pipR} fill={pipColor} />
            <circle cx="46" cy="46" r={pipR} fill={pipColor} />
          </>
        );
      case 6:
        return (
          <>
            <circle cx="18" cy="16" r={pipR} fill={pipColor} />
            <circle cx="18" cy="32" r={pipR} fill={pipColor} />
            <circle cx="18" cy="48" r={pipR} fill={pipColor} />
            <circle cx="46" cy="16" r={pipR} fill={pipColor} />
            <circle cx="46" cy="32" r={pipR} fill={pipColor} />
            <circle cx="46" cy="48" r={pipR} fill={pipColor} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Die face with value ${value}`}
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="12"
        fill={faceColor}
        stroke={borderColor}
        strokeWidth="3"
      />
      {renderPips()}
    </svg>
  );
};

export interface Die3DProps {
  frontValue: 1 | 2 | 3 | 4 | 5 | 6;
  rotateX?: number;
  rotateY?: number;
  size?: number;
  colorTheme?: 'classic' | 'emerald' | 'amber' | 'ruby' | 'sapphire';
  isRevealed?: boolean;
}

/**
 * Pure CSS 3D Transform Die Cube with standard opposite faces summing to 7:
 * front: value, back: 7 - value, right: 3/4, left: 4/3, top: 2/5, bottom: 5/2
 */
export const Die3DCube: React.FC<Die3DProps> = ({
  frontValue,
  rotateX = -20,
  rotateY = 35,
  size = 72,
  colorTheme = 'classic',
  isRevealed = true,
}) => {
  const oppositeValue = (val: number): 1 | 2 | 3 | 4 | 5 | 6 => (7 - val) as 1 | 2 | 3 | 4 | 5 | 6;
  const backValue = oppositeValue(frontValue);
  
  // Pick other authentic faces
  const sideFaces = [1, 2, 3, 4, 5, 6].filter(v => v !== frontValue && v !== backValue);
  const rightVal = (sideFaces[0] || 3) as 1 | 2 | 3 | 4 | 5 | 6;
  const leftVal = oppositeValue(rightVal);
  const topVal = (sideFaces.find(v => v !== rightVal && v !== leftVal) || 2) as 1 | 2 | 3 | 4 | 5 | 6;
  const bottomVal = oppositeValue(topVal);

  const getThemeColors = () => {
    switch (colorTheme) {
      case 'emerald':
        return { face: '#ECFDF5', pip: '#065F46', border: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' };
      case 'amber':
        return { face: '#FFFBEB', pip: '#92400E', border: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)' };
      case 'ruby':
        return { face: '#FFF1F2', pip: '#9F1239', border: '#F43F5E', glow: 'rgba(244, 63, 94, 0.4)' };
      case 'sapphire':
        return { face: '#EFF6FF', pip: '#1E40AF', border: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)' };
      case 'classic':
      default:
        return { face: '#FFFFFF', pip: '#1E293B', border: '#94A3B8', glow: 'rgba(0, 0, 0, 0.2)' };
    }
  };

  const theme = getThemeColors();
  const half = size / 2;

  const faceStyle = (transform: string): React.CSSProperties => ({
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    transform,
    backfaceVisibility: 'hidden',
    boxShadow: `inset 0 0 10px ${theme.glow}, 0 2px 6px rgba(0,0,0,0.15)`,
    borderRadius: '12px',
    background: theme.face,
    overflow: 'hidden',
  });

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '600px',
        display: 'inline-block',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: isRevealed
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            : `rotateX(${rotateX + 180}deg) rotateY(${rotateY + 180}deg)`,
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Front Face */}
        <div style={faceStyle(`translateZ(${half}px)`)}>
          <DieFaceSVG value={frontValue} size={size} faceColor={theme.face} pipColor={theme.pip} borderColor={theme.border} />
        </div>
        {/* Back Face */}
        <div style={faceStyle(`rotateY(180deg) translateZ(${half}px)`)}>
          <DieFaceSVG value={backValue} size={size} faceColor={theme.face} pipColor={theme.pip} borderColor={theme.border} />
        </div>
        {/* Right Face */}
        <div style={faceStyle(`rotateY(90deg) translateZ(${half}px)`)}>
          <DieFaceSVG value={rightVal} size={size} faceColor={theme.face} pipColor={theme.pip} borderColor={theme.border} />
        </div>
        {/* Left Face */}
        <div style={faceStyle(`rotateY(-90deg) translateZ(${half}px)`)}>
          <DieFaceSVG value={leftVal} size={size} faceColor={theme.face} pipColor={theme.pip} borderColor={theme.border} />
        </div>
        {/* Top Face */}
        <div style={faceStyle(`rotateX(90deg) translateZ(${half}px)`)}>
          <DieFaceSVG value={topVal} size={size} faceColor={theme.face} pipColor={theme.pip} borderColor={theme.border} />
        </div>
        {/* Bottom Face */}
        <div style={faceStyle(`rotateX(-90deg) translateZ(${half}px)`)}>
          <DieFaceSVG value={bottomVal} size={size} faceColor={theme.face} pipColor={theme.pip} borderColor={theme.border} />
        </div>
      </div>
    </div>
  );
};
