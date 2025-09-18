export const runtime = "nodejs"; // Required for Next.js API

import { GoogleAuth } from "google-auth-library";

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_REGION;
const MODEL_ID = "veo-3.0-fast-generate-preview";
const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predictLongRunning`;

// Get GCP Bearer Token
async function getBearerToken() {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const prompt = `Create a modern, premium advertisement video featuring this product. " +
      "Use clean backgrounds, vibrant lighting, smooth transitions, and trending design styles. " +
      "Make it attractive for Gen Z digital audiences and online marketplaces.`;
    if (!file) {
      return new Response(JSON.stringify({ error: "file is required" }), { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const base64Img = Buffer.from(arrayBuffer).toString("base64");
    const body = {
      instances: [
        {
          prompt: prompt,
          "image": {
            "bytesBase64Encoded": base64Img,
            "mimeType": file.type
          }
        },
      ],
      parameters: {
        aspectRatio: "16:9",
        sampleCount: 1,
        durationSeconds: "8",
        personGeneration: "allow_all",
        addWatermark: true,
        includeRaiReason: true,
        generateAudio: true,
        resolution: "720p",
      },
    };

    const token = await getBearerToken();

    const resp = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const error = await resp.text();
      return new Response(JSON.stringify({ error }), { status: resp.status });
    }

    // Returns operation name (long-running job ID)
    const data = await resp.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
