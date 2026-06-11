import { Leaf, Users, Landmark } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface EsgColumn {
  icon: LucideIcon
  title: string
  label: string
  color: string
  items: string[]
}

const columns: EsgColumn[] = [
  {
    icon: Leaf,
    title: "Environment",
    label: "環境",
    color: "var(--esg-env)",
    items: [
      "12 公頃 竹林經營",
      "7,526 m² 碳匯盤查",
      "13 公噸 竹材循環利用",
      "建構竹循環經濟模式",
      "推動竹林永續治理",
    ],
  },
  {
    icon: Users,
    title: "Social",
    label: "社會",
    color: "var(--esg-social)",
    items: [
      "100% 原住民合作社",
      "15 位以上 社員參與",
      "500 人次以上 參與活動",
      "200 位以上 學生參與",
      "青年返鄉與人才培育",
    ],
  },
  {
    icon: Landmark,
    title: "Governance",
    label: "治理",
    color: "var(--esg-gov)",
    items: [
      "合作社組織正式成立",
      "部落自主治理機制",
      "大學陪伴輔導模式",
      "公私協力治理架構",
      "國際合作交流平台",
    ],
  },
]

export function EsgSection() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <header className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
        <span className="font-mono text-2xl font-semibold tabular-nums text-primary/70">08</span>
        <h2 className="text-lg font-semibold tracking-wide text-foreground">ESG / 地方創生量化成果指標</h2>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((col) => {
          const Icon = col.icon
          return (
            <div key={col.title} className="overflow-hidden rounded-xl border border-border">
              <div
                className="flex items-center gap-2 px-4 py-2.5 text-card"
                style={{ backgroundColor: col.color }}
              >
                <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="text-sm font-semibold tracking-wide">
                  {col.title} <span className="font-normal opacity-90">{col.label}</span>
                </h3>
              </div>
              <ul className="space-y-2 bg-secondary/40 px-4 py-3.5">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
