"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Square, UploadCloud, Loader2 } from "lucide-react"
import axios from "axios"

type Props = {
  onDescribe: (text: string) => void
  onImage: (files: File[]) => void
  onAiImages: (urls: string[]) => void
  onAiVideos: (urls: string[]) => void
}

export default function UploadForm({
  onDescribe,
  onImage,
  onAiImages,
  onAiVideos,
}: Props) {
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [desc, setDesc] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  /** Handle images selected from disk */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : []
    onImage(files)
  }

  /** Start browser SpeechRecognition */
  function startVoice() {
    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition
    if (!SR) return alert("Voice input is not supported in this browser.")
    const recog = new SR()

    recog.lang = "en-IN"
    recog.continuous = true
    recog.interimResults = false

    recog.onresult = (ev: SpeechRecognitionEvent) => {
      const t = ev.results[ev.results.length - 1][0].transcript
      setDesc((prev) => (prev ? prev + " " : "") + t)
    }

    recog.onend = () => setRecording(false)

    recognitionRef.current = recog
    setRecording(true)
    recog.start()
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  async function pollVideo(operationName: string, interval = 3000, timeout = 60000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const res = await fetch("/api/artisans/fetch-video", {
        method: "POST",
        body: JSON.stringify({ operationName }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok && data.fileUrl) return data.fileUrl; // video ready
      await new Promise((r) => setTimeout(r, interval)); // wait
    }

    throw new Error("Video generation timed out");
  }



  async function handleUseText() {
    const text = desc.trim()
    if (!text) return alert("Please provide a description.")

    const files = inputRef.current?.files
    if (!files || files.length === 0) {
      alert("Please upload at least one image.")
      return
    }

    const formData = new FormData()
    formData.append("description", text)
    Array.from(files).forEach((f) => formData.append("file", f))

    setLoading(true)
    try {

      const imgRes = await axios.post("/api/artisans/upload/imgai", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (imgRes.data?.images) onAiImages(imgRes.data.images)
      const adsRes = await axios.post("/api/artisans/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const opName = adsRes.data?.name || adsRes.data?.operationName
      if (!opName) throw new Error("Missing operationName from ads API")
      const videoUrl = await pollVideo(opName)
      onAiVideos([videoUrl, videoUrl, videoUrl])

      onDescribe(text)
    } catch (err) {
      console.error("Error generating:", err)
      alert("Failed to generate AI suggestions.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden input */}
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="w-full gap-2"
      >
        <UploadCloud className="h-4 w-4" /> Choose Images
      </Button>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Describe your product (or use your voice)
        </label>
        <Textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g., Hand-painted Madhubani artwork from Bihar..."
          className="min-h-28"
        />

        <div className="flex flex-wrap items-center gap-2">
          {!recording ? (
            <Button
              variant="outline"
              onClick={startVoice}
              disabled={loading}
              className="gap-2"
            >
              <Mic className="h-4 w-4" /> Record Voice
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={stopVoice}
              disabled={loading}
              className="gap-2"
            >
              <Square className="h-4 w-4" /> Stop Recording
            </Button>
          )}

          <Button onClick={handleUseText} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate AI Suggestions"}
          </Button>
        </div>
      </div>
    </div>
  )
}
