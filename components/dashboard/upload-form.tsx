"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, UploadCloud, Loader2 } from "lucide-react";
import axios from "axios";

type Props = {
  onDescribe: (text: string) => void;
  onImage: (files: File[]) => void;
  onAiImages: (urls: string[]) => void;
  onAiVideos: (urls: string[]) => void;
};

export default function UploadForm({
  onDescribe,
  onImage,
  onAiImages,
  onAiVideos,
}: Props) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  /** Handle file picker */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    onImage(files);
  }

  /** Voice input */
  function startVoice() {
    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SR) return alert("Voice input is not supported in this browser.");

    const recog = new SR();
    recog.lang = "en-IN";
    recog.continuous = true;
    recog.interimResults = false;

    recog.onresult = (ev: SpeechRecognitionEvent) => {
      const t = ev.results[ev.results.length - 1][0].transcript;
      setDesc((prev) => (prev ? prev + " " : "") + t);
    };
    recog.onend = () => setRecording(false);

    recognitionRef.current = recog;
    setRecording(true);
    recog.start();
  }
  function stopVoice() {
    recognitionRef.current?.stop();
    setRecording(false);
  }


  async function pollVideo(
    operationName: string,
    interval = 5000,  
    timeout = 240000   
  ): Promise<string> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const res = await fetch("/api/artisans/fetch-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationName }),
      });
      const data = await res.json();
      if (res.ok && data.fileUrl) return data.fileUrl;
      await new Promise((r) => setTimeout(r, interval));
    }
    throw new Error("Video generation timed out after 3 minutes");
  }

  /** Main flow */
  async function handleUseText() {
    const text = desc.trim();
    if (!text) return alert("Please provide a description.");
    const files = inputRef.current?.files;
    if (!files || files.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Upload to AI image endpoint
      const fd = new FormData();
      fd.append("description", text);
      Array.from(files).forEach((f) => fd.append("file", f));

      const imgRes = await axios.post("/api/artisans/upload/imgai", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const images: string[] = imgRes.data?.images || [];
      if (!images.length) throw new Error("No images returned");
      setPreviewImages(images);
      onAiImages(images);

      // 2️⃣ Take first image → fetch blob → send to /ads for video
      const firstUrl = images[0];
      const blob = await fetch(firstUrl).then((r) => r.blob());

      const adsFd = new FormData();
      adsFd.append("description", text);
      adsFd.append("file", blob, "ai-image.jpg");

      const adsRes = await axios.post("/api/artisans/ads", adsFd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const opName =
        adsRes.data?.operationName || adsRes.data?.name || null;
      if (!opName) throw new Error("Missing operationName from /ads");

      // 3️⃣ Poll for video
      const videoUrl = await pollVideo(opName);
      setPreviewVideos([videoUrl]); // can support multiple if backend returns more
      onAiVideos([videoUrl]);

      onDescribe(text);
      setDesc(""); // clear description
    } catch (err) {
      console.error("Error generating:", err);
      alert("Failed to generate AI suggestions. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
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
          Describe your product (or use voice)
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
              <Square className="h-4 w-4" /> Stop
            </Button>
          )}

          <Button
            onClick={handleUseText}
            disabled={loading}
            className="gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate AI Suggestions"}
          </Button>
        </div>
      </div>

      {/* Preview AI Images */}
      {previewImages.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">AI Generated Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {previewImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`AI Image ${i + 1}`}
                className="w-full h-auto rounded border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Preview AI Videos */}
      {previewVideos.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">AI Generated Videos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {previewVideos.map((url, i) => (
              <video
                key={i}
                src={url}
                controls
                className="w-full h-auto rounded border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
