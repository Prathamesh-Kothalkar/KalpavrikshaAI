"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UploadForm from "@/components/dashboard/upload-form"
import AISuggestions from "@/components/dashboard/ai-suggestions"

export default function ArtisanDashboard() {
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [aiImages, setAiImages] = useState<string[]>([
    "https://placehold.co/600x400.png",
    "https://placehold.co/600x400/FF0000/FFF.png",
    "https://placehold.co/600x400/0000FF/FFF.png",
  ])
  const [aiVideos, setAiVideos] = useState<string[]>([]) // <-- initially empty

  const imageUrls = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  )

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="font-serif text-3xl font-bold">
        Artisan Co-pilot Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">1. Upload Your Craft</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadForm
              onDescribe={setDescription}
              onImage={setImages}
              onAiImages={setAiImages}        // AI images from API
              onAiVideos={setAiVideos}        // AI videos from API
            />

            {imageUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Image Previews
                </h3>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Uploaded preview ${idx + 1}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions Section */}
        <AISuggestions
          description={description}
          images={aiImages}
          videos={aiVideos}   // updated dynamically
        />
      </div>
    </div>
  )
}
