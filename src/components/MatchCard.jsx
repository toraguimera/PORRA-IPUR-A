import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../App'
import { FLAGS, calculatePoints } from '../data/worldcup2026'

function formatKickoff(isoString) {
  const d = new Date(isoString)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow = d.toDateString() === tomorrow.toDateString()

  const dayStr = isToday ? 'Hoy' : isTomorrow ? 'Mañana'
    : d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const timeStr = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' })

  return { dayStr, timeStr }
}

function PointsBadge({ points }) {
  if (points === null || points === undefined) return null
  const color = points === 8 ? 'bg-gold text-black' : points === 3 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
  return (
    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${color}`}>
      {points === 8 ? '⭐ +8' : points === 3 ? '+3' : '0'}
    </span>
  )
}

export default function MatchCard({ match, isAdmin }) {
  const { participant } = useApp()
  const [homePred, setHomePred] = useState('')
  const [awayPred, setAwayPred] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [predPoints, setPredPoints] = useState(null)
  const [adminHomeScore, setAdminHomeScore] = useState('')
  const [adminAwayScore, setAdminAwayScore] = useState('')
  const [savingAdmin, setSavingAdmin] = useState(false)

  const kickoffDate = new Date(match.kickoff)
  const now = new Date()
  const hasStarted = kickoffDate <= now
  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'
  const { dayStr, timeStr } = formatKickoff(match.kickoff)

  // Cargar predicción del usuario
  useEffect(() => {
    if (!participant) return
    loadPrediction()
  }, [match.id, participant?.id])

  async function loadPrediction() {
    const { data } = await supabase
      .from('predictions')
      .select('*')
      .eq('participant_id', participant.id)
      .eq('match_id', match.id)
      .maybeSingle()

    if (data) {
      setHomePred(String(data.home_prediction))
      setAwayPred(String(data.away_prediction))
      setPredPoints(data.points)
      setSaved(true)
    }
  }

  async function savePrediction() {
    if (homePred === '' || awayPred === '') return
    if (hasStarted) return
    setSaving(true)
    const { error } = await supabase
      .from('predictions')
      .upsert({
        participant_id: participant.id,
        match_id: match.id,
        home_prediction: parseInt(homePred),
        away_prediction: parseInt(awayPred),
        points: null,
      }, { onConflict: 'participant_id,match_id' })

    if (!error) {
      setSaved(true)
    }
    setSaving(false)
  }

  async function saveAdminScore() {
    if (adminHomeScore === '' || adminAwayScore === '') return
    setSavingAdmin(true)
    const { error } = await supabase
      .from('matches')
      .update({
        home_score: parseInt(adminHomeScore),
        away_score: parseInt(adminAwayScore),
        status: 'finished',
      })
      .eq('id', match.id)

    if (!error) {
      // Actualizar puntos de todos los que hicieron porra en este partido
      await recalculatePoints(parseInt(adminHomeScore), parseInt(adminAwayScore))
    }
    setSavingAdmin(false)
  }

  async function recalculatePoints(homeScore, awayScore) {
    const { data: preds } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', match.id)

    if (!preds) return
    for (const pred of preds) {
      const pts = calculatePoints(homeScore, awayScore, pred.home_prediction, pred.away_prediction)
      await supabase
        .from('predictions')
        .update({ points: pts })
        .eq('id', pred.id)
    }
  }

  const homeFlag = FLAGS[match.homeTeam] || '🏳️'
  const awayFlag = FLAGS[match.awayTeam] || '🏳️'
  const isPorDeterminar = match.homeTeam === 'Por determinar'

  return (
    <div className={`bg-card rounded-2xl p-4 border ${isLive ? 'border-red-500' : saved && !hasStarted ? 'border-accent/50' : 'border-border'} mb-3`}>
      {/* Header: grupo + fecha */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {match.group && (
            <span className="text-xs font-bold bg-border px-2 py-0.5 rounded-full text-gray-300">
              Grupo {match.group}
              {match.matchday ? ` · J${match.matchday}` : ''}
            </span>
          )}
          {match.label && !match.group && (
            <span className="text-xs font-bold bg-border px-2 py-0.5 rounded-full text-gray-300">
              {match.label}
            </span>
          )}
        </div>
        <div className="text-right">
          {isLive ? (
            <span className="text-xs font-bold text-red-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 live-dot inline-block"/>EN DIRECTO
            </span>
          ) : isFinished ? (
            <span className="text-xs text-gray-500">Finalizado</span>
          ) : (
            <span className="text-xs text-gray-400">
              <span className="font-medium text-white">{dayStr}</span> · {timeStr}
            </span>
          )}
        </div>
      </div>

      {/* Equipos + marcador */}
      <div className="flex items-center justify-between gap-2">
        {/* Local */}
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1">{isPorDeterminar ? '❓' : homeFlag}</div>
          <div className="text-xs font-semibold text-white leading-tight">{match.homeTeam}</div>
        </div>

        {/* Resultado / Porra */}
        <div className="flex-shrink-0 text-center min-w-[100px]">
          {isFinished || isLive ? (
            <div>
              <div className="flex items-center justify-center gap-2 text-3xl font-black">
                <span className={match.home_score > match.away_score ? 'text-white' : 'text-gray-400'}>
                  {match.home_score}
                </span>
                <span className="text-gray-500 text-xl">-</span>
                <span className={match.away_score > match.home_score ? 'text-white' : 'text-gray-400'}>
                  {match.away_score}
                </span>
              </div>
              {saved && (
                <div className="mt-1 flex flex-col items-center gap-1">
                  <div className="text-gray-400 text-xs">
                    Tu porra: <span className="text-white">{homePred} - {awayPred}</span>
                  </div>
                  <PointsBadge points={predPoints} />
                </div>
              )}
            </div>
          ) : (
            <div>
              {saved && !hasStarted ? (
                <div>
                  <div className="flex items-center justify-center gap-1 text-accent font-black text-2xl">
                    <span>{homePred}</span>
                    <span className="text-gray-500 text-lg">-</span>
                    <span>{awayPred}</span>
                  </div>
                  <div className="text-xs text-accent mt-0.5">✓ Guardado</div>
                </div>
              ) : hasStarted ? (
                <div className="text-gray-500 text-sm text-center">
                  <div className="text-xl">⏰</div>
                  <div className="text-xs">Sin porra</div>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={homePred}
                    onChange={(e) => { setHomePred(e.target.value); setSaved(false) }}
                    className="score-input"
                    placeholder="0"
                  />
                  <span className="text-gray-500 font-bold">-</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={awayPred}
                    onChange={(e) => { setAwayPred(e.target.value); setSaved(false) }}
                    className="score-input"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visitante */}
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1">{isPorDeterminar ? '❓' : awayFlag}</div>
          <div className="text-xs font-semibold text-white leading-tight">{match.awayTeam}</div>
        </div>
      </div>

      {/* Botón guardar */}
      {!hasStarted && !isPorDeterminar && (homePred !== '' || awayPred !== '') && !saved && (
        <button
          onClick={savePrediction}
          disabled={saving || homePred === '' || awayPred === ''}
          className="w-full mt-3 py-2.5 bg-accent text-black font-black text-sm rounded-xl active:scale-95 transition-all disabled:opacity-40"
        >
          {saving ? 'Guardando...' : '💾 Guardar porra'}
        </button>
      )}

      {/* Panel admin para introducir resultado */}
      {isAdmin && !isFinished && !isPorDeterminar && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-gray-500 mb-2">⚙️ Resultado real (admin)</p>
          <div className="flex items-center gap-2">
            <input
              type="number" min="0" max="99"
              value={adminHomeScore}
              onChange={(e) => setAdminHomeScore(e.target.value)}
              className="score-input text-sm"
              placeholder="0"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number" min="0" max="99"
              value={adminAwayScore}
              onChange={(e) => setAdminAwayScore(e.target.value)}
              className="score-input text-sm"
              placeholder="0"
            />
            <button
              onClick={saveAdminScore}
              disabled={savingAdmin || adminHomeScore === '' || adminAwayScore === ''}
              className="flex-1 py-2 bg-gold text-black font-bold text-sm rounded-xl active:scale-95 transition-all disabled:opacity-40"
            >
              {savingAdmin ? '...' : '✓ Confirmar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
