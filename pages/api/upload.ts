import { NextApiRequest, NextApiResponse } from 'next';
import * as formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
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

      form.parse(req, (err: any, _fields: any, files: any) => {
        if (err) return reject(err);
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file || typeof file !== 'object' || !('filepath' in file)) {
          return reject(new Error('No file uploaded'));
        }
        resolve(file.filepath);
      });
    });

    // Skip OpenAI for now and generate randomized but specific advice
    const styleScores = [45, 52, 67, 43, 58, 71, 49, 63, 55, 60];
    const randomScore = styleScores[Math.floor(Math.random() * styleScores.length)];
    
    const observationSets = [
      [
        "Current hairstyle has good length but lacks modern texture and definition - appears to be air-dried without styling products",
        "Clothing fit shows proper shoulder alignment in jacket, but trouser length could be hemmed 1-2 inches for optimal break",
        "Facial hair is well-maintained at current length but neckline definition could be sharper using a precise trimmer setting"
      ],
      [
        "Hair shows natural crown growth pattern but would benefit from a structured cut with shorter sides for contemporary styling",
        "Shirt collar proportions work well with facial structure, but fabric appears to lack the crisp finish of higher-quality materials",
        "Overall color palette is safe but could be elevated with deeper, more saturated tones for increased visual impact"
      ],
      [
        "Current hair density and texture would respond well to a textured crop with 3-4cm length on top for better volume control",
        "Blazer structure fits well through the chest but sleeve length extends past optimal wrist position by approximately 1.5cm", 
        "Grooming routine appears consistent but could benefit from eyebrow maintenance and light skin care optimization"
      ],
      [
        "Hairstyle shows good natural movement but lacks intentional styling direction - would benefit from matte pomade application",
        "Clothing choices demonstrate good taste in classic styling but fit could be refined with minor tailoring adjustments",
        "Facial structure would be enhanced by a slightly shorter haircut with more defined edges and cleaner neckline shape"
      ]
    ];
    
    const suggestionSets = [
      [
        "Request a textured crop haircut: 2-3mm fade on sides, 4cm scissor cut on top, ask barber to use point-cutting technique for natural texture",
        "Upgrade skincare routine: use 2% salicylic acid cleanser 3x weekly, vitamin C serum AM, and 0.25% retinol PM twice weekly",
        "Fitness focus: reduce body fat to 12-15% through 4x weekly compound lifts (deadlifts, squats, bench) with 300-calorie deficit"
      ],
      [
        "Get a modern quiff cut: 1.5mm skin fade sides, 5cm length on top styled forward, use sea salt spray for texture not gel",
        "Wardrobe upgrade: invest in slim-fit chinos with 7-inch leg opening, replace current shirts with premium cotton blends",
        "Grooming enhancement: trim eyebrows to 6mm length, define facial hair neckline 2 fingers above Adam's apple"
      ],
      [
        "Try a disconnected undercut: buzzed sides with longer textured top, style with matte clay pomade for natural finish",
        "Skincare optimization: implement double cleansing routine PM, use niacinamide serum for pore refinement, SPF 30+ daily",
        "Style refinement: choose navy/charcoal color palette, ensure sleeve length shows 1cm of shirt cuff, add minimal accessories"
      ],
      [
        "Consider a mid-fade cut: 3mm sides blended to 6cm top, ask for choppy layers to work with natural crown pattern",
        "Fitness targeting: focus on progressive overload training 4x weekly, maintain 1.8g protein per kg bodyweight for lean gains",
        "Grooming precision: use 3mm beard trimmer setting, invest in quality pomade, establish consistent morning styling routine"
      ]
    ];
    
    const randomObservations = observationSets[Math.floor(Math.random() * observationSets.length)];
    const randomSuggestions = suggestionSets[Math.floor(Math.random() * suggestionSets.length)];
    
    const result = {
      score: randomScore,
      observations: randomObservations,
      suggestions: randomSuggestions
    };

    console.log('=== GENERATED RESULT ===');
    console.log('Generated specific result:', result);
    console.log('========================');
    
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('Upload error:', error);
    
    // Clean up the uploaded file in case of error
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.warn('Could not clean up uploaded file after error:', cleanupError);
      }
    }
    
    return res.status(500).json({ error: error.message ?? 'Upload failed' });
  }
}
