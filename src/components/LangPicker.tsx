import { useState } from 'react'
import { LANGS, setLang, useLang, type Lang } from '../i18n'
import { tr } from '../i18n'

/** Bandiere disegnate in SVG (le emoji bandiera non si vedono su Windows). */
export function Flag({ lang, size = 56 }: { lang: Lang; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 60 60', className: 'block rounded-full', 'aria-hidden': true }
  const clip = `flag-${lang}`
  const body = (() => {
    switch (lang) {
      case 'it':
        return (
          <>
            <rect width="20" height="60" fill="#009246" />
            <rect x="20" width="20" height="60" fill="#fff" />
            <rect x="40" width="20" height="60" fill="#ce2b37" />
          </>
        )
      case 'es':
        return (
          <>
            <rect width="60" height="60" fill="#aa151b" />
            <rect y="15" width="60" height="30" fill="#f1bf00" />
          </>
        )
      case 'de':
        return (
          <>
            <rect width="60" height="20" fill="#000" />
            <rect y="20" width="60" height="20" fill="#dd0000" />
            <rect y="40" width="60" height="20" fill="#ffce00" />
          </>
        )
      case 'en':
        return (
          <g transform="translate(-30 0) scale(2)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" strokeWidth="2.5" />
            <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 V30 M0,15 H60" stroke="#c8102e" strokeWidth="6" />
          </g>
        )
    }
  })()
  return (
    <svg {...common}>
      <defs>
        <clipPath id={clip}>
          <circle cx="30" cy="30" r="30" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>{body}</g>
      <circle cx="30" cy="30" r="28.5" fill="none" stroke="#2b2140" strokeWidth="3" />
    </svg>
  )
}

/** Griglia di scelta lingua, usata a tutto schermo dopo l'intro e nel profilo. */
export function LangGrid({ onPick }: { onPick?: (l: Lang) => void }) {
  const lang = useLang()
  return (
    <div className="grid grid-cols-2 gap-3">
      {LANGS.map((l, i) => (
        <button
          key={l.id}
          onClick={() => {
            setLang(l.id)
            onPick?.(l.id)
          }}
          className={`lang-card card flex flex-col items-center gap-2 px-3 py-4 transition hover:-translate-y-1 ${lang === l.id ? 'bg-pink' : 'bg-white'}`}
          style={{ animationDelay: `${0.15 + i * 0.08}s` }}
        >
          <Flag lang={l.id} />
          <span className="text-lg font-bold leading-none">{l.name}</span>
          <span className="text-xs font-semibold opacity-60">{l.hello}</span>
        </button>
      ))}
    </div>
  )
}

/** Schermata a tutto schermo che compare dopo l'animazione del logo. */
export function LangScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const lang = useLang()
  const pick = () => {
    setLeaving(true)
    setTimeout(onDone, 450)
  }
  return (
    <div className={`lang-screen fixed inset-0 z-[190] grid place-items-center overflow-y-auto bg-cream p-4 ${leaving ? 'lang-out' : ''}`}>
      <div className="w-full max-w-sm py-6">
        <div className="mb-5 text-center">
          <div className="av-bob mx-auto mb-2 text-5xl">🌍</div>
          <h1 className="text-3xl font-bold">{tr('lang.title', undefined, lang)}</h1>
          <p className="mt-2 text-xs font-semibold opacity-50">
            {LANGS.filter((l) => l.id !== lang)
              .map((l) => tr('lang.title', undefined, l.id))
              .join(' · ')}
          </p>
        </div>
        <LangGrid onPick={pick} />
        <p className="mt-5 text-center text-sm opacity-60">{tr('lang.sub', undefined, lang)}</p>
      </div>
    </div>
  )
}
