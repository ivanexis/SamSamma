export function ReportHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 shadow-sm sm:px-10 sm:py-10">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div
          className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-secondary text-center text-xs font-semibold leading-tight text-primary"
          aria-hidden="true"
        >
          山莎
          <br />
          蔓岸
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-wide text-foreground text-balance sm:text-4xl">
            山莎蔓岸合作社
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xl font-semibold text-foreground sm:text-2xl">量化成果總覽</p>
            <span className="hidden text-border sm:inline">｜</span>
            <p className="font-mono text-lg tracking-widest text-muted-foreground sm:text-xl">2024 – 2026</p>
          </div>
          <p className="pt-1 text-sm text-muted-foreground sm:text-base">
            從山林到世界，從文化到產業，從今天到永續的未來
          </p>
        </div>
      </div>
    </header>
  )
}
