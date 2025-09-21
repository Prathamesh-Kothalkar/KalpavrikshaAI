export const runtime = "nodejs"; // Must be at the top
import { GoogleAuth } from "google-auth-library";
import { Buffer } from "buffer";
import { writeFileSync } from "fs";
import path from "path";

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_REGION;
const FIXED_PROMPT =
  "Take the provided product object from image and place the product on a clean, pure white studio background with realistic, bright, and even lighting. Ensure the product is sharply in focus, well-exposed, and free of distracting elements, optimizing it for e-commerce platforms.";
const IMAGE_COUNT = 3; // Generate 3 images
const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-capability-001:predict`;

async function getBearerToken() {
  const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!b64) throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_JSON");
  const json = Buffer.from(b64, "base64").toString("utf8");
  const credentials = JSON.parse(json);

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !file.type.startsWith("image/")) {
      return new Response(JSON.stringify({ error: "Uploaded file is not an image" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Img = Buffer.from(arrayBuffer).toString("base64");

    const body = {
      instances: [
        {
          prompt: FIXED_PROMPT,
          referenceImages: [
            {
              referenceType: "REFERENCE_TYPE_RAW",
              referenceId: 1,
              referenceImage: { bytesBase64Encoded: base64Img },
            },
          ],
        },
      ],
      parameters: { sampleCount: IMAGE_COUNT },
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

    const data = await resp.json();
    const predictions = data.predictions || [];

    if (!predictions.length) {
      return new Response(JSON.stringify({ error: "No images returned" }), { status: 500 });
    }

    // Store images locally and collect their paths
    const savedImageUrls = [];

    predictions.forEach((pred, index) => {
      const imgBase64 = pred.bytesBase64Encoded;
      const imgBuffer = Buffer.from(imgBase64, "base64");

      const filename = `image_${Date.now()}_${index + 1}.png`; // unique filename
      const filePath = path.join(process.cwd(), "public", filename);

      writeFileSync(filePath, imgBuffer);
      savedImageUrls.push(`/${filename}`); // URL accessible from frontend
    });

    return new Response(JSON.stringify({ images: savedImageUrls }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
