import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, School, FileText, BarChart2,
  ClipboardList, Users, X, BookOpen
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/escolas', label: 'Escolas', icon: School },
  { to: '/formularios', label: 'Formulários', icon: FileText },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart2 },
  { to: '/logs', label: 'Logs', icon: ClipboardList, adminOnly: true },
  { to: '/usuarios', label: 'Usuários', icon: Users, adminOnly: true },
]

export default function Sidebar({ open, onClose }) {
  const { user, isAdmin } = useAuth()

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-blue-800">
        <div className="w-9 h-9 bg-utfpr-yellow rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-utfpr-blue" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">ELLP</div>
          <div className="text-blue-300 text-xs">UTFPR — Socioeconômico</div>
        </div>
        <button onClick={onClose} className="ml-auto lg:hidden text-blue-300 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-5 py-4 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-utfpr-yellow flex items-center justify-center text-utfpr-blue font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-medium truncate">{user?.name}</div>
            <div className="text-blue-300 text-xs">{user?.role === 'ADMIN' ? 'Administrador' : 'Voluntário'}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.filter(item => !item.adminOnly || isAdmin()).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-blue-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-blue-800">
        <p className="text-blue-400 text-xs text-center">v1.0.0 — ELLP UTFPR</p>
      </div>
    </div>
  )

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <aside className="hidden lg:flex w-60 bg-utfpr-blue flex-col h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-utfpr-blue flex flex-col transform transition-transform duration-200 lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  )
}
