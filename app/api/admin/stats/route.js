import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const headersList = headers()
    const referer = headersList.get('referer')
    
    if (!referer || !referer.includes('localhost')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const usageResponse = await fetch('http://localhost:3000/api/usage', {
      method: 'GET'
    })
    
    const usageData = await usageResponse.json()
    
    return NextResponse.json(usageData)
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
