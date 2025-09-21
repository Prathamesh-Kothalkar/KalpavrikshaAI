// import { NextResponse } from 'next/server';
// import { vertexAI } from '@/lib/google/vertex';

// // This tells Next.js to run this function as a serverless function,
// // which is the default in the App Router.
// export const dynamic = 'force-dynamic';

// // Get the generative model from the Vertex AI client
// const generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// export async function GET() {
//   try {
//     const prompt = "Tell me a short, fun fact about Pune, Maharashtra.";

//     // Generate content based on the prompt
//     const result = await generativeModel.generateContent(prompt);
//     const textResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

//     console.log('Successfully received response from Vertex AI:', textResponse);

//     // Return the successful response
//     return NextResponse.json({
//       message: 'Successfully connected to Vertex AI.',
//       response: textResponse,
//     });
//   } catch (error) {
//     console.error('Error connecting to Vertex AI:', error);

//     // Return an error response
//     return new NextResponse('Internal Server Error: Failed to connect to Vertex AI.', {
//       status: 500,
//     });
//   }
// }