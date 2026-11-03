import { useEffect, useState } from 'react'
import { tr } from '../i18n'
import { LangScreen } from './LangPicker'

const KEY = 'nidiata:intro-vista'
const PARTS = ['/intro-mark.png', '/intro-vektor.png', '/intro-fiemme.png', '/intro-studio.png']
const DURATION = 3900

function alreadySeen() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Schermata iniziale con il logo dello studio, seguita dalla scelta della lingua.
 * Si vede una volta per sessione; l'animazione si salta toccando.
 */
export function Intro() {
  const [phase, setPhase] = useState<'off' | 'loading' | 'play' | 'out' | 'lang'>(() => (alreadySeen() ? 'off' : 'loading'))

  // aspetta che le immagini siano pronte (massimo 1,5 s) così l'animazione parte pulita
  useEffect(() => {
    if (phase !== 'loading') return
    let done = false
    const go = () => !done && ((done = true), setPhase('play'))
    Promise.all(
      PARTS.map(
        (src) =>
          new Promise<void>((res) => {
            const img = new Image()
            img.onload = img.onerror = () => res()
            img.src = src
          }),
      ),
    ).then(go)
    const t = setTimeout(go, 1500)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'play') return
    const t = setTimeout(() => setPhase('out'), DURATION)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'out') return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* niente */
    }
    const t = setTimeout(() => setPhase('lang'), 600)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'play') return
    const skip = () => setPhase('out')
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [phase])

  if (phase === 'off') return null

  // la scelta lingua sta già sotto mentre il logo sfuma, così il passaggio è morbido
  const lang = phase === 'out' || phase === 'lang' ? <LangScreen onDone={() => setPhase('off')} /> : null
  if (phase === 'lang') return lang

  return (
    <>
    {lang}
    <div
      className={`intro fixed inset-0 z-[200] grid cursor-pointer place-items-center overflow-hidden bg-white ${phase === 'out' ? 'intro-out' : ''}`}
      onClick={() => phase === 'play' && setPhase('out')}
      role="presentation"
    >
      {phase !== 'loading' && (
        <>
          {/* sfondo: linee "circuito" che partono dal centro */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
            {Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * Math.PI * 2 + 0.2
              const r1 = 150
              const r2 = 300 + (i % 3) * 70
              const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1
              const xm = Math.cos(a) * (r1 + (r2 - r1) * 0.55), ym = Math.sin(a) * (r1 + (r2 - r1) * 0.55)
              const x2 = xm + (i % 2 ? 40 : -40), y2 = Math.sin(a) * r2
              const col = i % 3 === 0 ? '#f7931e' : i % 3 === 1 ? '#3b9ad9' : '#1b2a4a'
              return (
                <g key={i} className="intro-trace" style={{ animationDelay: `${0.35 + i * 0.04}s`, color: col, ['--d' as string]: `${0.35 + i * 0.04}s` }}>
                  <path d={`M ${x1} ${y1} L ${xm} ${ym} L ${x2} ${y2}`} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" pathLength={1} />
                  <circle cx={x2} cy={y2} r={7} fill="none" stroke="currentColor" strokeWidth={3} />
                </g>
              )
            })}
          </svg>

          <div className="intro-logo relative flex w-[min(74vw,330px)] flex-col items-center">
            <div className="intro-glow absolute left-1/2 top-[38%] h-[130%] w-[130%] rounded-full" />
            <div className="intro-mark relative w-full">
              <img src={PARTS[0]} alt="" className="block w-full" draggable={false} />
              <span className="intro-shine-mask pointer-events-none absolute inset-0">
                <span className="intro-shine absolute inset-0" />
              </span>
            </div>
            <img src={PARTS[1]} alt="Vektor" className="intro-line block w-full" style={{ animationDelay: '0.95s' }} draggable={false} />
            <img src={PARTS[2]} alt="Fiemme" className="intro-line block w-full" style={{ animationDelay: '1.15s' }} draggable={false} />
            <img src={PARTS[3]} alt="Game Studio" className="intro-studio block w-full" draggable={false} />
            <p className="intro-presents mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-[#1b2a4a]/70">{tr('intro.presents')}</p>
          </div>

          <p className="intro-hint absolute bottom-[max(env(safe-area-inset-bottom),20px)] text-xs font-semibold text-[#1b2a4a]/40">{tr('intro.skip')}</p>
        </>
      )}
    </div>
    </>
  )
}
