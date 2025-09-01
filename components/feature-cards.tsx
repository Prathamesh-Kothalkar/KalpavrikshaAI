"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass, Mic, BookOpen } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"

export default function FeatureCards() {
  const { t } = useI18n()
  const features = [
    { icon: Compass, title: t("features.navkalpana.title"), desc: t("features.navkalpana.desc"), color: "text-indigo" },
    { icon: Mic, title: t("features.voice.title"), desc: t("features.voice.desc"), color: "text-brand" },
    { icon: BookOpen, title: t("features.kathakar.title"), desc: t("features.kathakar.desc"), color: "text-maroon" },
  ] as const

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="rounded-xl border border-border">
            <CardHeader>
              <div className={`mb-2 ${f.color}`}>
                <f.icon aria-hidden />
              </div>
              <CardTitle className="text-lg">{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">{f.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
