import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Avatar, Face } from '../components/Avatar'
import { Wardrobe } from '../components/Wardrobe'
import { Section } from '../components/ui'
import { useAct, timeAgo } from '../lib/hooks'
import { forgetFamily } from '../lib/identity'
import { useSession } from '../lib/session'
import { RestyleModal } from './Kid'
import { InviteModal } from './SessionLayout'

export function ProfilePage() {
  const { state, me, sessionId } = useSession()
  const act = useAct(sessionId)
  const navigate = useNavigate()
  const [style, setStyle] = useState(false)
  const [invite, setInvite] = useState(false)
  const [famName, setFamName] = useState(state.familyName)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Section title="🙋 Il tuo personaggio" right={<button className="chip" onClick={() => setStyle(true)}>🎨 Aspetto</button>}>
        <div className="mb-4 grid place-items-center rounded-3xl border-[3px] border-ink bg-gradient-to-b from-sky to-white py-4">
          <Avatar look={me} outfit={me.outfit} stage="adulto" mood="felice" size={170} />
          <p className="mt-1 text-xl font-bold">{me.name}</p>
        </div>
        <Wardrobe target={{ type: 'parent', id: me.id }} outfit={me.outfit} />
      </Section>

      <div className="space-y-4">
        <Section title="👨‍👩‍👧 La famiglia">
          <ul className="space-y-2">
            {state.parents.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-2">
                <Face look={p} outfit={p.outfit} d={48} />
                <div className="flex-1">
                  <p className="font-bold">{p.name} {p.id === me.id && '(tu)'}</p>
                  <p className="text-xs opacity-60">Visto {timeAgo(p.lastSeen)}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn-soft mt-3 w-full" onClick={() => setInvite(true)}>💌 Link di invito</button>
        </Section>

        <Section title="✏️ Nome della famiglia">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              act.mutate({ type: 'renameFamily', name: famName })
            }}
          >
            <input className="input" maxLength={28} value={famName} onChange={(e) => setFamName(e.target.value)} />
            <button className="btn-primary" disabled={!famName.trim() || famName === state.familyName}>Salva</button>
          </form>
        </Section>

        <Section title="📱 Questo dispositivo">
          <p className="text-sm opacity-75">
            Il tuo "posto" in famiglia è salvato in questo browser. Per giocare da un altro telefono, apri il link di invito ed entra come nuovo genitore.
          </p>
          <button
            className="btn-soft mt-3 w-full bg-[#ffd6d6]"
            onClick={() => {
              if (confirm('Vuoi scollegare questo dispositivo dalla famiglia? La famiglia continuerà a esistere.')) {
                forgetFamily(sessionId)
                navigate({ to: '/' })
              }
            }}
          >
            Esci da questo dispositivo
          </button>
        </Section>
      </div>

      <RestyleModal open={style} onClose={() => setStyle(false)} initial={me} stage="adulto" outfit={me.outfit} onSave={(l) => act.mutate({ type: 'restyle', target: { type: 'parent', id: me.id }, ...l })} />
      <InviteModal open={invite} onClose={() => setInvite(false)} sessionId={sessionId} alone={state.parents.length < 2} />
    </div>
  )
}
