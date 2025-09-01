"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"

export default function Hero() {
  const { t } = useI18n()
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start gap-6 py-8 md:py-12">
      <h1 className="text-pretty font-serif text-3xl leading-tight md:text-5xl">{t("hero.title")}</h1>
      <p className="max-w-2xl text-balance text-base leading-relaxed md:text-lg">{t("hero.desc")}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/artisans">
          <Button size="lg" className="bg-brand text-primary-foreground hover:opacity-90 rounded-full">
            {t("hero.uploadCta")}
          </Button>
        </Link>
        <Link href="/buyers">
          <Button
            size="lg"
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-full bg-transparent"
          >
            {t("hero.exploreCta")}
          </Button>
        </Link>
      </div>
    </section>
  )
}
