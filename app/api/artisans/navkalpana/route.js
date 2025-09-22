export const runtime = "nodejs";

import { GoogleAuth } from "google-auth-library";
import { Buffer } from "buffer";
import { Storage } from "@google-cloud/storage";

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_REGION;
const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const IMAGE_COUNT = 1;

const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-capability-001:predict`;

// ---- Initialize GCP Storage ----
const storage = new Storage({
    credentials: JSON.parse(
        Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, "base64").toString("utf8")
    ),
});

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
            return new Response(JSON.stringify({ error: "Uploaded file is not an image" }), {
                status: 400,
            });
        }

        // Convert upload → Base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Img = buffer.toString("base64");

        // ---- Build AI prompt ----
        const prompt = `You are a creative product-design AI helping Indian artisans modernize their crafts.
Your task is called “Navkalpna” – re-imagining traditional products so they appeal to Gen-Z and digital-first audiences while respecting the craft’s roots.
Look at the product shown in the image and redesign the product itself (shape, material, finish, colors, patterns, small details) — not merely the background.
Keep its cultural essence while giving it a fresh, trendy look suitable for online retail.
Product description: ${description}`;

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

        // ---- Call Vertex AI ----
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
        if (!predictions.length || !predictions[0].bytesBase64Encoded) {
            return new Response(JSON.stringify({ error: "No images returned" }), { status: 500 });
        }

        // ---- Save AI image to GCS ----
        const imgBuffer = Buffer.from(predictions[0].bytesBase64Encoded, "base64");
        const fileName = `ai-${Date.now()}.png`;
        const gcsFile = storage.bucket(BUCKET_NAME).file(fileName);

        await gcsFile.save(imgBuffer, {
            contentType: "image/png",
            resumable: false,
        });

        // ---- Decide which URL to return ----
        // If bucket is public (has roles/storage.objectViewer for allUsers),
        // you can use the public URL directly:
        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;

        // If bucket is private, fall back to a signed URL:
        let finalUrl = publicUrl;
        try {
            // quick test: signed URL always works, even for public buckets
            const [signed] = await gcsFile.getSignedUrl({
                action: "read",
                expires: Date.now() + 60 * 60 * 1000, // 1 hour
            });
            finalUrl = signed;
        } catch (e) {
            // ignore if signed URL generation fails
        }

        return new Response(JSON.stringify({ url: finalUrl }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error generating AI image:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
