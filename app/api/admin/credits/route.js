import { NextResponse } from 'next/server'

export async function GET() {
  const credits = [
    {
      service: 'Replicate',
      used: 2,
      total: 10,
      unit: 'USD',
      remaining: 8,
      percentage: 80
    },
    {
      service: 'HuggingFace',
      used: 15,
      total: 100,
      unit: 'requests',
      remaining: 85,
      percentage: 85
    },
    {
      service: 'StabilityAI',
      used: 5,
      total: 20,
      unit: 'USD',
      remaining: 15,
      percentage: 75
    }
  ]
  
  return NextResponse.json({ credits })
}
