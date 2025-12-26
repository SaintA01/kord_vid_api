import { NextResponse } from 'next/server'

let recentVideos = []

export async function GET() {
  return NextResponse.json(recentVideos.slice(0, 10))
}

export async function POST(request) {
  try {
    const { timestamp, prompt, service, success } = await request.json()
    
    recentVideos.unshift({
      timestamp,
      prompt,
      service,
      success
    })
    
    if (recentVideos.length > 100) {
      recentVideos = recentVideos.slice(0, 100)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add video' },
      { status: 500 }
    )
  }
}
