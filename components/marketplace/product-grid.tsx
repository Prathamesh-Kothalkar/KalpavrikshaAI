"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"

type Product = {
  id: string
  title: string
  artisan: string
  region: string
  art: string
  img: string
}

const allProducts: Product[] = [
  {
    id: "madhubani-1",
    title: "Madhubani Peacock",
    artisan: "Anita Devi",
    region: "Bihar",
    art: "Folk Art",
    img: "/madhubani-peacock.png",
  },
  {
    id: "blue-pottery-1",
    title: "Blue Pottery Bowl",
    artisan: "Farid",
    region: "Rajasthan",
    art: "Ceramics",
    img: "/blue-pottery-bowl.png",
  },
  {
    id: "toy-1",
    title: "Channapatna Car",
    artisan: "Suresh",
    region: "Karnataka",
    art: "Woodcraft",
    img: "/wooden-toy-car.png",
  },
]

export default function ProductGrid({ region, art }: { region: string; art: string }) {
  const { t } = useI18n()
  const filtered = allProducts.filter((p) => {
    const rOk = region === "All Regions" || p.region === region
    const aOk = art === "All Artforms" || p.art === art
    return rOk && aOk
  })

  return (
    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
      {filtered.map((p) => (
        <Card key={p.id} className="overflow-hidden rounded-xl border">
          <Image
            src={p.img || "/placeholder.svg"}
            alt={`${p.title} by ${p.artisan}`}
            width={720}
            height={480}
            className="h-44 w-full object-cover"
          />
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{p.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm">
            <span className="opacity-80">{p.artisan}</span>
            <Link href={`/story/${p.id}`} className="text-secondary underline underline-offset-2">
              {t("buyers.viewStory")}
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
