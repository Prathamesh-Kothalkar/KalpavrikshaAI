// import { NextResponse } from "next/server";
// import { vertexAI } from "@/lib/google/vertex";

// export const dynamic = "force-dynamic";

// const generativeModel = vertexAI.getGenerativeModel({
//   model: "imagen-4.0-generate-001", // Imagen 4.0
// });

// export async function GET() {
//   try {
//     const prompt =
//       "A photorealistic image of a traditional Kolhapuri chappal sitting on a clean, white marble surface, with soft studio lighting.";

//     // Call Imagen with prompt
//     const result = await generativeModel.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//     });

//     // Extract base64 image
//     const base64ImageData =
//       result.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

//     if (!base64ImageData) {
//       throw new Error("No image data received from Imagen 4.0.");
//     }

//     console.log("✅ Successfully received image data from Imagen 4.0");

//     return NextResponse.json({
//       message: "Successfully generated image.",
//       imageData: base64ImageData,
//     });
//   } catch (error: any) {
//     console.error("Error generating image with Imagen:", error);
//     return new NextResponse(
//       `Internal Server Error: Failed to generate image. ${error.message || ""}`,
//       { status: 500 }
//     );
//   }
// }
