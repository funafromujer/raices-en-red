type IconProps = { className?: string };

export function MaterialIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-icon ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M16.6 2h-3.2v13.300a2.800 2.800 0 1 1-2.800-2.800 2.900 2.900 0 0 1 .8.100V9.300a6 6 0 1 0 5.200 5.900V8.600a7.300 7.300 0 0 0 4.200 1.300V6.700A4.300 4.300 0 0 1 16.600 2Z" />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800C22 15.200 22 12 22 12s0-3.200-.4-4.800ZM10 15V9l5.200 3Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.8 13.500L3 21l4.700-1.200A9 9 0 1 0 12 3Z" />
      <path d="M9 8.500c0 3.500 3 6.500 6.500 6.500l1-1.800-2-1-1 .8a4.800 4.800 0 0 1-2.500-2.500l.8-1-1-2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
