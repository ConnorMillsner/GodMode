import { NextApiRequest, NextApiResponse } from 'next';
import * as formidable from 'formidable';
import fs from 'fs/promises';
import OpenAI from 'openai';

// Disable Next.js body parsing to handle file uploads with formidable
export const config = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filePath = await new Promise<string>((resolve, reject) => {
      const form = new formidable.IncomingForm({
        uploadDir: '/tmp',
        keepExtensions: true
      });

      form.parse(req, (err, _fields, files) => {
        if (err) return reject(err);
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file || typeof file !== 'object' || !('filepath' in file)) {
          return reject(new Error('No file uploaded'));
        }
        resolve(file.filepath);
      });
    });

    const imageData = await fs.readFile(filePath);
    const base64Image = imageData.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "Rate this person's physical fitness from 1 to 10 and explain your reasoning based on visual appearance."
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    return res.status(200).json({ score: response.choices[0].message.content });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message ?? 'Upload failed' });
  }
}
