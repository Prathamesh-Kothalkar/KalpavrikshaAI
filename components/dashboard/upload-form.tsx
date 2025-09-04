"use client"

import { useRef, useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Square, UploadCloud } from "lucide-react"
import type { SpeechRecognition, SpeechRecognitionEvent } from "web-speech-api"
import axios from "axios"

// CHANGED: The onImage prop now accepts an array of Files
type Props = {
  onDescribe: (text: string) => void
  onImage: (files: File[]) => void
}

export default function UploadForm({ onDescribe, onImage }: Props) {
  const [recording, setRecording] = useState(false)
  const [desc, setDesc] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : []
    onImage(files)
  }

 async function handleUseText() {
  const text = desc.trim()
  if (!text) return

  const files = inputRef.current?.files
  if (!files || files.length === 0) {
    alert("Please upload at least one image.")
    return
  }

  const formData = new FormData()
  formData.append("description", text)
  Array.from(files).forEach((file) => {
    formData.append("images", file) // backend expects "images"
  })

  try {
    const { data } = await axios.post("/api/artisans/upload/imgai", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    console.log("Edited Images:", data)
    onDescribe(text)
    // you can pass edited image URLs back into UI here
  } catch (err) {
    console.error("Error generating:", err)
    alert("Failed to generate AI suggestions.")
  }
}


  function startVoice() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
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

  return (
    <div className="space-y-4">
     
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        multiple 
      />
     
      <Button variant="outline" onClick={() => inputRef.current?.click()} className="w-full gap-2">
        <UploadCloud className="h-4 w-4" /> Choose Images
      </Button>

      <div className="space-y-2">
        <label className="text-sm font-medium">Describe your product (or use your voice)</label>
        <Textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g., Hand-painted Madhubani artwork from Bihar using natural dyes on handmade paper..."
          className="min-h-28"
        />
        <div className="flex flex-wrap items-center gap-2">
          {!recording ? (
            <Button variant="outline" onClick={startVoice} className="gap-2">
              <Mic className="h-4 w-4" /> Record Voice
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={stopVoice}
              className="gap-2"
            >
              <Square className="h-4 w-4" /> Stop Recording
            </Button>
          )}
          <Button onClick={handleUseText}>
            Generate AI Suggestions
          </Button>
        </div>
      </div>
    </div>
  )
}
