export const runtime = "nodejs";
import { GoogleAuth } from "google-auth-library";
import { Buffer } from "buffer";

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_REGION;
const IMAGE_COUNT = 1;
const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-capability-001:predict`;

async function getBearerToken() {
    const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const description = formData.get("description");

        if (!file || !file.type.startsWith("image/")) {
            return new Response(JSON.stringify({ error: "Uploaded file is not an image" }), { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Img = buffer.toString("base64");

        const prompt = `You are a creative product-design AI helping Indian artisans modernize their crafts. Your task is called “Navkalpna” – re-imagining traditional products so they appeal to Gen-Z and digital-first audiences while respecting the craft’s roots. Product description: ${description}`;

        const body = {
            instances: [
                {
                    prompt,
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
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
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

        const imgBase64 = predictions[0].bytesBase64Encoded;
        const imgBuffer = Buffer.from(imgBase64, "base64");

        return new Response(imgBuffer, {
            status: 200,
            headers: { "Content-Type": "image/png", "Content-Length": imgBuffer.length.toString() },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
