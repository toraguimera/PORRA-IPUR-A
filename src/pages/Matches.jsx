import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../App'
import { ALL_MATCHES, ROUND_LABELS, GROUPS } from '../data/worldcup2026'
import MatchCard from '../components/MatchCard'

const FILTERS = [
  { key: 'proximos', label: 'Próximos' },
  { key: 'todos', label: 'Todos' },
  { key: 'terminados', label: 'Terminados' },
]

export default function Matches() {
  const { participant } = useApp()
  const [matches, setMatches] = useState([]) // matches from DB (with scores/status)
  const [filter, setFilter] = useState('proximos')
  const [loading, setLoading] = useState(true)
  const [groupFilter, setGroupFilter] = useState('todos')
  const [showGroupFilter, setShowGroupFilter] = useState(false)

  useEffect(() => {
    loadMatches()
    // Suscribirse a cambios en tiempo real
    const sub = supabase
      .channel('matches-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches' }, () => {
        loadMatches()
      })
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [])

  async function loadMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('kickoff', { ascending: true })

    if (error) {
      console.error('Error cargando partidos:', error)
      // Usar datos locales como fallback
      setMatches(ALL_MATCHES.map(m => ({
        ...m,
        home_score: null, away_score: null, status: 'scheduled'
      })))
    } else {
      setMatches(data)
    }
    setLoading(false)
  }

  const now = new Date()

  const filteredMatches = matches.filter(m => {
    const kickoff = new Date(m.kickoff)
    // Filtro de estado
    if (filter === 'proximos' && (m.status === 'finished' || m.homeTeam === 'Por determinar')) return false
    if (filter === 'terminados' && m.status !== 'finished') return false
    // Filtro de grupo
    if (groupFilter !== 'todos' && m.group !== groupFilter) return false
    return true
  })

  // Agrupar por ronda
  const grouped = {}
  filteredMatches.forEach(m => {
    const key = m.round === 'group'
      ? (m.group ? `group_${m.group}` : 'group_z')
      : m.round
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(m)
  })

  const groupKeys = Object.keys(grouped).sort((a, b) => {
    const order = ['group_A','group_B','group_C','group_D','group_E','group_F','group_G','group_H','group_I','group_J','group_K','group_L','r32','r16','qf','sf','third','final']
    return order.indexOf(a) - order.indexOf(b)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-center">
          <div className="text-3xl mb-2">⚽</div>
          <div className="text-sm">Cargando partidos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black text-white">⚽ Partidos</h1>
        <div className="flex items-center gap-2">
          {participant.isAdmin && (
            <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full font-bold">⚙️ Admin</span>
          )}
          <button
            onClick={() => setShowGroupFilter(!showGroupFilter)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${groupFilter !== 'todos' ? 'border-accent text-accent' : 'border-border text-gray-400'}`}
          >
            {groupFilter === 'todos' ? 'Grupo ▾' : `Gr. ${groupFilter} ▾`}
          </button>
        </div>
      </div>

      {/* Filtro por grupo */}
      {showGroupFilter && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {['todos', 'A','B','C','D','E','F','G','H','I','J','K','L'].map(g => (
            <button
              key={g}
              onClick={() => { setGroupFilter(g); setShowGroupFilter(false) }}
              className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${groupFilter === g ? 'bg-accent text-black' : 'bg-card border border-border text-gray-300'}`}
            >
              {g === 'todos' ? 'Todos' : `Grupo ${g}`}
            </button>
          ))}
        </div>
      )}

      {/* Filtros de estado */}
      <div className="flex gap-2 mb-4 bg-card rounded-xl p-1">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === f.key ? 'bg-bg text-white shadow' : 'text-gray-500'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de partidos */}
      {groupKeys.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <div className="text-4xl mb-3">🎉</div>
          <p>No hay partidos en esta sección</p>
        </div>
      ) : (
        groupKeys.map(key => {
          const groupMatches = grouped[key]
          const isGroupStage = key.startsWith('group_')
          const groupLetter = isGroupStage ? key.replace('group_', '') : null
          const sectionTitle = isGroupStage
            ? (GROUPS[groupLetter]?.name || 'Fase de Grupos')
            : ROUND_LABELS[key] || key

          return (
            <div key={key} className="mb-6">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-border"/>
                {sectionTitle}
                <span className="flex-1 h-px bg-border"/>
              </h2>
              {groupMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isAdmin={participant.isAdmin}
                />
              ))}
            </div>
          )
        })
      )}
    </div>
  )
}
