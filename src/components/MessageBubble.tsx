import React from 'react'

export type MessageBubbleProps = {
  sender: string
  content: string
  isSelf?: boolean
  timestamp?: number
}

export default function MessageBubble({ sender, content, isSelf, timestamp }: MessageBubbleProps) {
  const time = timestamp ? new Date(timestamp).toLocaleTimeString() : ''
  return (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} my-1`}>
      <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow ${isSelf ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'}`}>
        <div className="font-medium opacity-90">{sender} <span className="text-xs opacity-70">{time}</span></div>
        <div className="whitespace-pre-wrap break-words">{content}</div>
      </div>
    </div>
  )
}
