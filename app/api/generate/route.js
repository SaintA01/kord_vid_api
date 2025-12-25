import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import OpenAI from 'openai';

// Initialize APIs
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model configurations
const MODELS = {
  realistic: 'anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f',
  anime: 'cjwbw/damo-text-to-video:1e205ea73084bd17a0a3b43396e49ba0d6bc2e754e9283b2df49fad2dcf95755',
  cyberpunk: 'stability-ai/stable-video-diffusion-img2vid-xt:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
  fantasy: 'deforum/deforum_stable_diffusion:2e57b1d5e9d8f5c5c6c5d4b4b1f9c7a0d4b1f9c7a0d4b1f9c7a0d4b1f9c7a0d4',
};

export async function POST(request) {
  try {
    const { prompt, style, duration } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Option 1: Using Replicate API
    const model = MODELS[style] || MODELS.realistic;

    const output = await replicate.run(model, {
      input: {
        prompt: `${prompt}, ${style} style, cinematic, high quality`,
        num_frames: Math.min(Math.max(duration * 10, 30), 150),
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    });

    // Option 2: Alternative using RunwayML or other services
    /*
    const response = await fetch('https://api.runwayml.com/v1/video/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAYML_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        steps: 50,
        cfg_scale: 7.5,
        width: 1024,
        height: 576,
        num_frames: duration * 10,
      }),
    });
    
    const data = await response.json();
    */

    return NextResponse.json({
      success: true,
      videoUrl: output[0], // URL from Replicate
      // For async processing:
      // taskId: data.taskId,
      message: 'Video generation started successfully',
    });

  } catch (error) {
    console.error('Video generation error:', error);
    
    // Fallback to mock response for testing
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        message: 'Using sample video in development mode',
      });
    }

    return NextResponse.json(
      { error: 'Failed to generate video', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
