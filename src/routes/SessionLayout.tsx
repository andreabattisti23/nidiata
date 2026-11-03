import { Link, Navigate, Outlet, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Face } from '../components/Avatar'
import { Coins, Modal, Spinner } from '../components/ui'
import { isLocalMode } from '../lib/api'
import { useFamily } from '../lib/hooks'
import { forgetFamily, getPlayerId, inviteUrl, rememberFamily } from '../lib/identity'
import { SessionContext } from '../lib/session'
import { toast } from '../lib/toast'
import { useT } from '../i18n'

const TABS = [
  { to: '/s/$sessionId', label: 'tab.house', emoji: '🏠', exact: true },
  { to: '/s/$sessionId/imprevisti', label: 'tab.events', emoji: '🎲' },
  { to: '/s/$sessionId/negozio', label: 'tab.shop', emoji: '🛍️' },
  { to: '/s/$sessionId/soldini', label: 'tab.money', emoji: '🪙' },
  { to: '/s/$sessionId/diario', label: 'tab.diary', emoji: '📔' },
  { to: '/s/$sessionId/trofei', label: 'tab.trophies', emoji: '🏆' },
] as const

export function SessionLayout() {
  const { sessionId } = useParams({ from: '/s/$sessionId' })
  const search = useSearch({ from: '/s/$sessionId' })
  const navigate = useNavigate()
  const playerId = getPlayerId(sessionId)
  const q = useFamily(sessionId)
  const [invite, setInvite] = useState(false)
  const seen = useRef<string | null>(null)
  const { t, log } = useT()

  const state = q.data
  const me = useMemo(() => state?.parents.find((p) => p.id === playerId), [state, playerId])

  useEffect(() => {
    if (state && me) rememberFamily(state.id, state.familyName)
  }, [state?.familyName, me?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (search.benvenuto && state && state.parents.length < 2) setInvite(true)
    if (search.benvenuto) navigate({ to: '/s/$sessionId', params: { sessionId }, search: {}, replace: true })
  }, [search.benvenuto, !!state]) // eslint-disable-line react-hooks/exhaustive-deps

  // notifiche solo per quello che fa l'altro genitore (le proprie azioni hanno già il loro messaggio)
  useEffect(() => {
    if (!state || !me) return
    const top = state.log[0]?.id ?? null
    if (seen.current === null) {
      seen.current = top
      return
    }
    if (top === seen.current) return
    const idx = state.log.findIndex((l) => l.id === seen.current)
    const fresh = (idx === -1 ? state.log.slice(0, 3) : state.log.slice(0, idx)).filter((l) => l.who && l.who !== me.id)
    fresh.slice(0, 2).reverse().forEach((l) => toast(log(l), l.emoji))
    seen.current = top
  }, [state?.log[0]?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!playerId) return <Navigate to="/s/$sessionId/unisciti" params={{ sessionId }} />
  if (q.isPending) return <Spinner label={t('ses.opening')} />
  if (q.isError || !state)
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <div className="card max-w-sm p-6 text-center">
          <p className="text-5xl">🏚️</p>
          <h1 className="mt-2 text-2xl font-bold">{t('ses.notFound')}</h1>
          <p className="mt-1 opacity-70">{q.error?.message}</p>
          <Link to="/" className="btn-primary mt-4">{t('nf.btn')}</Link>
        </div>
      </div>
    )
  if (!me) {
    forgetFamily(sessionId)
    return <Navigate to="/s/$sessionId/unisciti" params={{ sessionId }} />
  }

  const pending = state.events.length
  const myPending = state.events.filter((e) => !e.votes[me.id]).length

  return (
    <SessionContext.Provider value={{ sessionId, state, me }}>
      <div className="mx-auto max-w-5xl px-3 pb-28 pt-3 sm:px-5 sm:pb-10">
        {isLocalMode() && (
          <div className="mb-3 rounded-2xl border-2 border-dashed border-ink bg-butter px-4 py-2 text-sm font-semibold">
            {t('ses.local')}
          </div>
        )}
        <header className="card flex flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="text-2xl" title="Home">🐣</Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold leading-tight">{state.familyName}</h1>
            <div className="flex items-center gap-3 text-sm">
              <Coins n={state.coins} />
              <span className="font-bold" title={t('ses.harmony')}>💞 {Math.round(state.harmony)}%</span>
            </div>
          </div>
          <div className="flex items-center -space-x-3">
            {state.parents.map((p) => {
              const online = Date.now() - p.lastSeen < 90_000
              return (
                <Link key={p.id} to="/s/$sessionId/io" params={{ sessionId }} className="relative" title={`${p.name}${online ? ' ' + t('ses.online') : ''}`}>
                  <Face look={p} outfit={p.outfit} d={46} className="border-[3px]" />
                  <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-ink ${online ? 'bg-[#40c057]' : 'bg-gray-300'}`} />
                </Link>
              )
            })}
          </div>
          <button className="btn-soft px-3 py-2 text-sm" onClick={() => setInvite(true)}>
            💌 <span className="hidden sm:inline">{t('ses.invite')}</span>
          </button>
        </header>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-ink bg-paper px-1 pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5 sm:static sm:mt-3 sm:rounded-3xl sm:border-[3px] sm:p-1.5 sm:shadow-[5px_5px_0_var(--color-ink)]">
          <ul className="mx-auto flex max-w-5xl justify-between gap-1">
            {TABS.map((tab) => (
              <li key={tab.to} className="min-w-0 flex-1">
                <Link
                  to={tab.to}
                  params={{ sessionId }}
                  activeOptions={{ exact: 'exact' in tab }}
                  className="relative flex flex-col items-center rounded-2xl px-0.5 py-1 text-[10px] font-semibold min-[400px]:text-[11px] transition sm:flex-row sm:justify-center sm:gap-1.5 sm:py-2 sm:text-sm"
                  activeProps={{ className: 'bg-pink' }}
                >
                  <span className="text-xl sm:text-base">{tab.emoji}</span>
                  <span className="max-w-full truncate">{t(tab.label)}</span>
                  {tab.label === 'tab.events' && pending > 0 && (
                    <span className={`absolute right-1 top-0 grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink px-1 text-[10px] font-bold text-white ${myPending ? 'badge-pulse bg-berry' : 'bg-gray-400'}`}>
                      {pending}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="mt-4">
          <Outlet />
        </main>
      </div>

      <InviteModal open={invite} onClose={() => setInvite(false)} sessionId={sessionId} alone={state.parents.length < 2} />
    </SessionContext.Provider>
  )
}

export function InviteModal({ open, onClose, sessionId, alone }: { open: boolean; onClose: () => void; sessionId: string; alone: boolean }) {
  const { t } = useT()
  const url = inviteUrl(sessionId)
  const [copied, setCopied] = useState(false)
  const text = `${t('inv.msg')} ${url}`
  return (
    <Modal open={open} onClose={onClose} title={t('inv.title')}>
      <p className="text-sm opacity-80">{alone ? t('inv.alone') : t('inv.notAlone')}</p>
      <div className="mt-3 break-all rounded-2xl border-2 border-dashed border-ink bg-white p-3 font-mono text-sm">{url}</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="btn-primary"
          onClick={async () => {
            await navigator.clipboard?.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          }}
        >
          {copied ? t('inv.copied') : t('inv.copy')}
        </button>
        <a className="btn-soft bg-mint" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button className="btn-soft col-span-2" onClick={() => navigator.share({ title: 'Nidiata', text, url }).catch(() => {})}>
            {t('inv.share')}
          </button>
        )}
      </div>
    </Modal>
  )
}
