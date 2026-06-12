import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../App'
import { ALL_MATCHES } from '../data/worldcup2026'
import MatchCard from '../components/MatchCard'

const FILTERS = [
  { key: 'proximos', label: 'Próximos' },
  { key: 'todos', label: 'Todos' },
  { key: 'terminados', label: 'Terminados' },
]

function formatDateKey(dateKey) {
  const [y, mo, d] = dateKey.split('-').map(Number)
  const date = new Date(y, mo - 1, d)
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function Matches() {
  const { participant } = useApp()
  const [matches, setMatches] = useState([])
  const [filter, setFilter] = useState('proximos')
  const [loading, setLoading] = useState(true)
  const [groupFilter, setGroupFilter] = useState('todos')
  const [showGroupFilter, setShowGroupFilter] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    loadMatches()
    const sub = supabase
      .channel('matches-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches' }, () => {
        loadMatches()
      })
      .subscribe()

    // Auto-actualizar si es admin (solo una vez al abrir la página)
    if (participant.isAdmin && !hasFetched.current) {
      hasFetched.current = true
      autoUpdateScores()
    }

    return () => supabase.removeChannel(sub)
  }, [])

  async function loadMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('kickoff', { ascending: true })

    if (error) {
      setMatches(ALL_MATCHES.map(m => ({
        ...m, home_score: null, away_score: null, status: 'scheduled'
      })))
    } else {
      setMatches(data)
    }
    setLoading(false)
  }

  async function autoUpdateScores() {
    try {
      await fetch('/api/update-scores')
    } catch (e) {
      // Silencioso si falla
    }
  }

  async function manualUpdate() {
    setUpdating(true)
    try {
      const res = await fetch('/api/update-scores')
      const data = await res.json()
      setLastUpdate(data.updated ?? 0)
      await loadMatches()
    } catch (e) {
      setLastUpdate(-1)
    }
    setUpdating(false)
  }

  const now = new Date()

  const filteredMatches = matches.filter(m => {
    if (filter === 'proximos' && (m.status === 'finished' || m.homeTeam === 'Por determinar')) return false
    if (filter === 'terminados' && m.status !== 'finished') return false
    if (groupFilter !== 'todos' && m.group !== groupFilter) return false
    return true
  })

  // Agrupar por fecha (hora local España UTC+2)
  const grouped = {}
  filteredMatches.forEach(m => {
    const localDate = new Date(new Date(m.kickoff).getTime() + 2 * 60 * 60 * 1000)
    const dateKey = localDate.toISOString().split('T')[0]
    if (!grouped[dateKey]) grouped[dateKey] = []
    grouped[dateKey].push(m)
  })

  const groupKeys = Object.keys(grouped).sort()

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
            <button
              onClick={manualUpdate}
              disabled={updating}
              className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full font-bold active:scale-95 disabled:opacity-50"
            >
              {updating ? '⏳' : '🔄'} {updating ? 'Actualizando...' : 'Actualizar'}
            </button>
          )}
          <button
            onClick={() => setShowGroupFilter(!showGroupFilter)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${groupFilter !== 'todos' ? 'border-accent text-accent' : 'border-border text-gray-400'}`}
          >
            {groupFilter === 'todos' ? 'Grupo ▾' : `Gr. ${groupFilter} ▾`}
          </button>
        </div>
      </div>

      {/* Mensaje de última actualización */}
      {lastUpdate !== null && participant.isAdmin && (
        <div className={`text-xs mb-3 px-3 py-1.5 rounded-lg ${lastUpdate === -1 ? 'bg-red-900/30 text-red-400' : lastUpdate === 0 ? 'bg-border text-gray-400' : 'bg-green-900/30 text-green-400'}`}>
          {lastUpdate === -1 ? '⚠️ Error al conectar con la API' : lastUpdate === 0 ? '✓ Todo al día, sin cambios nuevos' : `✅ ${lastUpdate} partido${lastUpdate > 1 ? 's' : ''} actualizado${lastUpdate > 1 ? 's' : ''}`}
        </div>
      )}

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

      {/* Lista de partidos agrupados por día */}
      {groupKeys.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <div className="text-4xl mb-3">🎉</div>
          <p>No hay partidos en esta sección</p>
        </div>
      ) : (
        groupKeys.map(dateKey => (
          <div key={dateKey} className="mb-6">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="flex-1 h-px bg-border"/>
              {formatDateKey(dateKey)}
              <span className="flex-1 h-px bg-border"/>
            </h2>
            {grouped[dateKey].map(match => (
              <MatchCard
                key={match.id}
                match={match}
                isAdmin={participant.isAdmin}
              />
            ))}
          </div>
        ))
      )}
    </div>
  )
}
