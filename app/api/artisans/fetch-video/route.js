export const runtime = "nodejs";

import { GoogleAuth } from "google-auth-library";

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_REGION;
const MODEL_ID = "veo-3.0-fast-generate-preview";
const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:fetchPredictOperation`;

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
        const { operationName } = await req.json();
        if (!operationName) {
            return new Response(JSON.stringify({ error: "operationName is required" }), { status: 400 });
        }

        const body = { operationName };

        const token = await getBearerToken();

        const resp = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!resp.ok) {
            const error = await resp.text();
            return new Response(JSON.stringify({ error }), { status: resp.status });
        }

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
