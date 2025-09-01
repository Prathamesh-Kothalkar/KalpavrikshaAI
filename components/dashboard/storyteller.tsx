"use client"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QRCode } from "@/components/ui/qr-code"

type Props = { basePath?: string; description: string }

export default function Storyteller({ basePath = "/story", description }: Props) {
  const [story, setStory] = useState("")
  const storyId = useMemo(() => {
    const slug = story
      ? story
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : "example"
    return slug || "example"
  }, [story])
  const storyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${basePath}/${storyId}`

  function generate() {
    const fallback =
      "This handcrafted piece reflects the artisan's heritage and the living traditions of India. Each detail is made with care and tells a story of community and craft."
    const t = description?.trim()
      ? `From village workshops to your home, this ${description.toLowerCase()} carries the warmth of handmade tradition. Crafted with patience and pride, it preserves the stories passed through generations.`
      : fallback
    setStory(t)
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_.6fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kathakar Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Your story will appear here. Click Generate to create a story from your description."
            className="min-h-40"
          />
          <Button className="bg-brand text-primary-foreground hover:opacity-90" onClick={generate}>
            Generate from description
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">QR Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <QRCode value={`${basePath}/${storyId}`} />
          <div className="text-center text-xs">
            Scan to view: <br />
            <span className="font-medium">{`/story/${storyId}`}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
