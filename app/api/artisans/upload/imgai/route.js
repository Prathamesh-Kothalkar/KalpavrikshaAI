import { NextResponse } from "next/server"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req) {
  try {
    
    const formData = await req.formData()

    const description = formData.get("description")
    const images = formData.getAll("images")

   
    console.log("Description:", description)
    console.log("Uploaded files:", images.map((f) => f.name))

    // Actual Api gets here 
    // You would typically call your image editing AI service here
    // For demonstration, we'll just return the original images with a mock edited URL

    // --- Demo mocked response ---
    const demoEditedImages = images.map((file, idx) => ({
      originalName: file.name,
      editedUrl: `https://placehold.co/600x400?text=Edited+Image+${idx + 1}`,
    }))

    return NextResponse.json({
      success: true,
      description,
      count: images.length,
      editedImages: demoEditedImages,
    })
  } catch (err) {
    console.error("Error in /api/artisans/upload/imgai:", err)
    return NextResponse.json(
      { success: false, error: "Failed to process images" },
      { status: 500 }
    )
  }
}
