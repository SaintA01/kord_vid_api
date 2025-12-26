'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminPanel({ onBack }) {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentVideos, setRecentVideos] = useState([])

  useEffect(() => {
    if (authenticated) {
      fetchStats()
      fetchRecentVideos()
    }
  }, [authenticated])

  const login = async () => {
    if (password === process.env.ADMIN_PASSWORD || password === 'admin123') {
      setAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentVideos = async () => {
    try {
      const response = await axios.get('/api/admin/recent')
      setRecentVideos(response.data)
    } catch (error) {
      console.error('Failed to fetch recent videos:', error)
    }
  }

  const chartData = {
    labels: stats?.serviceUsage.map(s => s.service) || [],
    datasets: [
      {
        label: 'Usage Count',
        data: stats?.serviceUsage.map(s => s.count) || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Service Usage Distribution'
      }
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                placeholder="Enter admin password"
              />
            </div>
            <button
              onClick={login}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
            >
              Login
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold"
            >
              Back to Generator
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          Back to Generator
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400">Total Videos</h3>
              <p className="text-3xl font-bold mt-2">{stats?.totalVideos || 0}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400">Today's Usage</h3>
              <p className="text-3xl font-bold mt-2">{stats?.todayUsage || 0}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400">Most Used Service</h3>
              <p className="text-3xl font-bold mt-2">{stats?.mostUsedService || 'None'}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
              <p className="text-3xl font-bold mt-2">{stats?.successRate || '0%'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Service Usage</h3>
              <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Credit Status</h3>
              <div className="space-y-4">
                {stats?.credits.map((credit, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{credit.service}</span>
                      <span className={`font-bold ${
                        credit.remaining < 20 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {credit.remaining}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          credit.remaining < 20 ? 'bg-red-500' : 
                          credit.remaining < 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${credit.remaining}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      {credit.credits} credits remaining
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Recent Videos</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Prompt</th>
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVideos.map((video, index) => (
                    <tr key={index} className="border-b border-gray-800/50">
                      <td className="py-3 px-4">
                        {new Date(video.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">
                        {video.prompt}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          video.service.includes('Hugging') ? 'bg-blue-500/20 text-blue-400' :
                          video.service.includes('Replicate') ? 'bg-purple-500/20 text-purple-400' :
                          video.service.includes('Stability') ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {video.service}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          video.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {video.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
