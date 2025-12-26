import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    let videoUrl = null
    let serviceUsed = ''
    
    const services = [
      { name: 'Replicate', func: tryReplicate },
      { name: 'HuggingFace', func: tryHuggingFace },
      { name: 'Mock', func: getMockVideo }
    ]

    for (const service of services) {
      try {
        videoUrl = await service.func(prompt)
        if (videoUrl) {
          serviceUsed = service.name
          break
        }
      } catch (error) {
        console.log(`${service.name} failed:`, error.message)
        continue
      }
    }

    if (!videoUrl) {
      videoUrl = await getMockVideo()
      serviceUsed = 'Mock (Fallback)'
    }

    return NextResponse.json({
      success: true,
      videoUrl,
      serviceUsed
    })

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}

async function tryReplicate(prompt) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('No Replicate token')
  }

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      input: { 
        prompt: prompt,
        num_frames: 50,
        num_inference_steps: 50
      }
    })
  })

  const data = await response.json()
  
  if (data.status === 'starting' || data.status === 'processing') {
    return await pollReplicateResult(data.id)
  }
  
  throw new Error('Replicate generation failed')
}

async function pollReplicateResult(predictionId) {
  let attempts = 0
  const maxAttempts = 30
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    })
    
    const data = await response.json()
    
    if (data.status === 'succeeded' && data.output) {
      return data.output[0]
    } else if (data.status === 'failed') {
      throw new Error('Replicate processing failed')
    }
    
    attempts++
  }
  
  throw new Error('Replicate timeout')
}

async function tryHuggingFace(prompt) {
  if (!process.env.HUGGINGFACE_TOKEN) {
    throw new Error('No HuggingFace token')
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/cerspense/zeroscope_v2_576w",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  )

  if (response.ok) {
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return url
  }
  
  throw new Error('HuggingFace request failed')
}

async function getMockVideo() {
  const videos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  ]
  
  return videos[Math.floor(Math.random() * videos.length)]
}
