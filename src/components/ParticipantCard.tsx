import React from 'react'
import { Mic, MicOff, Video, VideoOff, Crown } from 'lucide-react'
import { Button } from './ui/Button'

export type ParticipantCardProps = {
  name: string
  isHost?: boolean
  micOn: boolean
  camOn: boolean
  onToggleMic?: () => void
  onToggleCam?: () => void
}

export default function ParticipantCard({ name, isHost, micOn, camOn, onToggleMic, onToggleCam }: ParticipantCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 bg-white/70 backdrop-blur">
      <div className="flex items-center gap-2">
        {isHost && <Crown className="w-4 h-4 text-amber-500" aria-label="host" />}
        <div className="font-medium">{name}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={micOn ? 'secondary' : 'destructive'} size="sm" aria-pressed={!micOn} aria-label={micOn ? 'Mute' : 'Unmute'} onClick={onToggleMic}>
          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>
        <Button variant={camOn ? 'secondary' : 'destructive'} size="sm" aria-pressed={!camOn} aria-label={camOn ? 'Turn camera off' : 'Turn camera on'} onClick={onToggleCam}>
          {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
