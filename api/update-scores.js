const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

const TEAM_MAP = {
  'Mexico':'México','South Africa':'Sudáfrica','South Korea':'Corea del Sur','Korea Republic':'Corea del Sur','Czechia':'Chequia','Czech Republic':'Chequia','Canada':'Canadá','Bosnia and Herzegovina':'Bosnia y Herz.','Qatar':'Catar','Switzerland':'Suiza','Brazil':'Brasil','Morocco':'Marruecos','Haiti':'Haití','Scotland':'Escocia','USA':'EE.UU.','United States':'EE.UU.','Paraguay':'Paraguay','Australia':'Australia','Turkey':'Turquía','Türkiye':'Turquía','Germany':'Alemania','Curaçao':'Curazao','Curacao':'Curazao',"Côte d'Ivoire":'Costa de Marfil','Ivory Coast':'Costa de Marfil','Ecuador':'Ecuador','Netherlands':'Países Bajos','Japan':'Japón','Sweden':'Suecia','Tunisia':'Túnez','Belgium':'Bélgica','Egypt':'Egipto','Iran':'Irán','New Zealand':'Nueva Zelanda','Spain':'España','Cape Verde':'Cabo Verde','Saudi Arabia':'Arabia Saudí','Uruguay':'Uruguay','France':'Francia','Senegal':'Senegal','Iraq':'Irak','Norway':'Noruega','Argentina':'Argentina','Algeria':'Argelia','Austria':'Austria','Jordan':'Jordania','Portugal':'Portugal','DR Congo':'DR Congo','Congo DR':'DR Congo','Uzbekistan':'Uzbekistán','Colombia':'Colombia','England':'Inglaterra','Croatia':'Croacia','Ghana':'Ghana','Panama':'Panamá',
}

function es(name) { return TEAM_MAP[name] || name }

function calculatePoints(homeScore, awayScore, homePred, awayPred) {
  if (homePred === homeScore && awayPred === awayScore) return 8
  const actualWinner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw'
  const predictedWinner = homePred > awayPred ? 'home' : awayPred > homePred ? 'away' : 'draw'
  return actualWinner === predictedWinner ? 3 : 0
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const apiKey = process.env.FOOTBALL_API_KEY
  if (!apiKey) return res.status(400).json({ error: 'FOOTBALL_API_KEY no configurada' })

  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', { headers: { 'X-Auth-Token': apiKey } })
    if (!response.ok) throw new Error(`API error ${response.status}`)
    const { matches: apiMatches } = await response.json()

    const { data: knockoutPending } = await supabase.from('matches').select('id, kickoff, status, homeTeam').neq('round', 'group').neq('status', 'finished')

    let updatedScores = 0, updatedTimes = 0

    for (const m of apiMatches || []) {
      const homeName = es(m.homeTeam?.name)
      const awayName = es(m.awayTeam?.name)
      const apiKickoff = new Date(m.utcDate).toISOString()
      const apiTime = new Date(m.utcDate).getTime()
      let dbMatch = null

      if (homeName && awayName && homeName !== 'Por determinar') {
        const { data } = await supabase.from('matches').select('id, kickoff, status, homeTeam').eq('homeTeam', homeName).eq('awayTeam', awayName).maybeSingle()
        dbMatch = data
      } else if (m.stage !== 'GROUP_STAGE' && knockoutPending) {
        dbMatch = knockoutPending.find(km => Math.abs(new Date(km.kickoff).getTime() - apiTime) < 30 * 60000) || null
      }

      if (!dbMatch) continue
      const kickoffChanged = dbMatch.kickoff !== apiKickoff

      if (m.status === 'FINISHED' && m.score?.fullTime?.home != null) {
        const homeScore = m.score.fullTime.home
        const awayScore = m.score.fullTime.away
        const payload = { home_score: homeScore, away_score: awayScore, status: 'finished', kickoff: apiKickoff }
        if (homeName && homeName !== 'Por determinar') payload.homeTeam = homeName
        if (awayName && awayName !== 'Por determinar') payload.awayTeam = awayName
        await supabase.from('matches').update(payload).eq('id', dbMatch.id)
        const { data: preds } = await supabase.from('predictions').select('*').eq('match_id', dbMatch.id)
        for (const pred of preds || []) {
          await supabase.from('predictions').update({ points: calculatePoints(homeScore, awayScore, pred.home_prediction, pred.away_prediction) }).eq('id', pred.id)
        }
        updatedScores++
      } else if (dbMatch.status !== 'finished') {
        const payload = {}
        if (kickoffChanged) payload.kickoff = apiKickoff
        if (homeName && homeName !== 'Por determinar' && dbMatch.homeTeam === 'Por determinar') payload.homeTeam = homeName
        if (awayName && awayName !== 'Por determinar') payload.awayTeam = awayName
        if (Object.keys(payload).length > 0) { await supabase.from('matches').update(payload).eq('id', dbMatch.id); updatedTimes++ }
      }
    }
    return res.json({ success: true, updatedScores, updatedTimes })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
