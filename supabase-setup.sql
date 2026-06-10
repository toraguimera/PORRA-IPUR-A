-- =============================================================
-- PORRA MUNDIAL 2026 - Schema de Supabase
-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase
-- =============================================================

-- 1. PARTICIPANTES
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  has_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(LOWER(name))
);

-- 2. PARTIDOS
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY,
  "homeTeam" TEXT NOT NULL,
  "awayTeam" TEXT NOT NULL,
  "group" TEXT,
  matchday INTEGER,
  kickoff TIMESTAMPTZ NOT NULL,
  round TEXT NOT NULL DEFAULT 'group',
  label TEXT,
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled'
);

-- 3. PREDICCIONES
CREATE TABLE IF NOT EXISTS predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  home_prediction INTEGER NOT NULL,
  away_prediction INTEGER NOT NULL,
  points INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, match_id)
);

-- 4. CONFIGURACIÓN (bote, etc.)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Configuración por defecto del bote
INSERT INTO settings (key, value)
VALUES ('bote_config', '{"entry_fee": 10, "first_pct": 60, "second_pct": 30, "third_pct": 10}')
ON CONFLICT (key) DO NOTHING;

-- =============================================================
-- ROW LEVEL SECURITY (RLS) - Permitir acceso público
-- =============================================================

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Participantes: cualquiera puede leer y crear
CREATE POLICY "participantes_read" ON participants FOR SELECT USING (true);
CREATE POLICY "participantes_insert" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "participantes_update" ON participants FOR UPDATE USING (true);

-- Partidos: cualquiera puede leer, solo admins pueden actualizar
-- (la validación se hace en el frontend con el código admin)
CREATE POLICY "matches_read" ON matches FOR SELECT USING (true);
CREATE POLICY "matches_insert" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "matches_update" ON matches FOR UPDATE USING (true);

-- Predicciones: cualquiera puede leer y crear/actualizar
CREATE POLICY "predictions_read" ON predictions FOR SELECT USING (true);
CREATE POLICY "predictions_insert" ON predictions FOR INSERT WITH CHECK (true);
CREATE POLICY "predictions_update" ON predictions FOR UPDATE USING (true);

-- Configuración: cualquiera puede leer, solo admins actualizan (validación en frontend)
CREATE POLICY "settings_read" ON settings FOR SELECT USING (true);
CREATE POLICY "settings_upsert" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "settings_update" ON settings FOR UPDATE USING (true);

