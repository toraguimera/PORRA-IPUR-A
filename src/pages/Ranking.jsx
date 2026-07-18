import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../App'

function getInitials(name) {
  return name.slice(0, 2).toUpperCase()
}

const COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-orange-500', 'bg-teal-500', 'bg-indigo-500', 'bg-cyan-500',
  'bg-lime-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500',
]

function getColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

function RankIcon({ position }) {
  if (position === 1) return <span className="text-2xl">🥇</span>
  if (position === 2) return <span className="text-2xl">🥈</span>
  if (position === 3) return <span className="text-2xl">🥉</span>
  return <span className="text-sm font-bold text-gray-400 w-8 text-center">{position}</span>
}

export default function Ranking() {
  const { participant } = useApp()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [playerPredictions, setPlayerPredictions] = useState([])
  const [loadingPreds, setLoadingPreds] = useState(false)
  const [totalMatches, setTotalMatches] = useState(0)
  const [finishedMatches, setFinishedMatches] = useState(0)

  useEffect(() => {
    loadRanking()
    const sub = supabase
      .channel('ranking-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'predictions' }, () => loadRanking())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => loadRanking())
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [])

  async function loadRanking() {
    const { data: participants } = await supabase
      .from('participants')
      .select(`
        id, name, has_paid,
        predictions (points)
      `)
      .order('name')

    const { count: total } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('round', 'group')
    const { count: finished } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'finished')
    setTotalMatches(total || 0)
    setFinishedMatches(finished || 0)

    if (!participants) { setLoading(false); return }

    const ranked = participants.map(p => {
      const preds = p.predictions || []
      const totalPoints = preds.reduce((sum, pr) => sum + (pr.points || 0), 0)
      const predictedCount = preds.length
      const exactCount = preds.filter(pr => pr.points === 8).length
      const winnerCount = preds.filter(pr => pr.points === 3).length
      return { ...p, totalPoints, predictedCount, exactCount, winnerCount }
    }).sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name))

    setRankings(ranked)
    setLoading(false)
  }

  async function loadPlayerPredictions(playerId) {
    setLoadingPreds(true)
    const { data } = await supabase
      .from('predictions')
      .select(`
        *,
        matches (homeTeam, awayTeam, kickoff, home_score, away_score, status, group, matchday)
      `)
      .eq('participant_id', playerId)
      .order('match_id')

    setPlayerPredictions(data || [])
    setLoadingPreds(false)
  }

  function openPlayer(player) {
    // Solo admin puede ver predicciones de otros participantes
    if (!participant.isAdmin && player.id !== participant.id) return
    setSelectedPlayer(player)
    loadPlayerPredictions(player.id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-sm">Cargando clasificación...</div>
        </div>
      </div>
    )
  }

  if (selectedPlayer) {
    return (
      <div className="px-4 pt-4">
        <button
          onClick={() => setSelectedPlayer(null)}
          className="flex items-center gap-2 text-gray-400 mb-4 active:text-white transition-colors"
        >
          <span>←</span>
          <span className="text-sm">Clasificación</span>
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-2xl ${getColor(selectedPlayer.name)} flex items-center justify-center text-lg font-black text-white`}>
            {getInitials(selectedPlayer.name)}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{selectedPlayer.name}</h2>
            <p className="text-gray-400 text-sm">
              {selectedPlayer.totalPoints} pts · {selectedPlayer.exactCount} exactos · {selectedPlayer.winnerCount} ganadores
            </p>
          </div>
        </div>

        {loadingPreds ? (
          <div className="text-center text-gray-500 py-8">Cargando...</div>
        ) : playerPredictions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-3xl mb-2">😴</div>
            <p>Aún no ha hecho ninguna porra</p>
          </div>
        ) : (
          <div className="space-y-2">
            {playerPredictions.map(pred => {
              const m = pred.matches
              if (!m) return null
              const points = pred.points
              const isFinished = m.status === 'finished'
              return (
                <div key={pred.id} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">
                      {m.group ? `Grupo ${m.group} · J${m.matchday}` : ''}
                    </div>
                    <div className="text-sm font-medium text-white">
                      {m.homeTeam} vs {m.awayTeam}
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      Porra: <span className="text-accent font-bold">{pred.home_prediction} - {pred.away_prediction}</span>
                      {isFinished && (
                        <span className="ml-2 text-gray-400">
                          Real: <span className="text-white">{m.home_score} - {m.away_score}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    {isFinished && points !== null ? (
                      <span className={`text-sm font-black px-2.5 py-1 rounded-full ${
                        points === 8 ? 'bg-gold text-black' :
                        points === 3 ? 'bg-blue-500 text-white' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {points === 8 ? '⭐ +8' : points === 3 ? '+3' : '0'}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">pendiente</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-black text-white">🏆 Clasificación</h1>
        <div className="text-xs text-gray-500 text-right">
          <div>{finishedMatches}/{totalMatches} partidos</div>
          <div>jugados</div>
        </div>
      </div>

      <div className="h-1 bg-border rounded-full mb-5">
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: totalMatches > 0 ? `${(finishedMatches / totalMatches) * 100}%` : '0%' }}
        />
      </div>

      <div className="flex gap-3 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold inline-block"/>8 pts exacto</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>3 pts ganador</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-700 inline-block"/>0 pts fallo</span>
      </div>

      {rankings.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <div className="text-4xl mb-3">👥</div>
          <p>Aún no hay participantes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rankings.map((player, index) => {
            const position = index + 1
            const isMe = player.id === participant.id
            const canViewPredictions = participant.isAdmin || isMe
            return (
              <div
                key={player.id}
                onClick={() => openPlayer(player)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  canViewPredictions ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
                } ${
                  isMe ? 'bg-accent/10 border-accent/50' : 'bg-card border-border'
                }`}
              >
                <div className="w-8 flex items-center justify-center flex-shrink-0">
                  <RankIcon position={position} />
                </div>

                <div className={`w-10 h-10 rounded-xl ${getColor(player.name)} flex items-center justify-center text-sm font-black text-white flex-shrink-0`}>
                  {getInitials(player.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm truncate ${isMe ? 'text-accent' : 'text-white'}`}>
                      {player.name}
                      {isMe && <span className="text-xs ml-1">(tú)</span>}
                    </span>
                    {player.has_paid && (
                      <span className="text-xs bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded-full flex-shrink-0">✓ pagado</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {player.predictedCount} porras · ⭐{player.exactCount} exactos
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className={`text-xl font-black ${
                    position === 1 ? 'text-gold' :
                    position === 2 ? 'text-silver' :
                    position === 3 ? 'text-bronze' :
                    isMe ? 'text-accent' : 'text-white'
                  }`}>
                    {player.totalPoints}
                  </div>
                  <div className="text-xs text-gray-500">pts</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
