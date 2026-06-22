import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Traducción de nombres en inglés (API) → español (nuestra BD)
const TEAM_MAP = {
  'Mexico': 'México',
  'South Africa': 'Sudáfrica',
  'South Korea': 'Corea del Sur',
  'Korea Republic': 'Corea del Sur',
  'Czechia': 'Chequia',
  'Czech Republic': 'Chequia',
  'Canada': 'Canadá',
  'Bosnia and Herzegovina': 'Bosnia y Herz.',
  'Qatar': 'Catar',
  'Switzerland': 'Suiza',
  'Brazil': 'Brasil',
  'Morocco': 'Marruecos',
  'Haiti': 'Haití',
  'Scotland': 'Escocia',
  'USA': 'EE.UU.',
  'United States': 'EE.UU.',
  'Paraguay': 'Paraguay',
  'Australia': 'Australia',
  'Turkey': 'Turquía',
  'Türkiye': 'Turquía',
  'Germany': 'Alemania',
  'Curaçao': 'Curazao',
  'Curacao': 'Curazao',
  "Côte d'Ivoire": 'Costa de Marfil',
  'Ivory Coast': 'Costa de Marfil',
  'Ecuador': 'Ecuador',
  'Netherlands': 'Países Bajos',
  'Japan': 'Japón',
  'Sweden': 'Suecia',
  'Tunisia': 'Túnez',
  'Belgium': 'Bélgica',
  'Egypt': 'Egipto',
  'Iran': 'Irán',
  'New Zealand': 'Nueva Zelanda',
  'Spain': 'España',
  'Cape Verde': 'Cabo Verde',
  'Saudi Arabia': 'Arabia Saudí',
  'Uruguay': 'Uruguay',
  'France': 'Francia',
  'Senegal': 'Senegal',
  'Iraq': 'Irak',
  'Norway': 'Noruega',
  'Argentina': 'Argentina',
  'Algeria': 'Argelia',
  'Austria': 'Austria',
  'Jordan': 'Jordania',
  'Portugal': 'Portugal',
  'DR Congo': 'DR Congo',
  'Congo DR': 'DR Congo',
  'Uzbekistan': 'Uzbekistán',
  'Colombia': 'Colombia',
  'England': 'Inglaterra',
  'Croatia': 'Croacia',
  'Ghana': 'Ghana',
  'Panama': 'Panamá',
}

function es(name) {
  return TEAM_MAP[name] || name
}

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
    // Obtener TODOS los partidos del Mundial (terminados y programados)
    const response = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches',
      { headers: { 'X-Auth-Token': apiKey } }
    )

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`API error ${response.status}: ${text}`)
    }

    const { matches: apiMatches } = await response.json()
    let updatedScores = 0
    let updatedTimes = 0

    for (const m of apiMatches || []) {
      const homeName = es(m.homeTeam?.name)
      const awayName = es(m.awayTeam?.name)

      if (!homeName || !awayName || homeName === 'Por determinar') continue

      // Buscar el partido en nuestra BD por nombres de equipos
      const { data: dbMatch } = await supabase
        .from('matches')
        .select('id, kickoff, status')
        .eq('homeTeam', homeName)
        .eq('awayTeam', awayName)
        .maybeSingle()

      if (!dbMatch) continue

      const apiKickoff = new Date(m.utcDate).toISOString()
      const kickoffChanged = dbMatch.kickoff !== apiKickoff

      if (m.status === 'FINISHED' && m.score?.fullTime?.home != null) {
        // Actualizar resultado + corregir horario si cambió
        const homeScore = m.score.fullTime.home
        const awayScore = m.score.fullTime.away

        await supabase
          .from('matches')
          .update({
            home_score: homeScore,
            away_score: awayScore,
            status: 'finished',
            kickoff: apiKickoff,
          })
          .eq('id', dbMatch.id)

        // Recalcular puntos de todas las predicciones
        const { data: preds } = await supabase
          .from('predictions')
          .select('*')
          .eq('match_id', dbMatch.id)

        for (const pred of preds || []) {
          const points = calculatePoints(homeScore, awayScore, pred.home_prediction, pred.away_prediction)
          await supabase.from('predictions').update({ points }).eq('id', pred.id)
        }

        updatedScores++

      } else if (kickoffChanged && dbMatch.status !== 'finished') {
        // Solo actualizar el horario si ha cambiado y el partido no ha terminado
        await supabase
          .from('matches')
          .update({ kickoff: apiKickoff })
          .eq('id', dbMatch.id)

        updatedTimes++
      }
    }

    return res.json({ success: true, updatedScores, updatedTimes })
  } catch (error) {
    console.error('Error actualizando:', error)
    return res.status(500).json({ error: error.message })
  }
}
