import type { ReactNode } from "react"

interface SectionCardProps {
  number: string
  title: string
  children: ReactNode
  className?: string
}

export function SectionCard({ number, title, children, className }: SectionCardProps) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 ${className ?? ""}`}
    >
      <header className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
        <span className="font-mono text-2xl font-semibold tabular-nums text-primary/70">{number}</span>
        <h2 className="text-lg font-semibold tracking-wide text-foreground">{title}</h2>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  )
}