-- =============================================================
-- ÍNDICES para mejor rendimiento
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_predictions_participant ON predictions(participant_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_kickoff ON matches(kickoff);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- =============================================================
-- ACTIVAR REALTIME para actualizaciones en tiempo real
-- =============================================================
-- Ejecuta esto también:
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;

-- =============================================================
-- INSERTAR TODOS LOS PARTIDOS DEL MUNDIAL 2026
-- (72 partidos de fase de grupos + 32 eliminatorias = 104 total)
-- =============================================================

INSERT INTO matches (id, "homeTeam", "awayTeam", "group", matchday, kickoff, round) VALUES
-- ===== JORNADA 1 =====
(1, 'México', 'Sudáfrica', 'A', 1, '2026-06-11T19:00:00Z', 'group'),
(2, 'Corea del Sur', 'Chequia', 'A', 1, '2026-06-12T02:00:00Z', 'group'),
(3, 'Canadá', 'Bosnia y Herz.', 'B', 1, '2026-06-12T19:00:00Z', 'group'),
(4, 'EE.UU.', 'Paraguay', 'D', 1, '2026-06-13T01:00:00Z', 'group'),
(5, 'Catar', 'Suiza', 'B', 1, '2026-06-13T19:00:00Z', 'group'),
(6, 'Brasil', 'Marruecos', 'C', 1, '2026-06-13T22:00:00Z', 'group'),
(7, 'Haití', 'Escocia', 'C', 1, '2026-06-14T01:00:00Z', 'group'),
(8, 'Australia', 'Turquía', 'D', 1, '2026-06-14T04:00:00Z', 'group'),
(9, 'Alemania', 'Curazao', 'E', 1, '2026-06-14T17:00:00Z', 'group'),
(10, 'Países Bajos', 'Japón', 'F', 1, '2026-06-14T20:00:00Z', 'group'),
(11, 'Costa de Marfil', 'Ecuador', 'E', 1, '2026-06-14T23:00:00Z', 'group'),
(12, 'Suecia', 'Túnez', 'F', 1, '2026-06-15T02:00:00Z', 'group'),
(13, 'España', 'Cabo Verde', 'H', 1, '2026-06-15T16:00:00Z', 'group'),
(14, 'Bélgica', 'Egipto', 'G', 1, '2026-06-15T19:00:00Z', 'group'),
(15, 'Arabia Saudí', 'Uruguay', 'H', 1, '2026-06-15T22:00:00Z', 'group'),
(16, 'Irán', 'Nueva Zelanda', 'G', 1, '2026-06-16T01:00:00Z', 'group'),
(17, 'Francia', 'Senegal', 'I', 1, '2026-06-16T19:00:00Z', 'group'),
(18, 'Irak', 'Noruega', 'I', 1, '2026-06-16T22:00:00Z', 'group'),
(19, 'Argentina', 'Argelia', 'J', 1, '2026-06-17T01:00:00Z', 'group'),
(20, 'Austria', 'Jordania', 'J', 1, '2026-06-17T04:00:00Z', 'group'),
(21, 'Portugal', 'DR Congo', 'K', 1, '2026-06-17T17:00:00Z', 'group'),
(22, 'Inglaterra', 'Croacia', 'L', 1, '2026-06-17T20:00:00Z', 'group'),
(23, 'Ghana', 'Panamá', 'L', 1, '2026-06-17T23:00:00Z', 'group'),
(24, 'Uzbekistán', 'Colombia', 'K', 1, '2026-06-18T02:00:00Z', 'group'),
-- ===== JORNADA 2 =====
(25, 'Chequia', 'Sudáfrica', 'A', 2, '2026-06-18T16:00:00Z', 'group'),
(26, 'Suiza', 'Bosnia y Herz.', 'B', 2, '2026-06-18T19:00:00Z', 'group'),
(27, 'Canadá', 'Catar', 'B', 2, '2026-06-18T22:00:00Z', 'group'),
(28, 'México', 'Corea del Sur', 'A', 2, '2026-06-19T01:00:00Z', 'group'),
(29, 'EE.UU.', 'Australia', 'D', 2, '2026-06-19T19:00:00Z', 'group'),
(30, 'Escocia', 'Marruecos', 'C', 2, '2026-06-19T22:00:00Z', 'group'),
(31, 'Brasil', 'Haití', 'C', 2, '2026-06-20T01:00:00Z', 'group'),
(32, 'Turquía', 'Paraguay', 'D', 2, '2026-06-20T03:00:00Z', 'group'),
(33, 'Alemania', 'Costa de Marfil', 'E', 2, '2026-06-20T17:00:00Z', 'group'),
(34, 'Países Bajos', 'Suecia', 'F', 2, '2026-06-20T20:00:00Z', 'group'),
(35, 'Curazao', 'Ecuador', 'E', 2, '2026-06-20T23:00:00Z', 'group'),
(36, 'Japón', 'Túnez', 'F', 2, '2026-06-21T02:00:00Z', 'group'),
(37, 'España', 'Arabia Saudí', 'H', 2, '2026-06-21T16:00:00Z', 'group'),
(38, 'Bélgica', 'Irán', 'G', 2, '2026-06-21T19:00:00Z', 'group'),
(39, 'Cabo Verde', 'Uruguay', 'H', 2, '2026-06-21T22:00:00Z', 'group'),
(40, 'Egipto', 'Nueva Zelanda', 'G', 2, '2026-06-22T01:00:00Z', 'group'),
(41, 'Francia', 'Irak', 'I', 2, '2026-06-22T17:00:00Z', 'group'),
(42, 'Senegal', 'Noruega', 'I', 2, '2026-06-22T20:00:00Z', 'group'),
(43, 'Argentina', 'Austria', 'J', 2, '2026-06-22T23:00:00Z', 'group'),
(44, 'Argelia', 'Jordania', 'J', 2, '2026-06-23T02:00:00Z', 'group'),
(45, 'Portugal', 'Uzbekistán', 'K', 2, '2026-06-23T17:00:00Z', 'group'),
(46, 'Inglaterra', 'Ghana', 'L', 2, '2026-06-23T20:00:00Z', 'group'),
(47, 'Croacia', 'Panamá', 'L', 2, '2026-06-23T23:00:00Z', 'group'),
(48, 'DR Congo', 'Colombia', 'K', 2, '2026-06-24T02:00:00Z', 'group'),
-- ===== JORNADA 3 (simultáneos) =====
(49, 'Suiza', 'Canadá', 'B', 3, '2026-06-24T19:00:00Z', 'group'),
(50, 'Bosnia y Herz.', 'Catar', 'B', 3, '2026-06-24T19:00:00Z', 'group'),
(51, 'Chequia', 'México', 'A', 3, '2026-06-25T01:00:00Z', 'group'),
(52, 'Sudáfrica', 'Corea del Sur', 'A', 3, '2026-06-25T01:00:00Z', 'group'),
(53, 'Brasil', 'Escocia', 'C', 3, '2026-06-25T19:00:00Z', 'group'),
(54, 'Marruecos', 'Haití', 'C', 3, '2026-06-25T19:00:00Z', 'group'),
(55, 'Turquía', 'EE.UU.', 'D', 3, '2026-06-26T02:00:00Z', 'group'),
(56, 'Paraguay', 'Australia', 'D', 3, '2026-06-26T02:00:00Z', 'group'),
(57, 'Alemania', 'Ecuador', 'E', 3, '2026-06-26T17:00:00Z', 'group'),
(58, 'Curazao', 'Costa de Marfil', 'E', 3, '2026-06-26T17:00:00Z', 'group'),
(59, 'Países Bajos', 'Túnez', 'F', 3, '2026-06-26T20:00:00Z', 'group'),
(60, 'Japón', 'Suecia', 'F', 3, '2026-06-26T20:00:00Z', 'group'),
(61, 'Egipto', 'Irán', 'G', 3, '2026-06-27T03:00:00Z', 'group'),
(62, 'Nueva Zelanda', 'Bélgica', 'G', 3, '2026-06-27T03:00:00Z', 'group'),
(63, 'España', 'Uruguay', 'H', 3, '2026-06-27T17:00:00Z', 'group'),
(64, 'Cabo Verde', 'Arabia Saudí', 'H', 3, '2026-06-27T17:00:00Z', 'group'),
(65, 'Francia', 'Noruega', 'I', 3, '2026-06-27T20:00:00Z', 'group'),
(66, 'Senegal', 'Irak', 'I', 3, '2026-06-27T20:00:00Z', 'group'),
(67, 'Argentina', 'Jordania', 'J', 3, '2026-06-28T01:00:00Z', 'group'),
(68, 'Argelia', 'Austria', 'J', 3, '2026-06-28T01:00:00Z', 'group'),
(69, 'Portugal', 'Colombia', 'K', 3, '2026-06-28T17:00:00Z', 'group'),
(70, 'DR Congo', 'Uzbekistán', 'K', 3, '2026-06-28T17:00:00Z', 'group'),
(71, 'Inglaterra', 'Panamá', 'L', 3, '2026-06-28T20:00:00Z', 'group'),
(72, 'Croacia', 'Ghana', 'L', 3, '2026-06-28T20:00:00Z', 'group')
ON CONFLICT (id) DO NOTHING;

-- Insertar partidos de eliminatorias (por determinar)
INSERT INTO matches (id, "homeTeam", "awayTeam", kickoff, round, label) VALUES
(73, 'Por determinar', 'Por determinar', '2026-07-01T19:00:00Z', 'r32', '16avos 1'),
(74, 'Por determinar', 'Por determinar', '2026-07-01T22:00:00Z', 'r32', '16avos 2'),
(75, 'Por determinar', 'Por determinar', '2026-07-02T01:00:00Z', 'r32', '16avos 3'),
(76, 'Por determinar', 'Por determinar', '2026-07-02T19:00:00Z', 'r32', '16avos 4'),
(77, 'Por determinar', 'Por determinar', '2026-07-02T22:00:00Z', 'r32', '16avos 5'),
(78, 'Por determinar', 'Por determinar', '2026-07-03T01:00:00Z', 'r32', '16avos 6'),
(79, 'Por determinar', 'Por determinar', '2026-07-03T19:00:00Z', 'r32', '16avos 7'),
(80, 'Por determinar', 'Por determinar', '2026-07-03T22:00:00Z', 'r32', '16avos 8'),
(81, 'Por determinar', 'Por determinar', '2026-07-04T01:00:00Z', 'r32', '16avos 9'),
(82, 'Por determinar', 'Por determinar', '2026-07-04T19:00:00Z', 'r32', '16avos 10'),
(83, 'Por determinar', 'Por determinar', '2026-07-04T22:00:00Z', 'r32', '16avos 11'),
(84, 'Por determinar', 'Por determinar', '2026-07-05T01:00:00Z', 'r32', '16avos 12'),
(85, 'Por determinar', 'Por determinar', '2026-07-05T19:00:00Z', 'r32', '16avos 13'),
(86, 'Por determinar', 'Por determinar', '2026-07-05T22:00:00Z', 'r32', '16avos 14'),
(87, 'Por determinar', 'Por determinar', '2026-07-06T01:00:00Z', 'r32', '16avos 15'),
(88, 'Por determinar', 'Por determinar', '2026-07-06T19:00:00Z', 'r32', '16avos 16'),
(89, 'Por determinar', 'Por determinar', '2026-07-08T19:00:00Z', 'r16', 'Octavos 1'),
(90, 'Por determinar', 'Por determinar', '2026-07-08T22:00:00Z', 'r16', 'Octavos 2'),
(91, 'Por determinar', 'Por determinar', '2026-07-09T01:00:00Z', 'r16', 'Octavos 3'),
(92, 'Por determinar', 'Por determinar', '2026-07-09T19:00:00Z', 'r16', 'Octavos 4'),
(93, 'Por determinar', 'Por determinar', '2026-07-09T22:00:00Z', 'r16', 'Octavos 5'),
(94, 'Por determinar', 'Por determinar', '2026-07-10T01:00:00Z', 'r16', 'Octavos 6'),
(95, 'Por determinar', 'Por determinar', '2026-07-10T19:00:00Z', 'r16', 'Octavos 7'),
(96, 'Por determinar', 'Por determinar', '2026-07-10T22:00:00Z', 'r16', 'Octavos 8'),
(97, 'Por determinar', 'Por determinar', '2026-07-12T19:00:00Z', 'qf', 'Cuartos 1'),
(98, 'Por determinar', 'Por determinar', '2026-07-12T23:00:00Z', 'qf', 'Cuartos 2'),
(99, 'Por determinar', 'Por determinar', '2026-07-13T19:00:00Z', 'qf', 'Cuartos 3'),
(100,'Por determinar', 'Por determinar', '2026-07-13T23:00:00Z', 'qf', 'Cuartos 4'),
(101,'Por determinar', 'Por determinar', '2026-07-15T23:00:00Z', 'sf', 'Semifinal 1'),
(102,'Por determinar', 'Por determinar', '2026-07-16T23:00:00Z', 'sf', 'Semifinal 2'),
(103,'Por determinar', 'Por determinar', '2026-07-18T23:00:00Z', 'third', '3er y 4º puesto'),
(104,'Por determinar', 'Por determinar', '2026-07-19T23:00:00Z', 'final', 'FINAL')
ON CONFLICT (id) DO NOTHING;
