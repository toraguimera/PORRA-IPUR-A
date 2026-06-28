// Todos los tiempos en UTC. En España (CEST) = UTC+2
// (*) = hora estimada, no confirmada oficialmente

export const GROUPS = {
  A: { name: 'Grupo A', teams: ['México', 'Sudáfrica', 'Corea del Sur', 'Chequia'] },
  B: { name: 'Grupo B', teams: ['Canadá', 'Bosnia y Herz.', 'Catar', 'Suiza'] },
  C: { name: 'Grupo C', teams: ['Brasil', 'Marruecos', 'Haití', 'Escocia'] },
  D: { name: 'Grupo D', teams: ['EE.UU.', 'Paraguay', 'Australia', 'Turquía'] },
  E: { name: 'Grupo E', teams: ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'] },
  F: { name: 'Grupo F', teams: ['Países Bajos', 'Japón', 'Suecia', 'Túnez'] },
  G: { name: 'Grupo G', teams: ['Bélgica', 'Egipto', 'Irán', 'Nueva Zelanda'] },
  H: { name: 'Grupo H', teams: ['España', 'Cabo Verde', 'Arabia Saudí', 'Uruguay'] },
  I: { name: 'Grupo I', teams: ['Francia', 'Senegal', 'Irak', 'Noruega'] },
  J: { name: 'Grupo J', teams: ['Argentina', 'Argelia', 'Austria', 'Jordania'] },
  K: { name: 'Grupo K', teams: ['Portugal', 'DR Congo', 'Uzbekistán', 'Colombia'] },
  L: { name: 'Grupo L', teams: ['Inglaterra', 'Croacia', 'Ghana', 'Panamá'] },
}

export const FLAGS = {
  'México': '🇲🇽', 'Sudáfrica': '🇿🇦', 'Corea del Sur': '🇰🇷', 'Chequia': '🇨🇿',
  'Canadá': '🇨🇦', 'Bosnia y Herz.': '🇧🇦', 'Catar': '🇶🇦', 'Suiza': '🇨🇭',
  'Brasil': '🇧🇷', 'Marruecos': '🇲🇦', 'Haití': '🇭🇹', 'Escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'EE.UU.': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Turquía': '🇹🇷',
  'Alemania': '🇩🇪', 'Curazao': '🇨🇼', 'Costa de Marfil': '🇨🇮', 'Ecuador': '🇪🇨',
  'Países Bajos': '🇳🇱', 'Japón': '🇯🇵', 'Suecia': '🇸🇪', 'Túnez': '🇹🇳',
  'Bélgica': '🇧🇪', 'Egipto': '🇪🇬', 'Irán': '🇮🇷', 'Nueva Zelanda': '🇳🇿',
  'España': '🇪🇸', 'Cabo Verde': '🇨🇻', 'Arabia Saudí': '🇸🇦', 'Uruguay': '🇺🇾',
  'Francia': '🇫🇷', 'Senegal': '🇸🇳', 'Irak': '🇮🇶', 'Noruega': '🇳🇴',
  'Argentina': '🇦🇷', 'Argelia': '🇩🇿', 'Austria': '🇦🇹', 'Jordania': '🇯🇴',
  'Portugal': '🇵🇹', 'DR Congo': '🇨🇩', 'Uzbekistán': '🇺🇿', 'Colombia': '🇨🇴',
  'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croacia': '🇭🇷', 'Ghana': '🇬🇭', 'Panamá': '🇵🇦',
}

// FASE DE GRUPOS - 72 partidos
// ¡Los tiempos marcados con (*) son estimados y pueden no ser exactos!
export const GROUP_MATCHES = [
  // ==================== JORNADA 1 ====================
  // GRUPO A
  { id: 1, homeTeam: 'México', awayTeam: 'Sudáfrica', group: 'A', matchday: 1, kickoff: '2026-06-11T19:00:00Z', round: 'group' },
  { id: 2, homeTeam: 'Corea del Sur', awayTeam: 'Chequia', group: 'A', matchday: 1, kickoff: '2026-06-12T02:00:00Z', round: 'group' },
  // GRUPO B
  { id: 3, homeTeam: 'Canadá', awayTeam: 'Bosnia y Herz.', group: 'B', matchday: 1, kickoff: '2026-06-12T19:00:00Z', round: 'group' },
  // GRUPO D
  { id: 4, homeTeam: 'EE.UU.', awayTeam: 'Paraguay', group: 'D', matchday: 1, kickoff: '2026-06-13T01:00:00Z', round: 'group' },
  // GRUPO B (cont.)
  { id: 5, homeTeam: 'Catar', awayTeam: 'Suiza', group: 'B', matchday: 1, kickoff: '2026-06-13T19:00:00Z', round: 'group' },
  // GRUPO C
  { id: 6, homeTeam: 'Brasil', awayTeam: 'Marruecos', group: 'C', matchday: 1, kickoff: '2026-06-13T22:00:00Z', round: 'group' },
  { id: 7, homeTeam: 'Haití', awayTeam: 'Escocia', group: 'C', matchday: 1, kickoff: '2026-06-14T01:00:00Z', round: 'group' },
  // GRUPO D (cont.)
  { id: 8, homeTeam: 'Australia', awayTeam: 'Turquía', group: 'D', matchday: 1, kickoff: '2026-06-14T04:00:00Z', round: 'group' },
  // GRUPO E
  { id: 9, homeTeam: 'Alemania', awayTeam: 'Curazao', group: 'E', matchday: 1, kickoff: '2026-06-14T17:00:00Z', round: 'group' },
  // GRUPO F
  { id: 10, homeTeam: 'Países Bajos', awayTeam: 'Japón', group: 'F', matchday: 1, kickoff: '2026-06-14T20:00:00Z', round: 'group' },
  // GRUPO E (cont.)
  { id: 11, homeTeam: 'Costa de Marfil', awayTeam: 'Ecuador', group: 'E', matchday: 1, kickoff: '2026-06-14T23:00:00Z', round: 'group' },
  // GRUPO F (cont.)
  { id: 12, homeTeam: 'Suecia', awayTeam: 'Túnez', group: 'F', matchday: 1, kickoff: '2026-06-15T02:00:00Z', round: 'group' },
  // GRUPO H
  { id: 13, homeTeam: 'España', awayTeam: 'Cabo Verde', group: 'H', matchday: 1, kickoff: '2026-06-15T16:00:00Z', round: 'group' },
  // GRUPO G
  { id: 14, homeTeam: 'Bélgica', awayTeam: 'Egipto', group: 'G', matchday: 1, kickoff: '2026-06-15T19:00:00Z', round: 'group' },
  // GRUPO H (cont.)
  { id: 15, homeTeam: 'Arabia Saudí', awayTeam: 'Uruguay', group: 'H', matchday: 1, kickoff: '2026-06-15T22:00:00Z', round: 'group' },
  // GRUPO G (cont.)
  { id: 16, homeTeam: 'Irán', awayTeam: 'Nueva Zelanda', group: 'G', matchday: 1, kickoff: '2026-06-16T01:00:00Z', round: 'group' },
  // GRUPO I
  { id: 17, homeTeam: 'Francia', awayTeam: 'Senegal', group: 'I', matchday: 1, kickoff: '2026-06-16T19:00:00Z', round: 'group' },
  { id: 18, homeTeam: 'Irak', awayTeam: 'Noruega', group: 'I', matchday: 1, kickoff: '2026-06-16T22:00:00Z', round: 'group' },
  // GRUPO J
  { id: 19, homeTeam: 'Argentina', awayTeam: 'Argelia', group: 'J', matchday: 1, kickoff: '2026-06-17T01:00:00Z', round: 'group' },
  { id: 20, homeTeam: 'Austria', awayTeam: 'Jordania', group: 'J', matchday: 1, kickoff: '2026-06-17T04:00:00Z', round: 'group' },
  // GRUPO K
  { id: 21, homeTeam: 'Portugal', awayTeam: 'DR Congo', group: 'K', matchday: 1, kickoff: '2026-06-17T17:00:00Z', round: 'group' },
  // GRUPO L
  { id: 22, homeTeam: 'Inglaterra', awayTeam: 'Croacia', group: 'L', matchday: 1, kickoff: '2026-06-17T20:00:00Z', round: 'group' },
  { id: 23, homeTeam: 'Ghana', awayTeam: 'Panamá', group: 'L', matchday: 1, kickoff: '2026-06-17T23:00:00Z', round: 'group' },
  // GRUPO K (cont.)
  { id: 24, homeTeam: 'Uzbekistán', awayTeam: 'Colombia', group: 'K', matchday: 1, kickoff: '2026-06-18T02:00:00Z', round: 'group' },

  // ==================== JORNADA 2 ====================
  // GRUPO A
  { id: 25, homeTeam: 'Chequia', awayTeam: 'Sudáfrica', group: 'A', matchday: 2, kickoff: '2026-06-18T16:00:00Z', round: 'group' },
  // GRUPO B
  { id: 26, homeTeam: 'Suiza', awayTeam: 'Bosnia y Herz.', group: 'B', matchday: 2, kickoff: '2026-06-18T19:00:00Z', round: 'group' },
  { id: 27, homeTeam: 'Canadá', awayTeam: 'Catar', group: 'B', matchday: 2, kickoff: '2026-06-18T22:00:00Z', round: 'group' },
  // GRUPO A (cont.)
  { id: 28, homeTeam: 'México', awayTeam: 'Corea del Sur', group: 'A', matchday: 2, kickoff: '2026-06-19T01:00:00Z', round: 'group' },
  // GRUPO D
  { id: 29, homeTeam: 'EE.UU.', awayTeam: 'Australia', group: 'D', matchday: 2, kickoff: '2026-06-19T19:00:00Z', round: 'group' },
  // GRUPO C
  { id: 30, homeTeam: 'Escocia', awayTeam: 'Marruecos', group: 'C', matchday: 2, kickoff: '2026-06-19T22:00:00Z', round: 'group' },
  { id: 31, homeTeam: 'Brasil', awayTeam: 'Haití', group: 'C', matchday: 2, kickoff: '2026-06-20T01:00:00Z', round: 'group' },
  // GRUPO D (cont.)
  { id: 32, homeTeam: 'Turquía', awayTeam: 'Paraguay', group: 'D', matchday: 2, kickoff: '2026-06-20T03:00:00Z', round: 'group' },
  // GRUPO E
  { id: 33, homeTeam: 'Alemania', awayTeam: 'Costa de Marfil', group: 'E', matchday: 2, kickoff: '2026-06-20T17:00:00Z', round: 'group' },
  // GRUPO F
  { id: 34, homeTeam: 'Países Bajos', awayTeam: 'Suecia', group: 'F', matchday: 2, kickoff: '2026-06-20T20:00:00Z', round: 'group' },
  // GRUPO E (cont.)
  { id: 35, homeTeam: 'Curazao', awayTeam: 'Ecuador', group: 'E', matchday: 2, kickoff: '2026-06-20T23:00:00Z', round: 'group' },
  // GRUPO F (cont.)
  { id: 36, homeTeam: 'Japón', awayTeam: 'Túnez', group: 'F', matchday: 2, kickoff: '2026-06-21T02:00:00Z', round: 'group' },
  // GRUPO H
  { id: 37, homeTeam: 'España', awayTeam: 'Arabia Saudí', group: 'H', matchday: 2, kickoff: '2026-06-21T16:00:00Z', round: 'group' },
  // GRUPO G
  { id: 38, homeTeam: 'Bélgica', awayTeam: 'Irán', group: 'G', matchday: 2, kickoff: '2026-06-21T19:00:00Z', round: 'group' },
  // GRUPO H (cont.)
  { id: 39, homeTeam: 'Cabo Verde', awayTeam: 'Uruguay', group: 'H', matchday: 2, kickoff: '2026-06-21T22:00:00Z', round: 'group' },
  // GRUPO G (cont.)
  { id: 40, homeTeam: 'Egipto', awayTeam: 'Nueva Zelanda', group: 'G', matchday: 2, kickoff: '2026-06-22T01:00:00Z', round: 'group' },
  // GRUPO I
  { id: 41, homeTeam: 'Francia', awayTeam: 'Irak', group: 'I', matchday: 2, kickoff: '2026-06-22T17:00:00Z', round: 'group' },
  { id: 42, homeTeam: 'Senegal', awayTeam: 'Noruega', group: 'I', matchday: 2, kickoff: '2026-06-22T20:00:00Z', round: 'group' },
  // GRUPO J
  { id: 43, homeTeam: 'Argentina', awayTeam: 'Austria', group: 'J', matchday: 2, kickoff: '2026-06-22T23:00:00Z', round: 'group' },
  { id: 44, homeTeam: 'Argelia', awayTeam: 'Jordania', group: 'J', matchday: 2, kickoff: '2026-06-23T02:00:00Z', round: 'group' },
  // GRUPO K
  { id: 45, homeTeam: 'Portugal', awayTeam: 'Uzbekistán', group: 'K', matchday: 2, kickoff: '2026-06-23T17:00:00Z', round: 'group' },
  // GRUPO L
  { id: 46, homeTeam: 'Inglaterra', awayTeam: 'Ghana', group: 'L', matchday: 2, kickoff: '2026-06-23T20:00:00Z', round: 'group' },
  { id: 47, homeTeam: 'Croacia', awayTeam: 'Panamá', group: 'L', matchday: 2, kickoff: '2026-06-23T23:00:00Z', round: 'group' },
  // GRUPO K (cont.)
  { id: 48, homeTeam: 'DR Congo', awayTeam: 'Colombia', group: 'K', matchday: 2, kickoff: '2026-06-24T02:00:00Z', round: 'group' },

  // ==================== JORNADA 3 (simultáneos por grupo) ====================
  // GRUPO B (simultáneos)
  { id: 49, homeTeam: 'Suiza', awayTeam: 'Canadá', group: 'B', matchday: 3, kickoff: '2026-06-24T19:00:00Z', round: 'group' },
  { id: 50, homeTeam: 'Bosnia y Herz.', awayTeam: 'Catar', group: 'B', matchday: 3, kickoff: '2026-06-24T19:00:00Z', round: 'group' },
  // GRUPO A (simultáneos)
  { id: 51, homeTeam: 'Chequia', awayTeam: 'México', group: 'A', matchday: 3, kickoff: '2026-06-25T01:00:00Z', round: 'group' },
  { id: 52, homeTeam: 'Sudáfrica', awayTeam: 'Corea del Sur', group: 'A', matchday: 3, kickoff: '2026-06-25T01:00:00Z', round: 'group' },
  // GRUPO C (simultáneos)
  { id: 53, homeTeam: 'Brasil', awayTeam: 'Escocia', group: 'C', matchday: 3, kickoff: '2026-06-25T19:00:00Z', round: 'group' },
  { id: 54, homeTeam: 'Marruecos', awayTeam: 'Haití', group: 'C', matchday: 3, kickoff: '2026-06-25T19:00:00Z', round: 'group' },
  // GRUPO D (simultáneos)
  { id: 55, homeTeam: 'Turquía', awayTeam: 'EE.UU.', group: 'D', matchday: 3, kickoff: '2026-06-26T02:00:00Z', round: 'group' },
  { id: 56, homeTeam: 'Paraguay', awayTeam: 'Australia', group: 'D', matchday: 3, kickoff: '2026-06-26T02:00:00Z', round: 'group' },
  // GRUPO E (simultáneos)
  { id: 57, homeTeam: 'Alemania', awayTeam: 'Ecuador', group: 'E', matchday: 3, kickoff: '2026-06-26T17:00:00Z', round: 'group' },
  { id: 58, homeTeam: 'Curazao', awayTeam: 'Costa de Marfil', group: 'E', matchday: 3, kickoff: '2026-06-26T17:00:00Z', round: 'group' },
  // GRUPO F (simultáneos)
  { id: 59, homeTeam: 'Países Bajos', awayTeam: 'Túnez', group: 'F', matchday: 3, kickoff: '2026-06-26T20:00:00Z', round: 'group' },
  { id: 60, homeTeam: 'Japón', awayTeam: 'Suecia', group: 'F', matchday: 3, kickoff: '2026-06-26T20:00:00Z', round: 'group' },
  // GRUPO G (simultáneos)
  { id: 61, homeTeam: 'Egipto', awayTeam: 'Irán', group: 'G', matchday: 3, kickoff: '2026-06-27T03:00:00Z', round: 'group' },
  { id: 62, homeTeam: 'Nueva Zelanda', awayTeam: 'Bélgica', group: 'G', matchday: 3, kickoff: '2026-06-27T03:00:00Z', round: 'group' },
  // GRUPO H (simultáneos)
  { id: 63, homeTeam: 'España', awayTeam: 'Uruguay', group: 'H', matchday: 3, kickoff: '2026-06-27T17:00:00Z', round: 'group' },
  { id: 64, homeTeam: 'Cabo Verde', awayTeam: 'Arabia Saudí', group: 'H', matchday: 3, kickoff: '2026-06-27T17:00:00Z', round: 'group' },
  // GRUPO I (simultáneos)
  { id: 65, homeTeam: 'Francia', awayTeam: 'Noruega', group: 'I', matchday: 3, kickoff: '2026-06-27T20:00:00Z', round: 'group' },
  { id: 66, homeTeam: 'Senegal', awayTeam: 'Irak', group: 'I', matchday: 3, kickoff: '2026-06-27T20:00:00Z', round: 'group' },
  // GRUPO J (simultáneos)
  { id: 67, homeTeam: 'Argentina', awayTeam: 'Jordania', group: 'J', matchday: 3, kickoff: '2026-06-28T01:00:00Z', round: 'group' },
  { id: 68, homeTeam: 'Argelia', awayTeam: 'Austria', group: 'J', matchday: 3, kickoff: '2026-06-28T01:00:00Z', round: 'group' },
  // GRUPO K (simultáneos)
  { id: 69, homeTeam: 'Portugal', awayTeam: 'Colombia', group: 'K', matchday: 3, kickoff: '2026-06-28T17:00:00Z', round: 'group' },
  { id: 70, homeTeam: 'DR Congo', awayTeam: 'Uzbekistán', group: 'K', matchday: 3, kickoff: '2026-06-28T17:00:00Z', round: 'group' },
  // GRUPO L (simultáneos)
  { id: 71, homeTeam: 'Inglaterra', awayTeam: 'Panamá', group: 'L', matchday: 3, kickoff: '2026-06-28T20:00:00Z', round: 'group' },
  { id: 72, homeTeam: 'Croacia', awayTeam: 'Ghana', group: 'L', matchday: 3, kickoff: '2026-06-28T20:00:00Z', round: 'group' },
]

// FASE ELIMINATORIA - se añadirán cuando se conozcan los clasificados
export const KNOCKOUT_MATCHES = [
  // 16avos de final (Round of 32) - July 1-4
  { id: 73, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-01T19:00:00Z', round: 'r32', label: '1A vs 2B' },
  { id: 74, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-01T22:00:00Z', round: 'r32', label: '1C vs 2D' },
  { id: 75, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-02T01:00:00Z', round: 'r32', label: '1E vs 2F' },
  { id: 76, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-02T19:00:00Z', round: 'r32', label: '1G vs 2H' },
  { id: 77, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-02T22:00:00Z', round: 'r32', label: '1I vs 2J' },
  { id: 78, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-03T01:00:00Z', round: 'r32', label: '1K vs 2L' },
  { id: 79, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-03T19:00:00Z', round: 'r32', label: '1B vs 2A' },
  { id: 80, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-03T22:00:00Z', round: 'r32', label: '1D vs 2C' },
  { id: 81, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-04T01:00:00Z', round: 'r32', label: '1F vs 2E' },
  { id: 82, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-04T19:00:00Z', round: 'r32', label: '1H vs 2G' },
  { id: 83, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-04T22:00:00Z', round: 'r32', label: '1J vs 2I' },
  { id: 84, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-05T01:00:00Z', round: 'r32', label: '1L vs 2K' },
  { id: 85, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-05T19:00:00Z', round: 'r32', label: '3er mejor A-D' },
  { id: 86, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-05T22:00:00Z', round: 'r32', label: '3er mejor E-H' },
  { id: 87, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-06T01:00:00Z', round: 'r32', label: '3er mejor I-L' },
  { id: 88, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-06T19:00:00Z', round: 'r32', label: '3er mejor mejor resto' },
  // Octavos de final (Round of 16)
  { id: 89, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-08T19:00:00Z', round: 'r16', label: 'Octavos 1' },
  { id: 90, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-08T22:00:00Z', round: 'r16', label: 'Octavos 2' },
  { id: 91, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-09T01:00:00Z', round: 'r16', label: 'Octavos 3' },
  { id: 92, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-09T19:00:00Z', round: 'r16', label: 'Octavos 4' },
  { id: 93, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-09T22:00:00Z', round: 'r16', label: 'Octavos 5' },
  { id: 94, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-10T01:00:00Z', round: 'r16', label: 'Octavos 6' },
  { id: 95, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-10T19:00:00Z', round: 'r16', label: 'Octavos 7' },
  { id: 96, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-10T22:00:00Z', round: 'r16', label: 'Octavos 8' },
  // Cuartos de final
  { id: 97, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-12T19:00:00Z', round: 'qf', label: 'Cuartos 1' },
  { id: 98, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-12T23:00:00Z', round: 'qf', label: 'Cuartos 2' },
  { id: 99, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-13T19:00:00Z', round: 'qf', label: 'Cuartos 3' },
  { id: 100, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-13T23:00:00Z', round: 'qf', label: 'Cuartos 4' },
  // Semifinales
  { id: 101, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-15T23:00:00Z', round: 'sf', label: 'Semifinal 1' },
  { id: 102, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-16T23:00:00Z', round: 'sf', label: 'Semifinal 2' },
  // Tercer y cuarto puesto
  { id: 103, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-18T23:00:00Z', round: 'third', label: '3er y 4º puesto' },
  // Final
  { id: 104, homeTeam: 'Por determinar', awayTeam: 'Por determinar', group: null, matchday: null, kickoff: '2026-07-19T23:00:00Z', round: 'final', label: 'FINAL' },
]

export const ALL_MATCHES = [...GROUP_MATCHES, ...KNOCKOUT_MATCHES]

export const ROUND_LABELS = {
  group: 'Fase de Grupos',
  r32: '16avos de Final',
  r16: 'Octavos de Final',
  qf: 'Cuartos de Final',
  sf: 'Semifinales',
  third: '3er y 4º Puesto',
  final: 'FINAL',
}

// Sistema de puntos
export function calculatePoints(homeScore, awayScore, homePred, awayPred, penaltyWinner = null, predPenaltyWinner = null) {
  if (homeScore === null || awayScore === null) return null
  if (homePred === null || awayPred === null) return 0
  const isDraw = homeScore === awayScore
  const isKnockoutDraw = isDraw && penaltyWinner !== null
  const isPredDraw = homePred === awayPred
  const exactScore = homeScore === homePred && awayScore === awayPred
  if (exactScore) {
    if (!isKnockoutDraw) return 8
    return predPenaltyWinner === penaltyWinner ? 8 : 3
  }
  const realWinner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : (penaltyWinner || 'D')
  const predWinner = homePred > awayPred ? 'home' : awayPred > homePred ? 'away' : (isPredDraw ? (predPenaltyWinner || 'D') : null)
  if (realWinner && predWinner && realWinner === predWinner) return 3
  return 0
}