import { useEffect, useState } from 'react'

export interface Toast {
  id: number
  emoji: string
  text: string
  tone: 'info' | 'error' | 'success'
}

let list: Toast[] = []
const subs = new Set<(t: Toast[]) => void>()
let n = 0

export function toast(text: string, emoji = '✨', tone: Toast['tone'] = 'info', ms = 3800) {
  const t = { id: ++n, emoji, text, tone }
  list = [...list.slice(-3), t]
  subs.forEach((f) => f(list))
  setTimeout(() => {
    list = list.filter((x) => x.id !== t.id)
    subs.forEach((f) => f(list))
  }, ms)
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>(list)
  useEffect(() => {
    subs.add(setItems)
    return () => void subs.delete(setItems)
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-4">
      {items.map((t) => (
        <div
          key={t.id}
          className={`toast-in pointer-events-auto flex max-w-md items-start gap-2 rounded-2xl border-[3px] border-ink px-4 py-2.5 text-sm font-semibold shadow-[4px_4px_0_var(--color-ink)] ${
            t.tone === 'error' ? 'bg-[#ffd6d6]' : t.tone === 'success' ? 'bg-mint' : 'bg-white'
          }`}
        >
          <span className="text-lg leading-5">{t.emoji}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  )
}
