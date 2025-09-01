"use client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

type Props = { description: string; imageUrl?: string }

export default function AISuggestions({ description, imageUrl }: Props) {
  const [title, setTitle] = useState("")

  useEffect(() => {
    const t = description.split(/[.,\n]/)[0]?.slice(0, 60) || "Handcrafted Product"
    setTitle(t)
  }, [description])

  const tags = useMemo(() => {
    const base = ["handmade", "artisan", "ethical", "fair trade", "craft"]
    if (/madhubani|mithila/i.test(description)) base.push("madhubani", "folk art", "bihar")
    if (/pottery|ceramic/i.test(description)) base.push("ceramic", "blue pottery", "rajasthan")
    if (/wood|toy/i.test(description)) base.push("wood", "lacquer", "karnataka")
    if (/natural dye|eco|organic/i.test(description)) base.push("natural dyes", "eco-friendly")
    return Array.from(new Set(base)).slice(0, 8)
  }, [description])

  const price = useMemo(() => {
    // naive pricing heuristic
    let base = 999
    if (/silk|gold|silver/i.test(description)) base += 1500
    if (/hand-painted|intricate|detailed/i.test(description)) base += 800
    if (/large|big|vase|wall/i.test(description)) base += 600
    return Math.round(base / 10) * 10
  }, [description])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SEO Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-border px-2 py-1 text-xs">
              {t}
            </span>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suggested Price</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">₹ {price}</CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Ad Mockups</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-lg border">
              <div className="absolute left-2 top-2 rounded bg-brand px-2 py-0.5 text-xs text-primary-foreground">
                AI mockup
              </div>
              <div className="aspect-video w-full bg-muted" />
              <div className="p-3">
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs opacity-70">Authentic • Handcrafted • India</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">NavKalpana Mockups</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              {imageUrl ? (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Uploaded product mockup"
                  width={640}
                  height={360}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-muted" />
              )}
              <div className="p-3 text-sm">Display idea #{i}: Shelf/Poster/Social</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
