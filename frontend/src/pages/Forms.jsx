import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Search, Edit2, Trash2, FileText, Eye } from 'lucide-react'
import { LoadingSpinner, EmptyState, Pagination, ConfirmDialog, Modal } from '../components/ui/index'

export default function Forms() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [viewForm, setViewForm] = useState(null)

  const fetchForms = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/forms', { params: { page, limit: 10, search } })
      setForms(data.data)
      setPagination(data.pagination)
    } catch {
      toast.error('Erro ao carregar formulários')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchForms() }, [fetchForms])

  const handleDelete = async () => {
    try {
      await api.delete(`/forms/${deleteId}`)
      toast.success('Formulário removido')
      setDeleteId(null)
      fetchForms()
    } catch {
      toast.error('Erro ao remover formulário')
    }
  }

  const fmt = (v) => v ? `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'
  const bool = (v) => v ? <span className="badge-green">Sim</span> : <span className="badge-gray">Não</span>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Buscar por nome, CPF, email..." className="input pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <button onClick={() => navigate('/formularios/novo')} className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" /> Novo Formulário
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? <LoadingSpinner text="Carregando formulários..." /> : forms.length === 0 ? (
          <EmptyState icon={FileText} title="Nenhum formulário encontrado" description="Cadastre o primeiro formulário." action={<button onClick={() => navigate('/formularios/novo')} className="btn-primary">Novo Formulário</button>} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Responsável</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Escola</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Renda</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Internet</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Data</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {forms.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-sm flex-shrink-0">
                            {f.anonymous ? '?' : (f.responsibleName?.charAt(0) || '?')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{f.anonymous ? 'Anônimo' : (f.responsibleName || '—')}</p>
                            {f.anonymous && <span className="badge-gray text-xs">Anônimo</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{f.school?.name || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 hidden sm:table-cell">{fmt(f.familyIncome)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">{bool(f.internetAccess)}</td>
                      <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{new Date(f.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={() => setViewForm(f)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => navigate(`/formularios/${f.id}/editar`)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          {isAdmin() && <button onClick={() => setDeleteId(f.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                      </td>
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

      <Modal open={!!viewForm} onClose={() => setViewForm(null)} title="Detalhes do Formulário" size="lg">
        {viewForm && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Tipo', viewForm.anonymous ? 'Anônimo' : 'Identificado'],
              ['Responsável', viewForm.responsibleName || '—'],
              ['CPF', viewForm.cpf || '—'],
              ['Telefone', viewForm.phone || '—'],
              ['E-mail', viewForm.email || '—'],
              ['Escola', viewForm.school?.name || '—'],
              ['Renda Familiar', fmt(viewForm.familyIncome)],
              ['Nº de Moradores', viewForm.residents],
              ['Acesso à Internet', viewForm.internetAccess ? 'Sim' : 'Não'],
              ['Acesso a Computador', viewForm.computerAccess ? 'Sim' : 'Não'],
              ['Auxílio Gov.', viewForm.govAssistance ? `Sim${viewForm.govAssistanceType ? ` (${viewForm.govAssistanceType})` : ''}` : 'Não'],
              ['Cadastrado em', new Date(viewForm.createdAt).toLocaleDateString('pt-BR')],
            ].map(([k, v]) => (
              <div key={k} className={k === 'Observações' ? 'col-span-2' : ''}>
                <dt className="text-gray-500 font-medium">{k}</dt>
                <dd className="text-gray-900 mt-0.5">{v}</dd>
              </div>
            ))}
            {viewForm.observations && (
              <div className="col-span-2">
                <dt className="text-gray-500 font-medium">Observações</dt>
                <dd className="text-gray-900 mt-0.5">{viewForm.observations}</dd>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remover Formulário" message="Tem certeza que deseja remover este formulário permanentemente?" confirmLabel="Remover" danger />
    </div>
  )
}
