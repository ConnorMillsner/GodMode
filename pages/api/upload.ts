import { NextApiRequest, NextApiResponse } from 'next';
import * as formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
// import os from 'os';
// import OpenAI from 'openai';

// Disable Next.js body parsing to handle file uploads with formidable
export const config = {
  api: {
    bodyParser: false
  }
};

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let filePath: string | null = null;

  try {
    // Create uploads directory in the project root
    const uploadsDir = path.join(process.cwd(), 'uploads');

    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    filePath = await new Promise<string>((resolve, reject) => {
      const form = new formidable.IncomingForm({
        uploadDir: uploadsDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024 // 10MB limit
      });

      form.parse(req, (err: unknown, _fields: unknown, files: unknown) => {
        if (err) return reject(err);

        // Type guard for files
        if (!files || typeof files !== 'object' || !('file' in files)) {
          return reject(new Error('No file uploaded'));
        }

        // files is now known to have a 'file' property
        const fileField = files.file;
        const file = Array.isArray(fileField) ? fileField[0] : fileField;

        if (!file || typeof file !== 'object' || !('filepath' in file)) {
          return reject(new Error('No file uploaded'));
        }

        resolve((file as { filepath: string }).filepath);
      });
    });

    // Skip OpenAI for now and generate randomized but specific advice
    const styleScores = [45, 52, 67, 43, 58, 71, 49, 63, 55, 60];
    const randomScore =
      styleScores[Math.floor(Math.random() * styleScores.length)];

    const observationSets = [
      [
        'Current pheno lacks dimorphism - facial harmony could be improved through looksmaxxing techniques and better canthal tilt optimization',
        'Collagen production appears suboptimal - skin texture shows signs of poor skincare routine affecting overall SMV (sexual market value)',
        'Bone structure has potential but needs facial fat reduction to achieve better hollow cheeks and defined jawline for mogger status'
      ],
      [
        'Hairline and hair density show norwood potential - need to address MPB prevention and consider hair transplant consultation for chad ascension',
        'Facial thirds ratio is off - upper third dominance suggests need for eyebrow maxxing and potential surgical intervention for harmony',
        'Neck area shows subhuman fat distribution - need to gymcel and reduce body fat percentage to reveal underlying bone structure'
      ],
      [
        'Current phenotype shows beta facial features - need to hardmaxx through mewing, chewing, and potential surgical looksmaxxing procedures',
        'Skin quality indicates poor lifestyle choices - need to optimize diet, sleep, and implement advanced skincare routine for glow-up',
        'Facial asymmetry detected - left side mogs right side, consider facial exercises and potential cosmetic intervention for balance'
      ],
      [
        'Eye area lacks hunter eyes - need to focus on orbital bone development and consider canthopexy for better eye shape',
        'Midface length appears suboptimal - long midface ratio suggests need for upper lip lifting and better facial proportions',
        'Overall facial development shows recessed features - need to focus on forward growth through mewing and posture correction'
      ]
    ];

    const suggestionSets = [
      [
        'Start mewing immediately: proper tongue posture 24/7, chew hard gum daily, and maintain forward head posture for facial development',
        'Implement advanced skincare routine: tretinoin 0.05% nightly, vitamin C serum AM, dermarolling weekly for collagen stimulation',
        'Begin serious looksmaxxing protocol: reduce body fat to 10-12%, start lifting heavy compounds, and optimize testosterone levels naturally'
      ],
      [
        'Get a mogger haircut: ask for textured crop with skin fade, use sea salt spray for texture, and consider finasteride for hair loss prevention',
        'Upgrade your style game: invest in well-fitted clothes, develop signature scent, and focus on accessories that enhance your phenotype',
        'Start facial exercises: jaw training with jawzrsize, facial yoga for muscle tone, and consider professional facial massage for lymphatic drainage'
      ],
      [
        'Optimize your diet for looksmaxxing: high protein intake, anti-inflammatory foods, intermittent fasting, and supplement with collagen peptides',
        'Focus on posture correction: strengthen posterior chain, practice wall sits, and maintain proper spinal alignment for better presence',
        'Consider professional consultation: dermatologist for skin optimization, orthodontist for jaw alignment, and personal trainer for physique development'
      ],
      [
        'Implement advanced grooming routine: professional eyebrow shaping, regular facial treatments, and invest in quality grooming tools',
        'Start supplementation stack: vitamin D3, zinc, magnesium, and omega-3s for optimal hormone production and skin health',
        'Focus on sleep optimization: 8+ hours nightly, blackout curtains, blue light blocking, and consistent sleep schedule for recovery and growth hormone'
      ]
    ];

    const randomObservations =
      observationSets[Math.floor(Math.random() * observationSets.length)];
    const randomSuggestions =
      suggestionSets[Math.floor(Math.random() * suggestionSets.length)];

    const result = {
      score: randomScore,
      observations: randomObservations,
      suggestions: randomSuggestions
    };

    console.log('=== GENERATED RESULT ===');
    console.log('Generated specific result:', result);
    console.log('========================');

    return res.status(200).json(result);
  } catch (error: unknown) {
    console.error('Upload error:', error);

    // Clean up the uploaded file in case of error
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.warn(
          'Could not clean up uploaded file after error:',
          cleanupError
        );
      }
    }

    let errorMessage = 'Upload failed';
    if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }
    return res.status(500).json({ error: errorMessage });
  }
}
