export const runtime = "nodejs";

import { writeFileSync } from "fs";
import path from "path";
import { GoogleAuth } from "google-auth-library";

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_REGION;
const MODEL_ID = "veo-3.0-fast-generate-preview";

const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:fetchPredictOperation`;

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
        const { operationName } = await req.json();
        if (!operationName) {
            return new Response(
                JSON.stringify({ error: "operationName is required" }),
                { status: 400 }
            );
        }

        const token = await getBearerToken();
        const resp = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ operationName }),
        });

        if (!resp.ok) {
            const error = await resp.text();
            return new Response(JSON.stringify({ error }), { status: resp.status });
        }

        const data = await resp.json();
        console.log("Fetch video response:", data);

        if (!data.response?.videos?.length) {
            return new Response(
                JSON.stringify({ error: "No videos found in response" }),
                { status: 404 }
            );
        }

        const base64 = data.response.videos[0].bytesBase64Encoded;
        if (!base64) {
            return new Response(
                JSON.stringify({ error: "Video bytes missing" }),
                { status: 400 }
            );
        }

        const buffer = Buffer.from(base64, "base64");

        // Extract operation ID from operationName
        const operationId = operationName.split("/").pop(); // gets last part
        const filePath = path.join(process.cwd(), "public", `${operationId}.mp4`);
        writeFileSync(filePath, buffer);

        return new Response(
            JSON.stringify({
                message: "Video saved successfully",
                fileUrl: `/${operationId}.mp4`,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error("API error:", err);
        return new Response(
            JSON.stringify({ error: "Internal Server Error", details: err.message }),
            { status: 500 }
        );
    }
}
