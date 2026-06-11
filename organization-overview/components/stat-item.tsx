import type { LucideIcon } from "lucide-react"

interface StatItemProps {
  icon: LucideIcon
  value: string
  unit?: string
  label: string
  sublabel?: string
}

export function StatItem({ icon: Icon, value, unit, label, sublabel }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-3 text-center">
      <Icon className="size-7 text-primary" strokeWidth={1.5} aria-hidden="true" />
      <p className="flex items-baseline gap-1 leading-none">
        <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
        {unit ? <span className="text-xs text-muted-foreground">{unit}</span> : null}
      </p>
      <div className="space-y-0.5">
        <p className="text-sm font-medium leading-snug text-foreground text-balance">{label}</p>
        {sublabel ? <p className="text-xs leading-snug text-muted-foreground text-balance">{sublabel}</p> : null}
      </div>
    </div>
  )
}
