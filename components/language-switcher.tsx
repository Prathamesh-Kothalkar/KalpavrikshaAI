"use client"

import { useI18n, supportedLanguages } from "@/components/i18n-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  return (
    <div className="min-w-[180px]">
      <label className="sr-only" htmlFor="language">
        Select language
      </label>
      <Select value={locale} onValueChange={setLocale}>
        <SelectTrigger id="language" aria-label="Select language" className="h-9">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
