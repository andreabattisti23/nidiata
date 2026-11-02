import type { ReactNode } from 'react'

export function timeOfDay(d = new Date()) {
  const h = d.getHours()
  if (h >= 21 || h < 6) return 'notte' as const
  if (h < 9) return 'alba' as const
  if (h >= 18) return 'tramonto' as const
  return 'giorno' as const
}

const SKY = {
  notte: 'linear-gradient(#1e1b4b, #4338ca)',
  alba: 'linear-gradient(#fbcfe8, #fde68a)',
  giorno: 'linear-gradient(#7dd3fc, #e0f2fe)',
  tramonto: 'linear-gradient(#f97316, #f9a8d4)',
}

/** La stanza di casa: parete, finestra con cielo che cambia con l'ora, pavimento. */
export function Room({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  const tod = timeOfDay()
  const night = tod === 'notte'
  return (
    <div className="relative overflow-hidden rounded-3xl border-[3px] border-ink shadow-[5px_5px_0_var(--color-ink)]" style={{ background: night ? '#5b4b8a' : '#ffe8d6' }}>
      {/* carta da parati */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: `radial-gradient(${night ? '#fff' : '#ff8fab'} 2px, transparent 2px)`, backgroundSize: '28px 28px' }}
      />
      {/* finestra */}
      <div className={`absolute left-4 top-4 overflow-hidden rounded-2xl border-[3px] border-ink sm:left-8 ${compact ? 'h-20 w-24' : 'h-28 w-32 sm:h-32 sm:w-40'}`} style={{ background: SKY[tod] }}>
        {night ? (
          <>
            <div className="absolute right-4 top-3 h-9 w-9 rounded-full bg-[#fff9c4] shadow-[0_0_20px_#fff9c4]" />
            <div className="absolute right-2 top-2 h-8 w-8 rounded-full" style={{ background: '#2e2a6b' }} />
            {[[12, 20], [40, 50], [20, 70], [60, 30]].map(([x, y], i) => (
              <span key={i} className="absolute text-[10px] text-yellow-100" style={{ left: `${x}%`, top: `${y}%` }}>✦</span>
            ))}
          </>
        ) : (
          <>
            <div className={`sun-spin absolute right-3 top-3 h-10 w-10 rounded-full border-2 border-ink ${tod === 'tramonto' ? 'bg-[#ff922b]' : 'bg-[#ffd43b]'}`} style={{ boxShadow: '0 0 0 6px #ffe06655' }} />
            <div className="cloud absolute top-10 h-5 w-14 rounded-full bg-white/90" />
          </>
        )}
        <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-ink" />
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-ink" />
      </div>
      {/* quadretto e lampada */}
      <div className="absolute right-6 top-6 hidden h-16 w-14 rotate-3 rounded-lg border-[3px] border-ink bg-white p-1 sm:block">
        <div className="grid h-full w-full place-items-center rounded bg-mint text-xl">🌷</div>
      </div>
      <div className="absolute right-28 top-0 hidden sm:block">
        <div className="mx-auto h-8 w-[3px] bg-ink" />
        <div className={`h-6 w-14 rounded-t-full border-[3px] border-ink ${night ? 'bg-[#ffe066] shadow-[0_10px_40px_#ffe066]' : 'bg-lilac'}`} />
      </div>
      {/* pavimento */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] border-t-[3px] border-ink" style={{ background: night ? '#8a6a9e' : '#e8b98a', backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 58px, rgba(43,33,64,.18) 58px 61px)' }} />
      <div className="absolute bottom-4 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] border-[3px] border-ink/60" style={{ background: night ? '#b197fc66' : '#ff8fab66' }} />
      <div className={`relative ${compact ? 'min-h-[220px]' : 'min-h-[300px] sm:min-h-[340px]'}`}>{children}</div>
    </div>
  )
}
