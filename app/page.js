'use client';

import { useState } from 'react';
import VideoGenerator from '@/components/VideoGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Video Generator
          </h1>
          <p className="text-gray-300 text-lg">
            Transform your text into stunning AI-generated videos
          </p>
        </header>
        
        <VideoGenerator />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Text to Video" 
            description="Convert any text description into a video"
            icon="🎬"
          />
          <FeatureCard 
            title="Multiple Styles" 
            description="Choose from various video styles and themes"
            icon="🎨"
          />
          <FeatureCard 
            title="Fast Generation" 
            description="Get your videos in minutes with AI"
            icon="⚡"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
