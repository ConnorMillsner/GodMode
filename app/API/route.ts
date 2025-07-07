import { NextRequest } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';

// Disable Next.js body parsing to handle file uploads with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm({ multiples: false });

  const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  // Access the uploaded file
  const file = data.files.file;
  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }

  // Read the file data
  const fileData = fs.readFileSync(file.filepath);

  // Call OpenAI API for image analysis (example using image analysis endpoint)
  const response = await openai.images.analyze({
    image: fileData,
  });

  // Return the response from OpenAI to the frontend
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
}
