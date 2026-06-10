import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../App'

export default function Bote() {
  const { participant } = useApp()
  const [participants, setParticipants] = useState([])
  const [settings, setSettings] = useState({
    entry_fee: 10,
    first_pct: 60,
    second_pct: 30,
    third_pct: 10,
  })
  const [loading, setLoading] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [editingSettings, setEditingSettings] = useState(false)

  useEffect(() => {
    loadData()
    const sub = supabase
      .channel('bote-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, loadData)
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [])

  async function loadData() {
    // Participantes
    const { data: pList } = await supabase
      .from('participants')
      .select('id, name, has_paid')
      .order('name')

    // Configuración del bote
    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'bote_config')
      .maybeSingle()

    setParticipants(pList || [])
    if (settingsData?.value) {
      setSettings(settingsData.value)
    }
    setLoading(false)
  }

  async function togglePaid(playerId, currentStatus) {
    if (!participant.isAdmin) return
    await supabase
      .from('participants')
      .update({ has_paid: !currentStatus })
      .eq('id', playerId)
    await loadData()
  }

  async function saveSettings() {
    setSavingSettings(true)
    const total = settings.first_pct + settings.second_pct + settings.third_pct
    if (total !== 100) {
      alert(`Los porcentajes deben sumar 100%. Ahora suman ${total}%`)
      setSavingSettings(false)
      return
    }
    await supabase
      .from('settings')
      .upsert({ key: 'bote_config', value: settings }, { onConflict: 'key' })
    setSavingSettings(false)
    setEditingSettings(false)
    await loadData()
  }

  const paidCount = participants.filter(p => p.has_paid).length
  const totalBote = paidCount * settings.entry_fee
  const prize1 = Math.round(totalBote * settings.first_pct / 100)
  const prize2 = Math.round(totalBote * settings.second_pct / 100)
  const prize3 = Math.round(totalBote * settings.third_pct / 100)

  // Ajustar redondeo
  const roundingAdj = totalBote - (prize1 + prize2 + prize3)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-sm">Cargando bote...</div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-xl font-black text-white mb-4">💰 Bote</h1>

      {/* Bote total */}
      <div className="bg-card rounded-2xl p-5 border border-border mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Bote Total</div>
        <div className="text-5xl font-black text-white mb-1">{totalBote} €</div>
        <div className="text-sm text-gray-400">
          {paidCount} de {participants.length} han pagado · {settings.entry_fee} € por persona
        </div>

        {/* Barra pagados */}
        <div className="mt-3 h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: participants.length > 0 ? `${(paidCount / participants.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Reparto del bote */}
      <div className="bg-card rounded-2xl p-4 border border-border mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-300">Reparto del bote</div>
          {participant.isAdmin && (
            <button
              onClick={() => setEditingSettings(!editingSettings)}
              className="text-xs text-gold px-2 py-1 rounded-lg border border-gold/30 active:scale-95"
            >
              {editingSettings ? '✕ Cancelar' : '✏️ Editar'}
            </button>
          )}
        </div>

        {editingSettings ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Cuota por persona (€)</label>
              <input
                type="number" min="1"
                value={settings.entry_fee}
                onChange={e => setSettings({ ...settings, entry_fee: parseInt(e.target.value) || 0 })}
                className="w-full bg-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'first_pct', label: '🥇 1º', color: 'text-gold' },
                { key: 'second_pct', label: '🥈 2º', color: 'text-silver' },
                { key: 'third_pct', label: '🥉 3º', color: 'text-bronze' },
              ].map(({ key, label, color }) => (
                <div key={key}>
                  <label className={`text-xs font-bold ${color} mb-1 block`}>{label}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number" min="0" max="100"
                      value={settings[key]}
                      onChange={e => setSettings({ ...settings, [key]: parseInt(e.target.value) || 0 })}
                      className="w-full bg-border rounded-xl px-2 py-2 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-gray-400 text-sm">%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`text-xs text-center ${settings.first_pct + settings.second_pct + settings.third_pct === 100 ? 'text-accent' : 'text-red-400'}`}>
              Total: {settings.first_pct + settings.second_pct + settings.third_pct}% {settings.first_pct + settings.second_pct + settings.third_pct === 100 ? '✓' : '(debe ser 100%)'}
            </div>
            <button
              onClick={saveSettings}
              disabled={savingSettings}
              className="w-full py-2.5 bg-accent text-black font-black text-sm rounded-xl active:scale-95 disabled:opacity-40"
            >
              {savingSettings ? 'Guardando...' : '💾 Guardar cambios'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {[
              { label: '🥇 1er puesto', pct: settings.first_pct, amount: prize1 + roundingAdj, color: 'bg-gold/20 text-gold border-gold/30' },
              { label: '🥈 2º puesto', pct: settings.second_pct, amount: prize2, color: 'bg-gray-500/20 text-silver border-gray-500/30' },
              { label: '🥉 3er puesto', pct: settings.third_pct, amount: prize3, color: 'bg-orange-900/20 text-bronze border-orange-500/30' },
            ].map(({ label, pct, amount, color }) => (
              <div key={label} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${color}`}>
                <span className="font-bold text-sm">{label}</span>
                <div className="text-right">
                  <span className="font-black text-base">{amount} €</span>
                  <span className="text-xs opacity-70 ml-1">({pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de participantes */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-bold text-gray-300">Participantes</span>
          <span className="text-xs text-gray-500">{participants.length} total</span>
        </div>
        {participants.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">No hay participantes aún</div>
        ) : (
          <div>
            {participants.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center justify-between px-4 py-3 ${i < participants.length - 1 ? 'border-b border-border' : ''}`}
              >
                <span className={`text-sm font-medium ${p.id === participant.id ? 'text-accent' : 'text-white'}`}>
                  {p.name} {p.id === participant.id && <span className="text-gray-500">(tú)</span>}
                </span>
                <div className="flex items-center gap-2">
                  {p.has_paid ? (
                    <span className="text-xs bg-green-900/40 text-green-400 px-2.5 py-1 rounded-full font-bold">
                      ✓ Pagado
                    </span>
                  ) : (
                    <span className="text-xs bg-red-900/40 text-red-400 px-2.5 py-1 rounded-full font-bold">
                      ✗ Pendiente
                    </span>
                  )}
                  {participant.isAdmin && (
                    <button
                      onClick={() => togglePaid(p.id, p.has_paid)}
                      className="text-xs bg-border px-2 py-1 rounded-lg text-gray-400 active:scale-95"
                    >
                      {p.has_paid ? 'Desmarcar' : 'Marcar pagado'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nota */}
      <div className="mt-4 p-4 rounded-xl border border-dashed border-border">
        <p className="text-xs text-gray-500 text-center">
          💡 El dinero lo movéis vosotros (Bizum, efectivo...). La app solo lleva la cuenta.
        </p>
      </div>
    </div>
  )
}
