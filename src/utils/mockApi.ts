/*
Mock API interfaces and in-memory stores for Mety
- Replace these functions with real service calls later.
- All functions are synchronous or Promise-based to mirror real APIs.
*/

export type Meeting = {
  id: string
  title: string
  scheduledFor?: string
  createdAt: number
}

export type Participant = {
  id: string
  name: string
  isHost?: boolean
  micOn: boolean
  camOn: boolean
}

export type ChatMessage = {
  id: string
  meetingId: string
  senderId: string
  senderName: string
  content: string
  createdAt: number
}

export type FileItem = {
  id: string
  meetingId: string
  name: string
  size: number
  uploadedAt: number
  url?: string // placeholder
}

export type Caption = {
  id: string
  meetingId: string
  text: string
  lang: string
  createdAt: number
}

export type NotificationItem = {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  description?: string
  createdAt: number
}

// In-memory stores (reset on refresh)
const db = {
  meetings: new Map<string, Meeting>(),
  participants: new Map<string, Participant[]>(), // key: meetingId
  messages: new Map<string, ChatMessage[]>(),
  files: new Map<string, FileItem[]>(),
  captions: new Map<string, Caption[]>(),
}

// Helpers
const uid = () => Math.random().toString(36).slice(2, 10)

export const mockApi = {
  // Meetings
  listMeetings(): Promise<Meeting[]> {
    return Promise.resolve(Array.from(db.meetings.values()).sort((a,b)=>b.createdAt-a.createdAt))
  },
  createMeeting(title: string, scheduledFor?: string): Promise<Meeting> {
    const m: Meeting = { id: uid(), title: title.trim() || 'Untitled Meeting', scheduledFor, createdAt: Date.now() }
    db.meetings.set(m.id, m)
    db.participants.set(m.id, [])
    db.messages.set(m.id, [])
    db.files.set(m.id, [])
    db.captions.set(m.id, [])
    return Promise.resolve(m)
  },
  getMeeting(id: string): Promise<Meeting | undefined> {
    return Promise.resolve(db.meetings.get(id))
  },

  // Participants
  listParticipants(meetingId: string): Promise<Participant[]> {
    return Promise.resolve(db.participants.get(meetingId) || [])
  },
  joinMeeting(meetingId: string, name: string, opts?: Partial<Participant>): Promise<Participant> {
    const p: Participant = { id: uid(), name, micOn: true, camOn: true, ...opts }
    const list = db.participants.get(meetingId) || []
    list.push(p)
    db.participants.set(meetingId, list)
    return Promise.resolve(p)
  },
  leaveMeeting(meetingId: string, participantId: string): Promise<void> {
    const list = db.participants.get(meetingId) || []
    db.participants.set(meetingId, list.filter(p=>p.id!==participantId))
    return Promise.resolve()
  },
  toggleMic(meetingId: string, participantId: string): Promise<Participant | undefined> {
    const list = db.participants.get(meetingId) || []
    const p = list.find(p=>p.id===participantId)
    if (p) p.micOn = !p.micOn
    return Promise.resolve(p)
  },
  toggleCam(meetingId: string, participantId: string): Promise<Participant | undefined> {
    const list = db.participants.get(meetingId) || []
    const p = list.find(p=>p.id===participantId)
    if (p) p.camOn = !p.camOn
    return Promise.resolve(p)
  },

  // Chat
  listMessages(meetingId: string): Promise<ChatMessage[]> {
    return Promise.resolve(db.messages.get(meetingId) || [])
  },
  sendMessage(meetingId: string, senderId: string, senderName: string, content: string): Promise<ChatMessage> {
    const sanitized = content.replace(/[<>]/g, '')
    const msg: ChatMessage = { id: uid(), meetingId, senderId, senderName, content: sanitized, createdAt: Date.now() }
    const list = db.messages.get(meetingId) || []
    list.push(msg)
    db.messages.set(meetingId, list)
    return Promise.resolve(msg)
  },

  // Files (mock upload)
  listFiles(meetingId: string): Promise<FileItem[]> {
    return Promise.resolve(db.files.get(meetingId) || [])
  },
  uploadFile(meetingId: string, file: File): Promise<FileItem> {
    const item: FileItem = { id: uid(), meetingId, name: file.name.replace(/[<>]/g, ''), size: file.size, uploadedAt: Date.now(), url: undefined }
    const list = db.files.get(meetingId) || []
    list.push(item)
    db.files.set(meetingId, list)
    return Promise.resolve(item)
  },
  downloadFile(_meetingId: string, _fileId: string): Promise<void> {
    // No-op; would hit storage in real app
    return Promise.resolve()
  },

  // Captions & AI
  streamCaption(meetingId: string, lang = 'en'): Promise<Caption> {
    // Simulate a new caption line
    const texts = {
      en: 'This is a mock real-time caption line.',
      es: 'Esta es una línea simulada de subtítulos en tiempo real.',
      fr: "Ceci est une ligne de sous-titres simulée en temps réel.",
      de: 'Dies ist eine simulierte Live-Untertitel-Zeile.'
    } as Record<string, string>
    const text = texts[lang] || texts.en
    const caption: Caption = { id: uid(), meetingId, text, lang, createdAt: Date.now() }
    const list = db.captions.get(meetingId) || []
    list.push(caption)
    db.captions.set(meetingId, list)
    return Promise.resolve(caption)
  },
  translate(text: string, target: string): Promise<string> {
    // Pretend to translate by annotating the string
    return Promise.resolve(`[${target.toUpperCase()}] ${text}`)
  },
  summarize(meetingId: string): Promise<string> {
    const msgs = db.messages.get(meetingId) || []
    const sample = msgs.slice(-3).map(m=>`- ${m.senderName}: ${m.content}`).join('\n') || '- No messages yet.'
    return Promise.resolve(`Mock AI Summary for meeting ${meetingId}:\n${sample}`)
  },

  // Recording (mock)
  startRecording(meetingId: string): Promise<{ recordingId: string }> {
    return Promise.resolve({ recordingId: uid() })
  },
  stopRecording(_meetingId: string, recordingId: string): Promise<{ url: string }> {
    return Promise.resolve({ url: `blob:recording-${recordingId}` })
  }
}
