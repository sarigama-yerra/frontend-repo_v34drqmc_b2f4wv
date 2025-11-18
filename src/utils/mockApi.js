/*
Mock API interfaces and in-memory stores for Mety
- Replace these functions with real service calls later.
- All functions are synchronous or Promise-based to mirror real APIs.
*/

// In-memory stores (reset on refresh)
const db = {
  meetings: new Map(),
  participants: new Map(), // key: meetingId -> Participant[]
  messages: new Map(),
  files: new Map(),
  captions: new Map(),
}

// Helpers
const uid = () => Math.random().toString(36).slice(2, 10)

export const mockApi = {
  // Meetings
  listMeetings() {
    return Promise.resolve(Array.from(db.meetings.values()).sort((a,b)=>b.createdAt-a.createdAt))
  },
  createMeeting(title, scheduledFor) {
    const m = { id: uid(), title: (title || '').trim() || 'Untitled Meeting', scheduledFor, createdAt: Date.now() }
    db.meetings.set(m.id, m)
    db.participants.set(m.id, [])
    db.messages.set(m.id, [])
    db.files.set(m.id, [])
    db.captions.set(m.id, [])
    return Promise.resolve(m)
  },
  getMeeting(id) {
    return Promise.resolve(db.meetings.get(id))
  },

  // Participants
  listParticipants(meetingId) {
    return Promise.resolve(db.participants.get(meetingId) || [])
  },
  joinMeeting(meetingId, name, opts) {
    const p = { id: uid(), name, micOn: true, camOn: true, ...(opts || {}) }
    const list = db.participants.get(meetingId) || []
    list.push(p)
    db.participants.set(meetingId, list)
    return Promise.resolve(p)
  },
  leaveMeeting(meetingId, participantId) {
    const list = db.participants.get(meetingId) || []
    db.participants.set(meetingId, list.filter(p=>p.id!==participantId))
    return Promise.resolve()
  },
  toggleMic(meetingId, participantId) {
    const list = db.participants.get(meetingId) || []
    const p = list.find(p=>p.id===participantId)
    if (p) p.micOn = !p.micOn
    return Promise.resolve(p)
  },
  toggleCam(meetingId, participantId) {
    const list = db.participants.get(meetingId) || []
    const p = list.find(p=>p.id===participantId)
    if (p) p.camOn = !p.camOn
    return Promise.resolve(p)
  },

  // Chat
  listMessages(meetingId) {
    return Promise.resolve(db.messages.get(meetingId) || [])
  },
  sendMessage(meetingId, senderId, senderName, content) {
    const sanitized = (content || '').replace(/[<>]/g, '')
    const msg = { id: uid(), meetingId, senderId, senderName, content: sanitized, createdAt: Date.now() }
    const list = db.messages.get(meetingId) || []
    list.push(msg)
    db.messages.set(meetingId, list)
    return Promise.resolve(msg)
  },

  // Files (mock upload)
  listFiles(meetingId) {
    return Promise.resolve(db.files.get(meetingId) || [])
  },
  uploadFile(meetingId, file) {
    const item = { id: uid(), meetingId, name: file.name.replace(/[<>]/g, ''), size: file.size, uploadedAt: Date.now(), url: undefined }
    const list = db.files.get(meetingId) || []
    list.push(item)
    db.files.set(meetingId, list)
    return Promise.resolve(item)
  },
  downloadFile(_meetingId, _fileId) {
    // No-op; would hit storage in real app
    return Promise.resolve()
  },

  // Captions & AI
  streamCaption(meetingId, lang = 'en') {
    const texts = {
      en: 'This is a mock real-time caption line.',
      es: 'Esta es una línea simulada de subtítulos en tiempo real.',
      fr: 'Ceci est une ligne de sous-titres simulée en temps réel.',
      de: 'Dies ist eine simulierte Live-Untertitel-Zeile.'
    }
    const text = texts[lang] || texts.en
    const caption = { id: uid(), meetingId, text, lang, createdAt: Date.now() }
    const list = db.captions.get(meetingId) || []
    list.push(caption)
    db.captions.set(meetingId, list)
    return Promise.resolve(caption)
  },
  translate(text, target) {
    return Promise.resolve(`[${(target || 'en').toUpperCase()}] ${text}`)
  },
  summarize(meetingId) {
    const msgs = db.messages.get(meetingId) || []
    const sample = msgs.slice(-3).map(m=>`- ${m.senderName}: ${m.content}`).join('\n') || '- No messages yet.'
    return Promise.resolve(`Mock AI Summary for meeting ${meetingId}:\n${sample}`)
  },

  // Recording (mock)
  startRecording(meetingId) {
    return Promise.resolve({ recordingId: uid() })
  },
  stopRecording(_meetingId, recordingId) {
    return Promise.resolve({ url: `blob:recording-${recordingId}` })
  }
}
