import { useState, useCallback } from 'react'

export type Toast = { id: string; title: string; description?: string; variant?: 'default' | 'success' | 'destructive' }

const uid = () => Math.random().toString(36).slice(2, 10)

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const nt = { id: uid(), variant: 'default' as const, ...t }
    setToasts(prev => [...prev, nt])
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== nt.id))
    }, 3200)
  }, [])

  const remove = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  return { toasts, push, remove }
}
