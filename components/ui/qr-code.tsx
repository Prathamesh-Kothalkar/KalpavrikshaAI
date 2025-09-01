"use client"
import { QRCodeSVG } from "qrcode.react"

export function QRCode({ value, size = 128 }: { value: string; size?: number }) {
  return (
    <div aria-label="QR code" className="inline-block rounded-lg border border-border bg-card p-2">
      <QRCodeSVG value={value} size={size} fgColor="var(--kalpa-charcoal)" bgColor="transparent" />
    </div>
  )
}
