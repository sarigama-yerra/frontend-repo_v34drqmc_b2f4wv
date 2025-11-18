import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Video } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { mockApi, Meeting } from '../utils/mockApi'
import Spline from '@splinetool/react-spline'

export default function HomePage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    mockApi.listMeetings().then(setMeetings)
  }, [])

  async function handleCreate() {
    setCreating(true)
    const m = await mockApi.createMeeting('New Mety Meeting')
    setMeetings(prev => [m, ...prev])
    setCreating(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative h-[320px] md:h-[420px] w-full overflow-hidden">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="absolute inset-x-0 top-0 flex h-full items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Mety — AI-powered video meetings</h1>
            <p className="mt-3 text-slate-700 max-w-2xl mx-auto">Transcription, chat, recording, file sharing, and real-time translation — all in one intuitive workspace.</p>
            <div className="mt-5">
              <Button onClick={handleCreate} disabled={creating} className="gap-2">
                <Plus className="w-4 h-4" /> Create meeting
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 px-4 md:px-8 py-8 max-w-5xl w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your meetings</h2>
          <Button onClick={handleCreate} disabled={creating} className="gap-2"><Plus className="w-4 h-4" /> New</Button>
        </div>
        {meetings.length === 0 ? (
          <div className="text-slate-600">No meetings yet. Create one to get started.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map(m => (
              <Link key={m.id} to={`/meeting/${m.id}`} className="rounded-lg border p-4 hover:shadow transition bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-md"><Video className="w-5 h-5 text-blue-600" /></div>
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-sm text-slate-600">Created {new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
