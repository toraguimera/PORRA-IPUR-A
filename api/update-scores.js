import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

function calculatePoints(homeScore, awayScore, homePred, awayPred) {
  if (homePred === homeScore && awayPred === awayScore) return 8
  const actualWinner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw'
  const predictedWinner = homePred > awayPred ? 'home' : awayPred > homePred ? 'away' : 'draw'
  return actualWinner === predictedWinner ? 3 : 0
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const apiKey = process.env.FOOTBALL_API_KEY
  if (!apiKey) {
    return res.status(400).json({ error: 'FOOTBALL_API_KEY no configurada en Vercel' })
  }

  try {
    // Obtener partidos terminados de football-data.org
    const response = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches?status=FINISHED',
      { headers: { 'X-Auth-Token': apiKey } }
    )

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`API error ${response.status}: ${text}`)
    }

    const { matches: apiMatches } = await response.json()
    let updated = 0

    for (const m of apiMatches || []) {
      if (m.status !== 'FINISHED' || m.score?.fullTime?.home == null) continue

      const apiTime = new Date(m.utcDate)
      // Buscar partido en nuestra BD por hora de comienzo (±15 min de margen)
      const minTime = new Date(apiTime.getTime() - 15 * 60000).toISOString()
      const maxTime = new Date(apiTime.getTime() + 15 * 60000).toISOString()

      const { data: dbMatches } = await supabase
        .from('matches')
        .select('id')
        .gte('kickoff', minTime)
        .lte('kickoff', maxTime)
        .neq('status', 'finished')

      if (!dbMatches || dbMatches.length === 0) continue

      const matchId = dbMatches[0].id
      const homeScore = m.score.fullTime.home
      const awayScore = m.score.fullTime.away

      // Actualizar resultado del partido
      await supabase
        .from('matches')
        .update({ home_score: homeScore, away_score: awayScore, status: 'finished' })
        .eq('id', matchId)

      // Recalcular puntos de todas las predicciones de este partido
      const { data: preds } = await supabase
        .from('predictions')
        .select('*')
        .eq('match_id', matchId)

      for (const pred of preds || []) {
        const points = calculatePoints(homeScore, awayScore, pred.home_prediction, pred.away_prediction)
        await supabase.from('predictions').update({ points }).eq('id', pred.id)
      }

      updated++
    }

    return res.json({ success: true, updated })
  } catch (error) {
    console.error('Error actualizando resultados:', error)
    return res.status(500).json({ error: error.message })
  }
}
