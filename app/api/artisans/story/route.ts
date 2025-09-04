import { NextResponse } from "next/server";
import { vertexAI } from "@/lib/google/vertex";

export const dynamic = "force-dynamic";


const generativeModel = vertexAI.getGenerativeModel({
  model: "imagen-4.0-generate-001",
});

export async function GET() {
  try {
    const prompt =
      "A photorealistic image of a traditional Kolhapuri chappal sitting on a clean, white marble surface, with soft studio lighting.";

    const result = await generativeModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // Extract the base64 image data from the response
    const base64ImageData =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64ImageData) {
      throw new Error("No image data received from Gemini 2.5 Flash Image Preview.");
    }

    console.log("Successfully received image data from Gemini 2.5 Flash Image Preview.");

    return NextResponse.json({
      message: "Successfully generated image.",
      imageData: base64ImageData,
    });
  } catch (error) {
    console.error("Error connecting to Gemini 2.5 Flash Image Preview:", error);
    return new NextResponse("Internal Server Error: Failed to generate image.", {
      status: 500,
    });
  }
}
