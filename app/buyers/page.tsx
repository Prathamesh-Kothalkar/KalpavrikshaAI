"use client"

import { useState } from "react"
import FilterBar from "@/components/marketplace/filter-bar"
import ProductGrid from "@/components/marketplace/product-grid"

export default function BuyersPage() {
  const [filters, setFilters] = useState({ region: "All Regions", art: "All Artforms" })

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Marketplace</h1>
      <FilterBar region={filters.region} art={filters.art} onChange={setFilters} />
      <ProductGrid region={filters.region} art={filters.art} />
      <div className="rounded-lg border p-4 text-sm">
        Tip: Scan a product’s QR code in-store to open the artisan’s story page here.
      </div>
    </div>
  )
}
