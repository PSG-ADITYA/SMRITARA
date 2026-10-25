import React from 'react';

export interface FruitIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Hand-authored SVG illustration of an Indian Alphonso Mango
 */
export const FruitMango: React.FC<FruitIconProps> = ({ size = 48, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Golden Alphonso Mango"
    {...props}
  >
    {/* Stem and Leaf */}
    <path
      d="M32 8 C32 4, 30 2, 28 2 C26 2, 26 5, 27 8"
      stroke="#5C4033"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M29 6 C35 3, 42 5, 45 10 C41 12, 34 11, 29 6 Z"
      fill="#2E7D32"
      stroke="#1B5E20"
      strokeWidth="1.2"
    />
    {/* Mango Body */}
    <path
      d="M32 9 C43 9, 52 18, 52 30 C52 44, 40 56, 28 56 C18 56, 12 47, 14 36 C16 23, 22 9, 32 9 Z"
      fill="url(#mangoGradient)"
      stroke="#D97706"
      strokeWidth="2"
    />
    {/* Subtle highlight */}
    <path
      d="M22 20 C26 15, 33 13, 38 15"
      stroke="#FEF3C7"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
    />
    <defs>
      <linearGradient id="mangoGradient" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="55%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Hand-authored SVG illustration of a Ruby Pomegranate (Anaar)
 */
export const FruitPomegranate: React.FC<FruitIconProps> = ({ size = 48, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Ruby Pomegranate"
    {...props}
  >
    {/* Crown / Calyx */}
    <path
      d="M26 10 L28 4 L32 7 L36 4 L38 10 Z"
      fill="#991B1B"
      stroke="#7F1D1D"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Pomegranate Body */}
    <circle
      cx="32"
      cy="36"
      r="23"
      fill="url(#pomGradient)"
      stroke="#7F1D1D"
      strokeWidth="2"
    />
    {/* Aril segment cutout window */}
    <path
      d="M32 24 C40 24, 45 30, 44 38 C43 45, 37 49, 32 49 C27 49, 21 45, 20 38 C19 30, 24 24, 32 24 Z"
      fill="#450A0A"
      opacity="0.25"
    />
    {/* Ruby seeds/arils */}
    <circle cx="28" cy="32" r="2.8" fill="#F43F5E" />
    <circle cx="36" cy="32" r="2.8" fill="#FDA4AF" />
    <circle cx="32" cy="38" r="3" fill="#E11D48" />
    <circle cx="27" cy="42" r="2.5" fill="#BE123C" />
    <circle cx="37" cy="42" r="2.5" fill="#FB7185" />
    <defs>
      <radialGradient id="pomGradient" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#E11D48" />
        <stop offset="70%" stopColor="#9F1239" />
        <stop offset="100%" stopColor="#4C0519" />
      </radialGradient>
    </defs>
  </svg>
);

/**
 * Hand-authored SVG illustration of a Fig / Anjeer
 */
export const FruitFig: React.FC<FruitIconProps> = ({ size = 48, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Purple Fig Anjeer"
    {...props}
  >
    {/* Stem */}
    <path
      d="M32 4 C31 8, 30 11, 31 15"
      stroke="#4D7C0F"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Teardrop Fig Shape */}
    <path
      d="M32 14 C39 18, 49 26, 49 39 C49 50, 41 58, 32 58 C23 58, 15 50, 15 39 C15 26, 25 18, 32 14 Z"
      fill="url(#figGradient)"
      stroke="#3B0764"
      strokeWidth="2"
    />
    {/* Subtle fig ribs */}
    <path d="M32 18 C37 28, 41 42, 38 52" stroke="#A855F7" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
    <path d="M32 18 C27 28, 23 42, 26 52" stroke="#A855F7" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
    <defs>
      <radialGradient id="figGradient" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#7E22CE" />
        <stop offset="60%" stopColor="#581C87" />
        <stop offset="100%" stopColor="#2E1065" />
      </radialGradient>
    </defs>
  </svg>
);

/**
 * Hand-authored SVG illustration of a Black Plum (Jamun)
 */
export const FruitJamun: React.FC<FruitIconProps> = ({ size = 48, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Deep Indigo Jamun"
    {...props}
  >
    {/* Stem & tiny leaf */}
    <path d="M32 6 C32 10, 31 12, 30 14" stroke="#3F6212" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M31 10 C36 8, 40 9, 42 12 C38 13, 34 12, 31 10 Z" fill="#4D7C0F" />
    {/* Oval Berry Body */}
    <ellipse
      cx="32"
      cy="36"
      rx="19"
      ry="23"
      fill="url(#jamunGradient)"
      stroke="#1E1B4B"
      strokeWidth="2"
    />
    {/* Glossy reflection */}
    <ellipse cx="26" cy="27" rx="4" ry="7" transform="rotate(-20 26 27)" fill="#C7D2FE" opacity="0.6" />
    <defs>
      <radialGradient id="jamunGradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#4338CA" />
        <stop offset="50%" stopColor="#312E81" />
        <stop offset="100%" stopColor="#0F172A" />
      </radialGradient>
    </defs>
  </svg>
);

/**
 * Hand-authored SVG illustration of a Ripe Banana
 */
export const FruitBanana: React.FC<FruitIconProps> = ({ size = 48, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Ripe Golden Banana"
    {...props}
  >
    {/* Stalk */}
    <path d="M12 20 L16 16 L20 18 L16 22 Z" fill="#65A30D" stroke="#3F6212" strokeWidth="1.2" />
    {/* Curved Banana Body */}
    <path
      d="M17 18 C28 20, 48 26, 52 48 C44 48, 28 42, 17 18 Z"
      fill="url(#bananaGradient)"
      stroke="#CA8A04"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Ridges */}
    <path
      d="M18 20 C28 26, 42 33, 50 47"
      stroke="#EAB308"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Brown tip */}
    <circle cx="51.5" cy="48" r="2" fill="#713F12" />
    <defs>
      <linearGradient id="bananaGradient" x1="16" y1="16" x2="52" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Hand-authored SVG illustration of a Crisp Green Apple
 */
export const FruitApple: React.FC<FruitIconProps> = ({ size = 48, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Crisp Green Apple"
    {...props}
  >
    {/* Stem */}
    <path d="M32 14 C33 9, 36 6, 40 4" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />
    {/* Leaf */}
    <path d="M33 10 C38 7, 44 8, 47 13 C41 14, 36 13, 33 10 Z" fill="#15803D" stroke="#14532D" strokeWidth="1" />
    {/* Apple Body with double lobes */}
    <path
      d="M32 18 C26 12, 12 16, 12 30 C12 44, 23 56, 32 56 C41 56, 52 44, 52 30 C52 16, 38 12, 32 18 Z"
      fill="url(#appleGradient)"
      stroke="#166534"
      strokeWidth="2"
    />
    {/* Sheen */}
    <ellipse cx="22" cy="28" rx="4" ry="7" transform="rotate(-25 22 28)" fill="#DCFCE7" opacity="0.6" />
    <defs>
      <radialGradient id="appleGradient" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="50%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </radialGradient>
    </defs>
  </svg>
);

/**
 * Hand-authored SVG illustration of a Pink Guava (Amrood)
 */
export const FruitGuava: React.FC<FruitIconProps> = ({ size = 48, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Pink Flesh Guava"
    {...props}
  >
    {/* Stem */}
    <path d="M32 8 L32 14" stroke="#4D7C0F" strokeWidth="2.5" strokeLinecap="round" />
    {/* Round Guava body */}
    <circle cx="32" cy="35" r="22" fill="#84CC16" stroke="#4D7C0F" strokeWidth="2" />
    {/* Inner pink slice opening */}
    <circle cx="32" cy="35" r="15" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="1.5" />
    {/* Tiny Guava seeds */}
    <circle cx="28" cy="32" r="1.5" fill="#BE123C" />
    <circle cx="36" cy="33" r="1.5" fill="#BE123C" />
    <circle cx="31" cy="37" r="1.5" fill="#BE123C" />
    <circle cx="34" cy="40" r="1.5" fill="#BE123C" />
    <circle cx="28" cy="39" r="1.5" fill="#BE123C" />
  </svg>
);

/**
 * Hand-authored SVG illustration of a Fresh Coconut (Nariyal)
 */
export const FruitCoconut: React.FC<FruitIconProps> = ({ size = 48, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Fresh Brown Coconut"
    {...props}
  >
    {/* Coconut Body */}
    <circle cx="32" cy="33" r="23" fill="#78350F" stroke="#451A03" strokeWidth="2" />
    {/* Fibrous Texture lines */}
    <path d="M22 18 C26 28, 25 40, 22 48" stroke="#92400E" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
    <path d="M42 18 C38 28, 39 40, 42 48" stroke="#92400E" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
    <path d="M32 10 L32 56" stroke="#92400E" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    {/* 3 Coconut "Eyes" */}
    <ellipse cx="26" cy="24" rx="2.5" ry="3.5" fill="#451A03" />
    <ellipse cx="38" cy="24" rx="2.5" ry="3.5" fill="#451A03" />
    <ellipse cx="32" cy="32" rx="3" ry="2.5" fill="#451A03" />
  </svg>
);

export type FruitKey = 'mango' | 'pomegranate' | 'fig' | 'jamun' | 'banana' | 'apple' | 'guava' | 'coconut';

export interface FruitDefinition {
  id: FruitKey;
  name: string;
  hindiName: string;
  color: string;
  component: React.FC<FruitIconProps>;
}

export const FRUIT_CATALOGUE: Record<FruitKey, FruitDefinition> = {
  mango: {
    id: 'mango',
    name: 'Alphonso Mango',
    hindiName: 'Aam (आम)',
    color: '#F59E0B',
    component: FruitMango,
  },
  pomegranate: {
    id: 'pomegranate',
    name: 'Ruby Pomegranate',
    hindiName: 'Anaar (अनार)',
    color: '#E11D48',
    component: FruitPomegranate,
  },
  fig: {
    id: 'fig',
    name: 'Purple Fig',
    hindiName: 'Anjeer (अंजीर)',
    color: '#7E22CE',
    component: FruitFig,
  },
  jamun: {
    id: 'jamun',
    name: 'Black Plum',
    hindiName: 'Jamun (जामुन)',
    color: '#3730A3',
    component: FruitJamun,
  },
  banana: {
    id: 'banana',
    name: 'Ripe Banana',
    hindiName: 'Kela (केला)',
    color: '#EAB308',
    component: FruitBanana,
  },
  apple: {
    id: 'apple',
    name: 'Green Apple',
    hindiName: 'Seb (सेब)',
    color: '#22C55E',
    component: FruitApple,
  },
  guava: {
    id: 'guava',
    name: 'Pink Guava',
    hindiName: 'Amrood (अमरूद)',
    color: '#84CC16',
    component: FruitGuava,
  },
  coconut: {
    id: 'coconut',
    name: 'Fresh Coconut',
    hindiName: 'Nariyal (नारियल)',
    color: '#78350F',
    component: FruitCoconut,
  },
};

export const ALL_FRUITS: FruitKey[] = [
  'mango',
  'pomegranate',
  'fig',
  'jamun',
  'banana',
  'apple',
  'guava',
  'coconut',
];
