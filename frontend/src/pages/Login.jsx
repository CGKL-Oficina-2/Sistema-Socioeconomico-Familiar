import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BookOpen, Eye, EyeOff, LogIn } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Bem-vindo ao ELLP!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-utfpr-blue via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-utfpr-yellow rounded-2xl shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-utfpr-blue" />
          </div>
          <h1 className="text-white text-2xl font-bold">Sistema ELLP</h1>
          <p className="text-blue-300 text-sm mt-1">Dados Socioeconômicos — UTFPR</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-gray-900 font-semibold text-lg mb-1">Entrar no sistema</h2>
          <p className="text-gray-400 text-sm mb-6">Informe suas credenciais para continuar</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
                {...register('email', { required: 'E-mail obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' } })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', { required: 'Senha obrigatória' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-2.5 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <a href="/formulario-publico" className="text-sm text-utfpr-blue hover:underline text-center block">
              Preencher formulário anônimo →
            </a>
          </div>
        </div>

        <p className="text-blue-400 text-xs text-center mt-6">
          Projeto de Extensão ELLP — Ensino Lúdico de Lógica e Programação
        </p>
      </div>
    </div>
  )
}
