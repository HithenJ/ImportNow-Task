export function Eyebrow({ children, className = '' }: { children: string; className?: string }) {
  return <span className={`eyebrow ${className}`.trim()}>{children}</span>
}
