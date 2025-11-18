import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import ParticipantCard from '../../components/ParticipantCard'
import MessageBubble from '../../components/MessageBubble'
import { mockApi, Participant, ChatMessage, FileItem } from '../../utils/mockApi'
import { Mic, MicOff, Video, VideoOff, MonitorUp, Send, FileUp, Bell, Download, Play, Square, Languages, MessageSquare } from 'lucide-react'

export default function MeetingRoom() {
  const params = useParams()
  const meetingId = params.id || ''

  const [self, setSelf] = useState<Participant | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [captions, setCaptions] = useState<string[]>([])

  const [chatText, setChatText] = useState('')
  const [recording, setRecording] = useState(false)
  const [lang, setLang] = useState('en')

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!meetingId) return
    ;(async () => {
      const me = await mockApi.joinMeeting(meetingId, 'You', { isHost: true })
      setSelf(me)
      setParticipants(await mockApi.listParticipants(meetingId))
      setMessages(await mockApi.listMessages(meetingId))
      setFiles(await mockApi.listFiles(meetingId))
    })()
    const interval = setInterval(async () => {
      const c = await mockApi.streamCaption(meetingId, lang)
      setCaptions(prev => [...prev.slice(-30), `${c.lang.toUpperCase()}: ${c.text}`])
    }, 3000)
    return () => clearInterval(interval)
  }, [meetingId, lang])

  async function toggleMic() {
    if (!self) return
    const updated = await mockApi.toggleMic(meetingId, self.id)
    if (updated) setSelf({ ...updated })
  }
  async function toggleCam() {
    if (!self) return
    const updated = await mockApi.toggleCam(meetingId, self.id)
    if (updated) setSelf({ ...updated })
  }

  async function sendMessage() {
    if (!self || !chatText.trim()) return
    const msg = await mockApi.sendMessage(meetingId, self.id, self.name, chatText)
    setMessages(prev => [...prev, msg])
    setChatText('')
  }

  async function uploadFile(file: File) {
    const item = await mockApi.uploadFile(meetingId, file)
    setFiles(prev => [...prev, item])
  }

  async function startStopRecording() {
    if (!recording) {
      await mockApi.startRecording(meetingId)
      setRecording(true)
    } else {
      await mockApi.stopRecording(meetingId, 'rec-1')
      setRecording(false)
    }
  }

  async function translateCaptions(target: string) {
    const translated = await Promise.all(captions.map(c => mockApi.translate(c, target)))
    setCaptions(translated)
  }

  const gridCols = 'grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4'

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
          <div className="flex items-center gap-2">
            <Button variant={self?.micOn ? 'secondary' : 'destructive'} onClick={toggleMic} className="gap-2">{self?.micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>} Mic</Button>
            <Button variant={self?.camOn ? 'secondary' : 'destructive'} onClick={toggleCam} className="gap-2">{self?.camOn ? <Video className="w-4 h-4"/> : <VideoOff className="w-4 h-4"/>} Cam</Button>
            <Button variant="secondary" className="gap-2"><MonitorUp className="w-4 h-4"/> Share</Button>
            <Button variant={recording ? 'destructive' : 'secondary'} onClick={startStopRecording} className="gap-2">{recording ? <Square className="w-4 h-4"/> : <Play className="w-4 h-4"/>} {recording ? 'Stop' : 'Record'}</Button>
          </div>
        </div>

        <div className={gridCols}>
          <div className="space-y-4">
            <div className="aspect-video rounded-lg bg-slate-200 grid place-items-center text-slate-600">
              <div className="text-center">
                <div className="font-semibold">Video Canvas</div>
                <div className="text-sm">(Placeholder — integrate WebRTC later)</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Participants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {participants.map(p => (
                  <ParticipantCard key={p.id} name={p.name} isHost={p.isHost} micOn={p.micOn} camOn={p.camOn} onToggleMic={() => mockApi.toggleMic(meetingId, p.id).then(()=> setParticipants(prev => prev.map(x=> x.id===p.id ? { ...x, micOn: !x.micOn } : x)))} onToggleCam={() => mockApi.toggleCam(meetingId, p.id).then(()=> setParticipants(prev => prev.map(x=> x.id===p.id ? { ...x, camOn: !x.camOn } : x)))} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border p-3 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4"/>
                <h3 className="font-semibold">Chat</h3>
              </div>
              <div className="h-64 overflow-y-auto pr-2">
                {messages.map(m => (
                  <MessageBubble key={m.id} sender={m.senderName} content={m.content} isSelf={m.senderId===self?.id} timestamp={m.createdAt} />
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input value={chatText} onChange={e=> setChatText(e.target.value)} placeholder="Type a message" className="flex-1 rounded-md border px-3 py-2 text-sm" aria-label="Chat input" />
                <Button onClick={sendMessage} className="gap-2"><Send className="w-4 h-4"/> Send</Button>
              </div>
            </div>

            <div className="rounded-lg border p-3 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <FileUp className="w-4 h-4"/>
                <h3 className="font-semibold">Files</h3>
              </div>
              <div className="space-y-2">
                <input ref={fileInputRef} type="file" className="hidden" onChange={e=> { const f = e.target.files?.[0]; if (f) uploadFile(f) }} />
                <Button variant="secondary" onClick={()=> fileInputRef.current?.click()} className="gap-2"><FileUp className="w-4 h-4"/> Upload</Button>
                <ul className="text-sm">
                  {files.map(f => (
                    <li key={f.id} className="flex items-center justify-between py-1">
                      <span>{f.name} <span className="text-xs text-slate-500">({Math.round(f.size/1024)} KB)</span></span>
                      <Button size="sm" variant="ghost" className="gap-1" onClick={()=> mockApi.downloadFile(meetingId, f.id)}><Download className="w-4 h-4"/> Download</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg border p-3 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="w-4 h-4"/>
                <h3 className="font-semibold">Live Captions</h3>
              </div>
              <div className="h-40 overflow-y-auto text-sm bg-slate-50 rounded-md p-2 border">
                {captions.map((c, i) => (
                  <div key={i} className="py-0.5">{c}</div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <select value={lang} onChange={e=> setLang(e.target.value)} className="rounded-md border px-2 py-1 text-sm" aria-label="Caption language">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
                <Button variant="secondary" onClick={()=> translateCaptions('en')}>Translate to EN</Button>
              </div>
            </div>

            <div className="rounded-lg border p-3 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4"/>
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="text-sm text-slate-600">Join/leave, message alerts, and AI summary will appear as toasts in a real integration.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
