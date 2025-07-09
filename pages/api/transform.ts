import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

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
    const { score } = req.body;

    // Simplified prompt based on what actually works well
    const transformationPrompt = `Professional black and white portrait photograph of a handsome man, close-up headshot, confident expression, sharp facial features, good lighting, high quality, clean background`;

    console.log('=== ENHANCED ARTISTIC TRANSFORMATION PROMPT ===');
    console.log(transformationPrompt);
    console.log('===============================================');

    // Always use generation since we can't access blob URLs
    console.log('=== USING GENERATION ===');
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: transformationPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural'
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('Failed to generate transformation image');
    }

    console.log('=== TRANSFORMATION SUCCESS ===');
    console.log('Generated image URL:', imageUrl);
    console.log('===============================');

    return res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      prompt: transformationPrompt,
      originalScore: score,
      transformedScore: Math.min(
        100,
        score + 20 + Math.floor(Math.random() * 10)
      ) // Dramatic boost: 20-30 points
    });
  } catch (error: unknown) {
    console.error('Transformation error:', error);

    // Return fallback response if DALL-E fails
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to generate transformation';
    return res.status(200).json({
      success: false,
      error: errorMessage,
      fallbackMessage:
        'Transformation generation is temporarily unavailable. The artistic transformation would show a dramatic, high-contrast black and white portrait with professional styling.',
      originalScore: req.body.score || 50,
      transformedScore: Math.min(100, (req.body.score || 50) + 25)
    });
  }
}
