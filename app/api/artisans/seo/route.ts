// File: /app/api/artisans/seo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

const PROJECT_ID = process.env.GCP_PROJECT_ID!;
const LOCATION = process.env.GCP_REGION!;
const MODEL_ID = "gemini-2.0-flash";
const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

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

export async function POST(req: NextRequest) {
    try {
        const { description } = await req.json();
        if (!description) {
            return NextResponse.json({ error: "Product description is required" }, { status: 400 });
        }

        const token = await getBearerToken();

        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                instances: [
                    {
                        content: `Generate at least 5 SEO tags for Amazon to sell this product: ${description}`,
                    },
                ],
            }),
        });

        const data = await response.json();
        console.log("Full model response:", JSON.stringify(data, null, 2));


        // Extract the response text from the model output
        const seoTagsText = data.predictions?.[0]?.content || "";
        // Split by commas, newlines, or semicolons, and remove empty items
        const seoTags = seoTagsText
            .split(/[\n,;]+/)
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
            .slice(0, 10); // limit to 10 tags max

        return NextResponse.json({ seoTags });
    } catch (error: any) {
        console.error("Error generating SEO tags:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
