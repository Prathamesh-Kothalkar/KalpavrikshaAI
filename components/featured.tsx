"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/components/i18n-provider"

const items = [
  { id: 1, name: "Madhubani Painting", artisan: "Anita Devi (Bihar)", src: "/madhubani-painting.png", tag: "Folk Art" },
  { id: 2, name: "Blue Pottery Vase", artisan: "Farid (Rajasthan)", src: "/blue-pottery.png", tag: "Ceramics" },
  { id: 3, name: "Channapatna Toy", artisan: "Suresh (Karnataka)", src: "/wooden-toy.png", tag: "Woodcraft" },
]

export default function Featured() {
  const { t } = useI18n()
  return (
    <section className="py-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-serif text-2xl">{t("featured.title")}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.id} className="overflow-hidden rounded-xl border border-border">
            <div className="relative">
              <Image
                src={it.src || "/placeholder.svg"}
                alt={`${it.name} by ${it.artisan}`}
                width={720}
                height={440}
                className="h-44 w-full object-cover"
              />
              <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-xs text-primary-foreground">
                {t("featured.aiTag")}
              </span>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{it.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <span className="opacity-80">{it.artisan}</span>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs">{it.tag}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
