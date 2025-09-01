"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import LanguageSwitcher from "@/components/language-switcher"

export default function Navbar() {
  const { t } = useI18n()
  return (
    <header className="w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="KalpavrikshaAI Home">
          <div className="h-6 w-6 rounded bg-brand" aria-hidden />
          <span className="font-serif text-lg font-bold tracking-tight">{t("appName")}</span>
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/" className="text-sm hover:text-brand">
            {t("nav.home")}
          </Link>
          <Link href="/artisans" className="text-sm hover:text-brand">
            {t("nav.artisans")}
          </Link>
          <Link href="/buyers" className="text-sm hover:text-brand">
            {t("nav.buyers")}
          </Link>
          <Link href="/about" className="text-sm hover:text-brand">
            {t("nav.about")}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/artisans">
            <Button className="bg-brand text-primary-foreground hover:opacity-90">{t("nav.upload")}</Button>
          </Link>
          <Link href="/buyers">
            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              {t("nav.explore")}
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
