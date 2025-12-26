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
          'rgba(99, 102
