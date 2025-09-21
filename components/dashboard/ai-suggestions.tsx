"use client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play } from "lucide-react"
import Image from "next/image" // Ensure Image is imported

type Props = {
  description: string;
  imageUrl?: string;
  videos: string[]; // New prop for video URLs
  images: string[]; // New prop for image URLs
}

export default function AISuggestions({ description, imageUrl, videos, images }: Props) {
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
          <CardTitle className="text-lg">AI Image Mockups</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {images.length > 0 ? (
            images.map((imgSrc, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg border">
                <div className="absolute left-2 top-2 z-10 rounded bg-brand px-2 py-0.5 text-xs text-primary-foreground">
                  AI mockup
                </div>
                <Image
                  src={imgSrc}
                  alt={`AI Image Mockup ${index + 1}`}
                  width={640}
                  height={360}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs opacity-70">Image Type: {index === 0 ? "Lifestyle Shot" : index === 1 ? "On-location" : "Product Focus"}</div>
                </div>
              </div>
            ))
          ) : (
            // Fallback for when no images are provided
            ["Lifestyle Shot", "On-location", "Product Focus"].map((type, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg border">
                <div className="absolute left-2 top-2 z-10 rounded bg-brand px-2 py-0.5 text-xs text-primary-foreground">
                  AI mockup
                </div>
                <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground relative">
                  <span className="text-sm opacity-50">{type} Mockup</span>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs opacity-70">Image Type: {type}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">AI Video Mockups</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {videos.length > 0 ? (
            videos.map((videoSrc, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg border">
                <div className="absolute left-2 top-2 z-10 rounded bg-brand px-2 py-0.5 text-xs text-primary-foreground">
                  AI mockup
                </div>
                <video
                  src={videoSrc}
                  controls
                  className="h-40 w-full object-cover bg-black"
                // You might want to add poster, muted, loop for better display in a mockup context
                >
                  Your browser does not support the video tag.
                </video>
                <div className="p-3">
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs opacity-70">Video Type: {index === 0 ? "Story Ad" : index === 1 ? "Reel/Short" : "Product Highlight"}</div>
                </div>
              </div>
            ))
          ) : (
            // Fallback for when no videos are provided
            ["Story Ad", "Reel/Short", "Product Highlight"].map((type, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg border">
                <div className="absolute left-2 top-2 z-10 rounded bg-brand px-2 py-0.5 text-xs text-primary-foreground">
                  AI mockup
                </div>
                <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground relative">
                  <Play className="h-12 w-12 opacity-50" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs opacity-70">Video Type: {type}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}