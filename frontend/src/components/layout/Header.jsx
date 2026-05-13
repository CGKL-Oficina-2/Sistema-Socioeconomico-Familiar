import { Menu, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

const pageTitles = {
  '/': 'Dashboard',
  '/escolas': 'Escolas',
  '/formularios': 'Formulários',
  '/formularios/novo': 'Novo Formulário',
  '/relatorios': 'Relatórios',
  '/logs': 'Logs do Sistema',
  '/usuarios': 'Usuários',
}

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const title = pageTitles[location.pathname] || 'ELLP'

  const handleLogout = () => {
    logout()
    toast.success('Sessão encerrada')
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3.5 flex items-center gap-4 sticky top-0 z-30">
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700">
        <Menu className="w-5 h-5" />
      </button>

      <div>
        <h1 className="font-semibold text-gray-900 text-base">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span className="font-medium">{user?.name}</span>
          <span className="text-gray-400">·</span>
          <span className="text-xs text-gray-400">{user?.role === 'ADMIN' ? 'Admin' : 'Voluntário'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  )
}
