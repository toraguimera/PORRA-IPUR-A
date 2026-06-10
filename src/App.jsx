import { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Matches from './pages/Matches'
import Ranking from './pages/Ranking'
import Bote from './pages/Bote'
import Navigation from './components/Navigation'

// Context global
export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export default function App() {
  const [participant, setParticipant] = useState(null) // {id, name, isAdmin, hasPaid}
  const [loading, setLoading] = useState(true)

  // Al arrancar, intentar recuperar sesión guardada
  useEffect(() => {
    const saved = localStorage.getItem('porra_participant')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        // Verificar que el participante sigue existiendo en BD
        verifyParticipant(data)
      } catch {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  async function verifyParticipant(data) {
    const { data: p, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', data.id)
      .single()

    if (error || !p) {
      localStorage.removeItem('porra_participant')
      setLoading(false)
      return
    }
    const participantData = { id: p.id, name: p.name, isAdmin: p.is_admin, hasPaid: p.has_paid }
    setParticipant(participantData)
    setLoading(false)
  }

  function login(participantData) {
    setParticipant(participantData)
    localStorage.setItem('porra_participant', JSON.stringify(participantData))
  }

  function logout() {
    setParticipant(null)
    localStorage.removeItem('porra_participant')
  }

  function updateParticipant(updates) {
    const updated = { ...participant, ...updates }
    setParticipant(updated)
    localStorage.setItem('porra_participant', JSON.stringify(updated))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-bg">
        <div className="text-center">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      </div>
    )
  }

  if (!participant) {
    return <Login onLogin={login} />
  }

  return (
    <AppContext.Provider value={{ participant, login, logout, updateParticipant }}>
      <div className="pb-20">
        <Routes>
          <Route path="/" element={<Navigate to="/partidos" replace />} />
          <Route path="/partidos" element={<Matches />} />
          <Route path="/clasificacion" element={<Ranking />} />
          <Route path="/bote" element={<Bote />} />
          <Route path="*" element={<Navigate to="/partidos" replace />} />
        </Routes>
      </div>
      <Navigation />
    </AppContext.Provider>
  )
}
