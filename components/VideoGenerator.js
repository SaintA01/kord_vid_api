'use client';

import { useState } from 'react';
import axios from 'axios';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [style, setStyle] = useState('realistic');
  const [duration, setDuration] = useState(5);

  const styles = [
    { id: 'realistic', name: 'Realistic', icon: '🎥' },
    { id: 'anime', name: 'Anime', icon: '🌸' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖' },
    { id: 'fantasy', name: 'Fantasy', icon: '🐉' },
    { id: 'watercolor', name: 'Watercolor', icon: '🎨' },
  ];

  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a video description');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await axios.post('/api/generate', {
        prompt,
        style,
        duration,
      });

      if (response.data.success) {
        if (response.data.videoUrl) {
          setVideoUrl(response.data.videoUrl);
        } else if (response.data.taskId) {
          // Poll for video generation status
          pollVideoStatus(response.data.taskId);
        }
      } else {
        setError(response.data.error || 'Failed to generate video');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const pollVideoStatus = async (taskId) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(`/api/status?taskId=${taskId}`);
        
        if (response.data.status === 'completed' && response.data.videoUrl) {
          setVideoUrl(response.data.videoUrl);
        } else if (response.data.status === 'failed') {
          setError('Video generation failed');
        } else if (response.data.status === 'processing') {
          // Continue polling
          setTimeout(checkStatus, 3000);
        }
      } catch (err) {
        setError('Error checking status');
      }
    };

    checkStatus();
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-12">
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Describe your video
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A majestic dragon flying over a medieval castle at sunset, cinematic, 4k, epic..."
          className="w-full h-32 p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <div className="text-sm text-gray-400 mt-2">
          Be descriptive for better results
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Video Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`p-3 rounded-lg border-2 transition-all ${style === s.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                  }`}
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-sm font-medium">{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Duration: {duration} seconds
          </label>
          <input
            type="range"
            min="3"
            max="15"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>3s</span>
            <span>9s</span>
            <span>15s</span>
          </div>
        </div>
      </div>

      <button
        onClick={generateVideo}
        disabled={loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Generating Video...
          </div>
        ) : (
          'Generate Video'
        )}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="text-red-400 flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Generated Video</h3>
          <div className="bg-black rounded-xl overflow-hidden">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-xl"
              autoPlay
              loop
              muted
            />
          </div>
          <div className="mt-4 flex justify-end">
            <a
              href={videoUrl}
              download="ai-video.mp4"
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Download Video
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
