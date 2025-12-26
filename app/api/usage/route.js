import { NextResponse } from 'next/server'

let usageData = {
  totalVideos: 0,
  todayUsage: 0,
  serviceUsage: {},
  recentVideos: [],
  lastReset: new Date().toDateString()
}

export async function POST(request) {
  try {
    const { service, prompt } = await request.json()
    
    const today = new Date().toDateString()
    if (usageData.lastReset !== today) {
      usageData.todayUsage = 0
      usageData.lastReset = today
    }
    
    usageData.totalVideos++
    usageData.todayUsage++
    
    usageData.serviceUsage[service] = (usageData.serviceUsage[service] || 0) + 1
    
    usageData.recentVideos.unshift({
      timestamp: new Date().toISOString(),
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      service,
      success: true
    })
    
    if (usageData.recentVideos.length > 50) {
      usageData.recentVideos = usageData.recentVideos.slice(0, 50)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track usage' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const today = new Date().toDateString()
  if (usageData.lastReset !== today) {
    usageData.todayUsage = 0
    usageData.lastReset = today
  }
  
  const serviceUsageArray = Object.entries(usageData.serviceUsage)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
  
  const mostUsedService = serviceUsageArray[0]?.service || 'None'
  
  const totalRequests = usageData.totalVideos || 1
  const successCount = usageData.recentVideos.filter(v => v.success).length
  const successRate = Math.round((successCount / totalRequests) * 100) + '%'
  
  const credits = [
    { service: 'Replicate', remaining: 80, credits: '$8.00' },
    { service: 'HuggingFace', remaining: 95, credits: 'Unlimited' },
    { service: 'StabilityAI', remaining: 75, credits: '$15.00' }
  ]
  
  return NextResponse.json({
    totalVideos: usageData.totalVideos,
    todayUsage: usageData.todayUsage,
    serviceUsage: serviceUsageArray,
    mostUsedService,
    successRate,
    credits,
    lastReset: usageData.lastReset
  })
}
