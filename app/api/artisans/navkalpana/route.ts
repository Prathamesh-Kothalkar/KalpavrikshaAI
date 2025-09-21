export const runtime = "nodejs";
import { GoogleAuth } from "google-auth-library";
import { Buffer } from "buffer";
import fs from "fs";
import path from "path";

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_REGION;
const IMAGE_COUNT = 1;
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
        const description = formData.get("description");

        if (!file || !file.type.startsWith("image/")) {
            return new Response(JSON.stringify({ error: "Uploaded file is not an image" }), { status: 400 });
        }

        // Convert uploaded image to base64
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

        if (!predictions.length || !predictions[0].bytesBase64Encoded) {
            return new Response(JSON.stringify({ error: "No images returned" }), { status: 500 });
        }

        // Decode the generated image
        const imgBase64 = predictions[0].bytesBase64Encoded;
        const imgBuffer = Buffer.from(imgBase64, "base64");

        // Create folder if it doesn't exist
        const folderPath = path.join(process.cwd(), "public", "ai-images");
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        // Save image with unique filename
        const fileName = `ai-${Date.now()}.png`;
        const filePath = path.join(folderPath, fileName);
        fs.writeFileSync(filePath, imgBuffer);

        // Return the URL
        const fileUrl = `/ai-images/${fileName}`;
        return new Response(JSON.stringify({ url: fileUrl }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
