import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [showAdminCode, setShowAdminCode] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    if (trimmedName.length < 2) { setError('El nombre debe tener al menos 2 caracteres'); return }
    if (trimmedName.length > 30) { setError('El nombre es demasiado largo (máx. 30 caracteres)'); return }

    setLoading(true)
    setError('')

    try {
      // Comprobar si el nombre ya existe
      const { data: existing } = await supabase
        .from('participants')
        .select('*')
        .ilike('name', trimmedName)
        .single()

      if (existing) {
        // Ya existe → entrar directamente
        onLogin({ id: existing.id, name: existing.name, isAdmin: existing.is_admin, hasPaid: existing.has_paid })
        return
      }

      // Verificar si es admin
      const isAdmin = adminCode.trim() === (import.meta.env.VITE_ADMIN_CODE || 'mundialAdmin2026')

      // Crear nuevo participante
      const { data: newP, error: insertError } = await supabase
        .from('participants')
        .insert([{ name: trimmedName, is_admin: isAdmin, has_paid: false }])
        .select()
        .single()

      if (insertError) {
        if (insertError.code === '23505') {
          setError('Ese nombre ya está en uso, elige otro')
        } else {
          setError('Error al conectar. ¿Está configurado Supabase?')
          console.error(insertError)
        }
        return
      }

      onLogin({ id: newP.id, name: newP.name, isAdmin: newP.is_admin, hasPaid: newP.has_paid })
    } catch (err) {
      setError('Error de conexión. Revisa la configuración.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-5">
      {/* Header */}
      <div className="text-center mb-10 slide-up">
        <div className="text-7xl mb-4">🏆</div>
        <h1 className="text-3xl font-black text-white mb-1">Porra Mundial</h1>
        <p className="text-xl font-bold text-gold">FIFA 2026</p>
        <p className="text-gray-400 text-sm mt-2">
          8 pts exacto · 3 pts ganador · 0 pts fallo
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm slide-up">
        <div className="bg-card rounded-2xl p-5 border border-border mb-4">
          <label className="block text-gray-400 text-sm font-medium mb-2">
            ¿Cómo te llamas?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre o apodo..."
            className="w-full bg-border rounded-xl px-4 py-3 text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
            maxLength={30}
            autoFocus
          />

          {showAdminCode && (
            <div className="mt-3">
              <label className="block text-gray-400 text-xs font-medium mb-2">
                🔐 Código de administrador (opcional)
              </label>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Código admin..."
                className="w-full bg-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-3 flex items-center gap-1">
              <span>⚠️</span> {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-accent text-black font-black text-lg py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
          {loading ? 'Entrando...' : '¡Entrar a la Porra! ⚽'}
        </button>

        <button
          type="button"
          onClick={() => setShowAdminCode(!showAdminCode)}
          className="w-full text-gray-600 text-xs mt-3 py-2"
        >
          {showAdminCode ? 'Ocultar opciones admin' : '¿Eres el organizador?'}
        </button>
      </form>

      <p className="text-gray-600 text-xs text-center mt-6 max-w-xs">
        Si ya tienes cuenta, escribe exactamente el mismo nombre para recuperarla.
      </p>
    </div>
  )
}
