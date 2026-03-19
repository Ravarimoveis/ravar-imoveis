// Componente placeholder para logo RAVAR até fazer upload dos PNGs

interface LogoPlaceholderProps {
  variant: 'white' | 'colored';
  className?: string;
}

export function LogoPlaceholder({ variant, className = '' }: LogoPlaceholderProps) {
  const textColor = variant === 'white' ? '#FFFFFF' : '#0A1929';
  const accentColor = '#AF9042';
  
  return (
    <svg 
      viewBox="0 0 200 60" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* RAVAR */}
      <text 
        x="10" 
        y="35" 
        fontFamily="serif" 
        fontSize="32" 
        fontWeight="300" 
        letterSpacing="8"
        fill={textColor}
      >
        RAVAR
      </text>
      
      {/* Linha decorativa dourada */}
      <line 
        x1="10" 
        y1="45" 
        x2="190" 
        y2="45" 
        stroke={accentColor} 
        strokeWidth="1"
      />
      
      {/* Subtítulo */}
      <text 
        x="10" 
        y="56" 
        fontFamily="sans-serif" 
        fontSize="7" 
        fontWeight="300" 
        letterSpacing="6"
        fill={textColor}
        opacity="0.7"
      >
        IMÓVEIS SELECIONADOS
      </text>
    </svg>
  );
}

// Marca d'água placeholder
export function MarcaDaguaPlaceholder({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 400 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text 
        x="200" 
        y="60" 
        fontFamily="serif" 
        fontSize="48" 
        fontWeight="300" 
        letterSpacing="12"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        RAVAR
      </text>
    </svg>
  );
}
