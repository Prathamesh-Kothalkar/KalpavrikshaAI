"use client"
import { useRef, useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Square } from "lucide-react"
import type { SpeechRecognition, SpeechRecognitionEvent } from "web-speech-api"

type Props = {
  onDescribe: (text: string) => void
  onImage: (file: File | null) => void
}

export default function UploadForm({ onDescribe, onImage }: Props) {
  const [recording, setRecording] = useState(false)
  const [desc, setDesc] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    onImage(file)
  }

  function handleUseText() {
    onDescribe(desc.trim())
  }

  function startVoice() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) return alert("Voice input is not supported in this browser.")
    const recog = new SR()
    recog.lang = "en-IN"
    recog.continuous = false
    recog.interimResults = false
    recog.onresult = (ev: SpeechRecognitionEvent) => {
      const t = ev.results[0][0].transcript
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
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload product image"
        />
        <Button variant="outline" onClick={() => inputRef.current?.click()} className="md:whitespace-nowrap">
          Choose Image
        </Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Describe your product</label>
        <Textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g., Hand-painted Madhubani artwork using natural dyes..."
          className="min-h-28"
        />
        <div className="flex items-center gap-2">
          {!recording ? (
            <Button variant="outline" onClick={startVoice} className="gap-2 bg-transparent">
              <Mic className="h-4 w-4" /> Record voice
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={stopVoice}
              className="gap-2 bg-accent text-accent-foreground hover:opacity-90"
            >
              <Square className="h-4 w-4" /> Stop
            </Button>
          )}
          <Button className="bg-brand text-primary-foreground hover:opacity-90" onClick={handleUseText}>
            Use this description
          </Button>
        </div>
      </div>
    </div>
  )
}
