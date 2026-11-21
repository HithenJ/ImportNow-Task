export function Art({ name, className, stroke = 1.2 }: { name: string; className?: string; stroke?: number }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke }
  switch (name) {
    case 'phone':
      return (
        <svg {...common}>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      )
    case 'scooter':
      return (
        <svg {...common}>
          <circle cx="5.5" cy="17" r="3.5" />
          <circle cx="18.5" cy="17" r="3.5" />
          <path d="M5.5 17l4-8h5l4 8M9 6h3" />
        </svg>
      )
    case 'sofa':
      return <svg {...common}><path d="M3 11h18v6H3zM5 17v3M19 17v3M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4" /></svg>
    case 'bulb':
      return <svg {...common}><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z" /></svg>
    case 'cart':
      return <svg {...common}><path d="M3 4h2l2.5 11h11L21 7H7M9 20a1 1 0 100-2 1 1 0 000 2zM18 20a1 1 0 100-2 1 1 0 000 2z" /></svg>
    case 'hall':
      return <svg {...common}><path d="M3 21V8l9-5 9 5v13M9 21v-6h6v6M7 10h2M15 10h2" /></svg>
    case 'desk':
      return <svg {...common}><path d="M3 8h18v3H3zM5 11v9M19 11v9M10 8V5h4v3" /></svg>
    default:
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
  }
}
