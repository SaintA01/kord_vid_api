'use client'
import { useState } from 'react'
import VideoGenerator from '../components/VideoGenerator'
import AdminPanel from '../components/AdminPanel'

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div className="min-h-screen gradient-bg">
      {!isAdmin ? (
        <div>
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">AI Video Generator</h1>
              <p className="text-gray-300">Transform text into videos with AI</p>
            </header>
            <VideoGenerator />
            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsAdmin(true)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <AdminPanel onBack={() => setIsAdmin(false)} />
      )}
    </div>
  )
}
