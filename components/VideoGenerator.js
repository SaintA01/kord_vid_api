'use client'
import { useState } from 'react'
import axios from 'axios'

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [serviceUsed, setServiceUsed] = useState('')
  const [error, setError] = useState('')

  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError('')
    setVideoUrl('')

    try {
      const response = await axios.post('/api/generate', { prompt })
      
      if (response.data.success) {
        setVideoUrl(response.data.videoUrl)
        setServiceUsed(response.data.serviceUsed)
        
        // Track usage
        await axios.post('/api/usage', {
          service: response.data.serviceUsed,
          prompt: prompt
        })
      } else {
        setError(response.data.error || 'Generation failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-900/50 rounded-xl p-8 border border-gray-800">
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Describe your video
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cat dancing on the moon, cinematic, 4k..."
          className="w-full h-32 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <button
        onClick={generateVideo}
        disabled={loading}
        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 rounded-lg font-semibold transition-all"
      >
        {loading ? 'Generating...' : 'Generate Video'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {serviceUsed && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400">Service used: {serviceUsed}</p>
        </div>
      )}

      {videoUrl && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Generated Video</h3>
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              controls
              className="w-full"
              autoPlay
              loop
              muted
            />
          </div>
          <div className="mt-4 flex justify-end">
            <a
              href={videoUrl}
              download="ai-video.mp4"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
