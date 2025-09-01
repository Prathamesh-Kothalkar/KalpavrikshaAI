"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UploadForm from "@/components/dashboard/upload-form"
import AISuggestions from "@/components/dashboard/ai-suggestions"
import Storyteller from "@/components/dashboard/storyteller"

export default function ArtisanDashboard() {
  const [desc, setDesc] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const imageUrl = useMemo(() => (image ? URL.createObjectURL(image) : undefined), [image])

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Artisan Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadForm onDescribe={setDesc} onImage={setImage} />
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Uploaded product preview"
                className="h-40 w-full rounded-lg object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AISuggestions description={desc} imageUrl={imageUrl} />

      <Storyteller description={desc} />
    </div>
  )
}
