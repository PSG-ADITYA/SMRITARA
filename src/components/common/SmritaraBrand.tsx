import React from 'react';

export interface SmritaraBrandProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export const SmritaraBrand: React.FC<SmritaraBrandProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  const pixelSizes = {
    sm: { icon: 22, text: '1.05rem', sub: '0.65rem' },
    md: { icon: 30, text: '1.25rem', sub: '0.72rem' },
    lg: { icon: 42, text: '1.75rem', sub: '0.82rem' },
  };

  const { icon: iconSize, text: textSize, sub: subSize } = pixelSizes[size];

  // Minimal abstract mark: interconnected continuity loop & upward leaf/star apex
  const emblemSvg = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="smritara-emblem-svg"
      aria-hidden="true"
      data-testid="smritara-brand-emblem"
    >
      <circle cx="20" cy="20" r="19" fill="#F4F6F2" stroke="#DCE3DA" strokeWidth="1.2" />
      {/* Harmonic continuous loop (Memory & Awareness) */}
      <path
        d="M13 23C13 18.5 16.5 15 20 15C23.5 15 27 18.5 27 23C27 26.5 24 28.5 20 28.5C16 28.5 13 26.5 13 23Z"
        stroke="#285443"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Upward aspirational arc (Tara - Rising Star / Clarity) */}
      <path
        d="M20 7V15M20 7C17.5 10 15 12.5 15 15M20 7C22.5 10 25 12.5 25 15"
        stroke="#1E7065"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central focus seed in warm terracotta */}
      <circle cx="20" cy="22" r="2.2" fill="#C05C3C" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div
        className={`smritara-brand-icon-only ${className}`}
        title="SMRITARA — Mindful Practice & Memory"
        aria-label="SMRITARA Logo"
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {emblemSvg}
      </div>
    );
  }

  return (
    <div
      className={`smritara-brand ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '8px' : '12px',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {emblemSvg}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span
          className="brand-wordmark"
          style={{
            fontFamily: "'Outfit', var(--font-heading), sans-serif",
            fontSize: textSize,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#1C221E',
          }}
        >
          SMRITARA
        </span>
        {variant === 'full' && showTagline && (
          <span
            className="brand-tagline"
            style={{
              fontFamily: "'Inter', var(--font-body), sans-serif",
              fontSize: subSize,
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: '#588157',
              marginTop: '2px',
              textTransform: 'uppercase',
            }}
          >
            Remember. Reflect. Rise.
          </span>
        )}
      </div>
    </div>
  );
};
