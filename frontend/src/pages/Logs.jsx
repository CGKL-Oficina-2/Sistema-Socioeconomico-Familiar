import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { LoadingSpinner, EmptyState, Pagination } from '../components/ui/index'
import { ClipboardList } from 'lucide-react'

const actionColors = {
  LOGIN: 'badge-blue',
  LOGOUT: 'badge-gray',
  CREATE: 'badge-green',
  UPDATE: 'badge-yellow',
  DELETE: 'badge-red',
  EXPORT: 'bg-purple-100 text-purple-800 badge',
}

const actionLabels = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATE: 'Criação',
  UPDATE: 'Edição',
  DELETE: 'Exclusão',
  EXPORT: 'Exportação',
}

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [action, setAction] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/logs', { params: { page, limit: 20, action: action || undefined } })
      setLogs(data.data)
      setPagination(data.pagination)
    } catch {
      toast.error('Erro ao carregar logs')
    } finally {
      setLoading(false)
    }
  }, [page, action])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <select className="input max-w-xs" value={action} onChange={(e) => { setAction(e.target.value); setPage(1) }}>
          <option value="">Todas as ações</option>
          {Object.entries(actionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? <LoadingSpinner text="Carregando logs..." /> : logs.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Nenhum log encontrado" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Data/Hora</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Ação</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Usuário</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Recurso</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={actionColors[log.action] || 'badge-gray'}>
                          {actionLabels[log.action] || log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{log.userName || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell capitalize">{log.resource}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell max-w-xs truncate">{log.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-50">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
