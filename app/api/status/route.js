import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Check task status with your chosen provider
    // This is a mock implementation
    const mockStatus = Math.random() > 0.3 ? 'completed' : 'processing';
    
    if (mockStatus === 'completed') {
      return NextResponse.json({
        status: 'completed',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        progress: 100,
      });
    } else {
      return NextResponse.json({
        status: 'processing',
        progress: Math.floor(Math.random() * 100),
        estimatedTime: '30 seconds',
      });
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
