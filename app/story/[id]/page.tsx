type Props = { params: { id: string } }

export default function StoryPage({ params }: Props) {
  const id = decodeURIComponent(params.id)
  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-serif text-2xl">Artisan Story</h1>
      <p className="text-sm opacity-70">Story ID: {id}</p>
      <p className="leading-relaxed">
        This is a preview of the artisan’s story. In production, this page would render a rich narrative, images, and
        provenance details linked to the product QR code.
      </p>
      <p className="leading-relaxed">
        Buyers can discover techniques, materials, and community impact—helping them appreciate the craft and the
        artisan behind it.
      </p>
    </article>
  )
}
