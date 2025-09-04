import { VertexAI } from '@google-cloud/vertexai';

console.log('Loading Google Vertex AI configuration from environment variables...');

if (!process.env.GCP_PROJECT_ID) {
  throw new Error('GCP_PROJECT_ID environment variable is not set.');
}
if (!process.env.GCP_REGION) {
  throw new Error('GCP_REGION environment variable is not set.');
}
if (!process.env.GCP_CLIENT_EMAIL) {
  throw new Error('GCP_CLIENT_EMAIL environment variable is not set.');
}
if (!process.env.GCP_PRIVATE_KEY) {
  throw new Error('GCP_PRIVATE_KEY environment variable is not set.');
}

console.log('All required environment variables are set.');
console.log('GCP_PROJECT_ID:', process.env.GCP_PROJECT_ID);
console.log('GCP_REGION:', process.env.GCP_REGION);
console.log('GCP_CLIENT_EMAIL:', process.env.GCP_CLIENT_EMAIL);

const formattedPrivateKey = process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n');

const credentials = {
  client_email: process.env.GCP_CLIENT_EMAIL,
  private_key: formattedPrivateKey,
};

export const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID!,
  location: process.env.GCP_REGION!,
  googleAuthOptions: { credentials },
});
