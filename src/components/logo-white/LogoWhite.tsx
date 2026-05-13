export function LogoWhite({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lotus Care — Enhanced Living"
    >
      {/* Lotus flower icon */}
      <g transform="translate(8, 8)">
        {/* Petals */}
        <path
          d="M32 8C32 8 24 20 24 32C24 38 27.6 40 32 40C36.4 40 40 38 40 32C40 20 32 8 32 8Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M32 8C32 8 24 20 24 32C24 38 27.6 40 32 40C36.4 40 40 38 40 32C40 20 32 8 32 8Z"
          fill="white"
          opacity="0.7"
          transform="rotate(72, 32, 32)"
        />
        <path
          d="M32 8C32 8 24 20 24 32C24 38 27.6 40 32 40C36.4 40 40 38 40 32C40 20 32 8 32 8Z"
          fill="white"
          opacity="0.8"
          transform="rotate(144, 32, 32)"
        />
        <path
          d="M32 8C32 8 24 20 24 32C24 38 27.6 40 32 40C36.4 40 40 38 40 32C40 20 32 8 32 8Z"
          fill="white"
          opacity="0.6"
          transform="rotate(216, 32, 32)"
        />
        <path
          d="M32 8C32 8 24 20 24 32C24 38 27.6 40 32 40C36.4 40 40 38 40 32C40 20 32 8 32 8Z"
          fill="white"
          opacity="0.75"
          transform="rotate(288, 32, 32)"
        />
        {/* Center */}
        <circle cx="32" cy="32" r="6" fill="white" opacity="0.5" />
      </g>

      {/* Text */}
      <text x="80" y="38" fill="white" fontSize="28" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="2">
        LOTUS CARE
      </text>
      <text x="80" y="58" fill="rgba(255,255,255,0.7)" fontSize="13" fontWeight="400" fontFamily="Inter, sans-serif" letterSpacing="3">
        Enhanced Living
      </text>
    </svg>
  );
}
