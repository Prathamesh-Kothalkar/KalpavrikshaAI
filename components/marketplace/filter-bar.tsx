"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/components/i18n-provider"

type Props = {
  region: string
  art: string
  onChange: (next: { region: string; art: string }) => void
}

const regions = ["All Regions", "Bihar", "Rajasthan", "Karnataka", "Gujarat", "Odisha"]
const arts = ["All Artforms", "Folk Art", "Ceramics", "Woodcraft", "Textiles", "Metalwork"]

export default function FilterBar({ region, art, onChange }: Props) {
  const { t } = useI18n()
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium">{t("buyers.region")}</label>
        <Select value={region} onValueChange={(v) => onChange({ region: v, art })}>
          <SelectTrigger>
            <SelectValue placeholder={t("buyers.region")} />
          </SelectTrigger>
          <SelectContent>
            {regions.map((r) => (
              <SelectItem key={r} value={r}>
                {r === "All Regions" ? t("buyers.allRegions") : r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">{t("buyers.artform")}</label>
        <Select value={art} onValueChange={(v) => onChange({ region, art: v })}>
          <SelectTrigger>
            <SelectValue placeholder={t("buyers.artform")} />
          </SelectTrigger>
          <SelectContent>
            {arts.map((a) => (
              <SelectItem key={a} value={a}>
                {a === "All Artforms" ? t("buyers.allArtforms") : a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
