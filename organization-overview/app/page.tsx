import {
  CalendarDays,
  Users,
  UserPlus,
  MessageSquare,
  Handshake,
  Building2,
  Sprout,
  Layers,
  Boxes,
  Plane,
  Drone,
  MapPin,
  HardHat,
  Award,
  PresentationIcon,
  GraduationCap,
  UserCheck,
  Home,
  Search,
  BookOpen,
  PlayCircle,
  BookMarked,
  Droplet,
  ShoppingBasket,
  RefreshCw,
  Briefcase,
  FileText,
  ImageIcon,
  TrendingUp,
} from "lucide-react"
import { ReportHeader } from "@/components/report-header"
import { SectionCard } from "@/components/section-card"
import { StatItem } from "@/components/stat-item"
import { EsgSection } from "@/components/esg-section"

export default function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="space-y-6">
        <ReportHeader />

        {/* Row: 01 + 02 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 01 組織治理 */}
          <SectionCard number="01" title="組織治理">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              <StatItem icon={CalendarDays} value="2024" unit="年" label="合作社成立" />
              <StatItem icon={Users} value="100%" label="原住民合作社" />
              <StatItem icon={UserPlus} value="15+" unit="位" label="合作社員數" sublabel="15 位以上" />
              <StatItem icon={MessageSquare} value="10+" unit="場" label="部落會議辦理" sublabel="10 場以上" />
              <StatItem icon={Handshake} value="20+" unit="個" label="外部合作單位" sublabel="20 個以上" />
            </div>
            <div className="mt-3 flex flex-col gap-2 rounded-xl bg-secondary/50 p-3 sm:flex-row sm:items-center">
              <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
                政府合作單位
              </span>
              <span className="text-sm text-muted-foreground">林業署、五峰鄉公所、教育部等</span>
            </div>
          </SectionCard>

          {/* 02 竹林資源經營 */}
          <SectionCard number="02" title="竹林資源經營">
            <div className="grid grid-cols-3 gap-2">
              <StatItem icon={Sprout} value="12" unit="公頃" label="竹林經營面積" />
              <StatItem icon={Layers} value="1,701" unit="支" label="林業署支持竹材" />
              <StatItem icon={Boxes} value="約 13" unit="公噸" label="竹材重量" />
              <StatItem icon={Drone} value="1" unit="次" label="竹林碳匯空拍調查" />
              <StatItem icon={MapPin} value="7,526" unit="m²+" label="無人機調查面積" />
              <StatItem icon={HardHat} value="6" unit="人" label="竹林疏伐工班" />
            </div>
          </SectionCard>
        </div>

        {/* Row: 03 + 04 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 03 人才培育 */}
          <SectionCard number="03" title="人才培育">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              <StatItem icon={Award} value="4" unit="位" label="取得專業證照族人" />
              <StatItem icon={PresentationIcon} value="20+" unit="場" label="竹產業培訓課程" />
              <StatItem icon={GraduationCap} value="200+" unit="人" label="參與學生人數" sublabel="200 人以上" />
              <StatItem icon={Users} value="持續" label="推動原住民專班參與" />
              <StatItem icon={UserCheck} value="10+" unit="位" label="青年返鄉參與" />
              <StatItem icon={Home} value="10+" unit="位" label="工藝師參與" />
            </div>
          </SectionCard>

          {/* 04 文化傳承 */}
          <SectionCard number="04" title="文化傳承">
            <div className="grid grid-cols-3 gap-2">
              <StatItem icon={Search} value="3" unit="場" label="竹文化田野調查" />
              <StatItem icon={MessageSquare} value="40+" unit="人次" label="部落訪談調查" />
              <StatItem icon={Home} value="1" unit="式" label="竹構文化調查完成" />
              <StatItem icon={BookOpen} value="持續" label="建置祭儀文化紀錄" />
              <StatItem icon={PlayCircle} value="開發中" label="竹文化教材" sublabel="多媒體教材開發中" />
              <StatItem icon={BookMarked} value="3" unit="門課程" label="竹知識課程" sublabel="3 門課程（6 學分）" />
            </div>
          </SectionCard>
        </div>

        {/* Row: 05 + 06 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 05 產業發展 */}
          <SectionCard number="05" title="產業發展">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              <StatItem icon={Home} value="1" unit="套" label="竹滬設備" sublabel="1 套完成" />
              <StatItem icon={Boxes} value="持續開發" label="竹炭產品研發持續開發" />
              <StatItem icon={Droplet} value="持續開發" label="竹醋液商品持續開發" />
              <StatItem icon={ShoppingBasket} value="多項" label="竹工藝商品多項" />
              <StatItem icon={Users} value="20+" unit="場" label="文化體驗活動" sublabel="20 場以上" />
              <StatItem icon={RefreshCw} value="串聯建構" label="一、二、三級產業串聯" />
            </div>
          </SectionCard>

          {/* 06 社會影響力 */}
          <SectionCard number="06" title="社會影響力">
            <div className="grid grid-cols-3 gap-2">
              <StatItem icon={Users} value="500+" unit="人次" label="部落參與人次" sublabel="500 人次以上" />
              <StatItem icon={GraduationCap} value="200+" unit="人次" label="大學參與人次" sublabel="200 人次以上" />
              <StatItem icon={UserCheck} value="20+" unit="人次" label="教師參與人次" sublabel="20 人次以上" />
              <StatItem icon={Briefcase} value="持續增加" label="部落工作機會" />
              <StatItem icon={UserPlus} value="持續增加" label="青年返鄉案例" />
              <StatItem icon={BookOpen} value="同步推展" label="文化教育推廣" sublabel="校內外同步推展" />
            </div>
          </SectionCard>
        </div>

        {/* 07 國際交流 */}
        <SectionCard number="07" title="國際交流">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              <StatItem icon={Plane} value="2" unit="次" label="日本交流次數" />
              <StatItem icon={FileText} value="1" unit="式" label="國際合作備忘錄" />
              <StatItem icon={Handshake} value="已建立" label="日本龜岡市合作" />
              <StatItem icon={Sprout} value="2026" label="綠化博覽會確定參展" />
              <StatItem icon={ImageIcon} value="3" unit="組 5 件" label="國際作品組數" sublabel="3 組 5 件" />
            </div>
            <div className="rounded-xl bg-secondary/50 p-4 lg:w-56">
              <h3 className="mb-3 text-sm font-semibold text-foreground">日本團隊參與</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  ["策展設計師", "1 位"],
                  ["結構工程師", "1 位"],
                  ["工藝師", "6 位"],
                  ["行政人員", "2 位"],
                ].map(([role, count]) => (
                  <li key={role} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary/60" aria-hidden="true" />
                      {role}
                    </span>
                    <span className="font-medium text-foreground">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* 08 ESG */}
        <EsgSection />

        <footer className="pt-2 text-center text-sm tracking-widest text-muted-foreground">
          以竹為本 · 文化為魂 · 產業為力 · 永續共榮
        </footer>
      </div>
    </main>
  )
}
