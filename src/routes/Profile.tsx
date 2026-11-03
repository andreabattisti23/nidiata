import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Avatar, Face } from '../components/Avatar'
import { LangGrid } from '../components/LangPicker'
import { Wardrobe } from '../components/Wardrobe'
import { Section } from '../components/ui'
import { useT } from '../i18n'
import { timeAgo, useAct } from '../lib/hooks'
import { forgetFamily } from '../lib/identity'
import { useSession } from '../lib/session'
import { RestyleModal } from './Kid'
import { InviteModal } from './SessionLayout'

export function ProfilePage() {
  const { state, me, sessionId } = useSession()
  const { t } = useT()
  const act = useAct(sessionId)
  const navigate = useNavigate()
  const [style, setStyle] = useState(false)
  const [invite, setInvite] = useState(false)
  const [famName, setFamName] = useState(state.familyName)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Section title={t('pr.char')} right={<button className="chip" onClick={() => setStyle(true)}>{t('kid.look')}</button>}>
        <div className="mb-4 grid place-items-center rounded-3xl border-[3px] border-ink bg-gradient-to-b from-sky to-white py-4">
          <Avatar look={me} outfit={me.outfit} stage="adulto" mood="felice" size={170} />
          <p className="mt-1 text-xl font-bold">{me.name}</p>
        </div>
        <Wardrobe target={{ type: 'parent', id: me.id }} outfit={me.outfit} />
      </Section>

      <div className="space-y-4">
        <Section title={t('pr.family')}>
          <ul className="space-y-2">
            {state.parents.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-2">
                <Face look={p} outfit={p.outfit} d={48} />
                <div className="flex-1">
                  <p className="font-bold">
                    {p.name} {p.id === me.id && t('common.you')}
                  </p>
                  <p className="text-xs opacity-60">{t('pr.seen', { t: timeAgo(p.lastSeen) })}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn-soft mt-3 w-full" onClick={() => setInvite(true)}>
            {t('pr.invite')}
          </button>
        </Section>

        <Section title={t('pr.lang')}>
          <LangGrid />
        </Section>

        <Section title={t('pr.famName')}>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              act.mutate({ type: 'renameFamily', name: famName })
            }}
          >
            <input className="input" maxLength={28} value={famName} onChange={(e) => setFamName(e.target.value)} />
            <button className="btn-primary" disabled={!famName.trim() || famName === state.familyName}>
              {t('common.save')}
            </button>
          </form>
        </Section>

        <Section title={t('pr.device')}>
          <p className="text-sm opacity-75">{t('pr.deviceText')}</p>
          <button
            className="btn-soft mt-3 w-full bg-[#ffd6d6]"
            onClick={() => {
              if (confirm(t('pr.leaveConfirm'))) {
                forgetFamily(sessionId)
                navigate({ to: '/' })
              }
            }}
          >
            {t('pr.leave')}
          </button>
        </Section>
      </div>

      <RestyleModal open={style} onClose={() => setStyle(false)} initial={me} stage="adulto" outfit={me.outfit} onSave={(l) => act.mutate({ type: 'restyle', target: { type: 'parent', id: me.id }, ...l })} />
      <InviteModal open={invite} onClose={() => setInvite(false)} sessionId={sessionId} alone={state.parents.length < 2} />
    </div>
  )
}
