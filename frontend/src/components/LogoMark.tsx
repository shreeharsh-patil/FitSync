interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 24, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="6" fill="#F97316" />
      <path
        d="M6 16L9 8l3.5 10L16 8l2.5 8"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
