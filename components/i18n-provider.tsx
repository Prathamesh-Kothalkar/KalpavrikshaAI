"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Dict = Record<string, any>

// Helper to get nested key: "a.b.c"
function get(obj: Dict, path: string) {
  return path.split(".").reduce((acc: any, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

export const supportedLanguages: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "gu", label: "ગુજરાતી (Gujarati)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "or", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "as", label: "অসমীয়া (Assamese)" },
  { code: "ur", label: "اردو (Urdu)" },
]

// Minimal, extendable dictionaries. Missing keys gracefully fall back to English.
const en: Dict = {
  appName: "KalpavrikshaAI",
  nav: {
    home: "Home",
    artisans: "For Artisans",
    buyers: "For Buyers",
    about: "About",
    upload: "Upload Product",
    explore: "Explore Crafts",
  },
  hero: {
    title: "Empowering Indian Artisans with AI",
    desc: "KalpavrikshaAI is an AI-powered marketplace helping artisans showcase crafts, tell authentic stories, and reach buyers worldwide — in their own voice.",
    uploadCta: "Upload Product",
    exploreCta: "Explore Crafts",
  },
  featured: { title: "Featured Artisans & Products", aiTag: "AI mockup" },
  features: {
    navkalpana: {
      title: "NavKalpana",
      desc: "AI-powered mockups and merchandising ideas tailored to your craft and region.",
    },
    voice: {
      title: "Voice-First",
      desc: "Describe your product in your own language—voice input generates descriptions and tags.",
    },
    kathakar: {
      title: "Kathakar Storytelling",
      desc: "Turn craft histories into scannable stories with QR codes for buyers.",
    },
  },
  buyers: {
    region: "Region",
    artform: "Artform",
    allRegions: "All Regions",
    allArtforms: "All Artforms",
    viewStory: "View Story (QR)",
  },
}

const hi: Dict = {
  appName: "कल्पवृक्षAI",
  nav: {
    home: "मुखपृष्ठ",
    artisans: "कारीगरों के लिए",
    buyers: "खरीदारों के लिए",
    about: "परिचय",
    upload: "उत्पाद अपलोड करें",
    explore: "हस्तशिल्प देखें",
  },
  hero: {
    title: "भारतीय कारीगरों को AI से सशक्त बनाना",
    desc: "कल्पवृक्षAI एक AI-सक्षम मार्केटप्लेस है जो कारीगरों को अपने शिल्प दिखाने, असली कहानियाँ बताने और अपनी भाषा में दुनिया भर के खरीदारों तक पहुँचने में मदद करता है।",
    uploadCta: "उत्पाद अपलोड करें",
    exploreCta: "हस्तशिल्प देखें",
  },
  featured: { title: "विशेष कारीगर और उत्पाद", aiTag: "AI मॉकअप" },
  features: {
    navkalpana: { title: "नवकल्पना", desc: "आपके शिल्प और क्षेत्र के अनुसार AI से बने मॉकअप और मर्चेंडाइजिंग विचार।" },
    voice: { title: "आवाज़-प्रथम", desc: "अपनी भाषा में बोलकर उत्पाद बताइए—AI विवरण और टैग बनाता है।" },
    kathakar: { title: "कथाकर स्टोरीटेलिंग", desc: "कला की कहानियों को QR कोड के साथ खरीदारों के लिए स्कैन योग्य बनाइए।" },
  },
  buyers: {
    region: "क्षेत्र",
    artform: "कलारूप",
    allRegions: "सभी क्षेत्र",
    allArtforms: "सभी कलारूप",
    viewStory: "कहानी देखें (QR)",
  },
}

const bn: Dict = {
  appName: "कल्पবৃক্ষAI",
  nav: {
    home: "হোম",
    artisans: "কারিগরদের জন্য",
    buyers: "ক্রেতাদের জন্য",
    about: "সম্বন্ধে",
    upload: "পণ্য আপলোড করুন",
    explore: "হস্তশিল্প দেখুন",
  },
  hero: {
    title: "ভারতের কারিগরদের AI দিয়ে ক্ষমতায়ন",
    desc: "कल्पবৃক্ষAI হলো একটি AI-চালিত মার্কেটপ্লেস যা কারিগরদের তাদের শিল্প প্রদর্শন, প্রকৃত গল্প বলা এবং নিজের ভাষায় বিশ্বব্যাপী ক্রেতাদের কাছে পৌঁছাতে সাহায্য করে।",
    uploadCta: "পণ্য আপলোড করুন",
    exploreCta: "হস্তশিল্প দেখুন",
  },
  featured: { title: "নির্বাচিত কারিগর ও পণ্য", aiTag: "AI মকআপ" },
  features: {
    navkalpana: { title: "নবকল্পনা", desc: "আপনার শিল্প ও অঞ্চলের জন্য উপযুক্ত AI-মকআপ ও মার্চেন্ডাইজিং আইডিয়া।" },
    voice: { title: "ভয়েস-ফার্স্ট", desc: "নিজের ভাষায় বোলে পণ্য বর্ণনা করুন—AI বিবরণ ও ট্যাগ তৈরি করে।" },
    kathakar: { title: "কথাকার গল্প", desc: "শিল্পের ইতিহাসকে QR কোডের মাধ্যমে স্ক্যানযোগ্য গল্পে রূপান্তরিত করুন।" },
  },
  buyers: {
    region: "অঞ্চল",
    artform: "শিল্পধারা",
    allRegions: "সকল অঞ্চল",
    allArtforms: "সব ধারা",
    viewStory: "গল্প দেখুন (QR)",
  },
}

// For brevity, other languages reuse hi for core strings. You can refine later.
const ta = hi,
  te = hi,
  mr = hi,
  gu = hi,
  kn = hi,
  ml = hi,
  pa = hi,
  or_ = hi,
  as_ = hi,
  ur = hi

const dictionaries: Record<string, Dict> = {
  en,
  hi,
  bn,
  ta,
  te,
  mr,
  gu,
  kn,
  ml,
  pa,
  or: or_,
  as: as_,
  ur,
}

type I18nContextValue = {
  locale: string
  setLocale: (code: string) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>("en")

  useEffect(() => {
    // load from storage or browser
    const stored = typeof window !== "undefined" ? localStorage.getItem("kalpa_locale") : null
    const nav = typeof window !== "undefined" ? navigator.language?.slice(0, 2) : "en"
    const initial = stored || (dictionaries[nav] ? nav : "en")
    setLocaleState(initial)
  }, [])

  function setLocale(code: string) {
    setLocaleState(code)
    if (typeof window !== "undefined") localStorage.setItem("kalpa_locale", code)
  }

  const value = useMemo<I18nContextValue>(() => {
    function t(key: string) {
      const d = dictionaries[locale] || en
      const v = get(d, key)
      if (v !== undefined) return v
      const fallback = get(en, key)
      return fallback !== undefined ? fallback : key
    }
    return { locale, setLocale, t }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
