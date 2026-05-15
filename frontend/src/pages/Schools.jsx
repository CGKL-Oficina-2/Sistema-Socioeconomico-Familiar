import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Search, Edit2, Trash2, School, Phone, User, MapPin } from 'lucide-react'
import { Modal, LoadingSpinner, EmptyState, Pagination, ConfirmDialog } from '../components/ui/index'

export default function Schools() {
  const { isAdmin } = useAuth()
  const [schools, setSchools] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchSchools = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/schools', { params: { page, limit: 10, search } })
      setSchools(data.data)
      setPagination(data.pagination)
    } catch {
      toast.error('Erro ao carregar escolas')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchSchools() }, [fetchSchools])

  const openCreate = () => { setEditingSchool(null); reset({}); setModalOpen(true) }
  const openEdit = (school) => { setEditingSchool(school); reset(school); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingSchool(null); reset({}) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editingSchool) {
        await api.put(`/schools/${editingSchool.id}`, data)
        toast.success('Escola atualizada!')
      } else {
        await api.post('/schools', data)
        toast.success('Escola cadastrada!')
      }
      closeModal()
      fetchSchools()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar escola')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/schools/${deleteId}`)
      toast.success('Escola removida')
      setDeleteId(null)
      fetchSchools()
    } catch {
      toast.error('Erro ao remover escola')
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Buscar por nome, cidade..."
            className="input pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <button onClick={openCreate} className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" /> Nova Escola
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Carregando escolas..." />
        ) : schools.length === 0 ? (
          <EmptyState icon={School} title="Nenhuma escola encontrada" description="Cadastre a primeira escola para começar." action={<button onClick={openCreate} className="btn-primary">Nova Escola</button>} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Escola</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Localização</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Responsável</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Formulários</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {schools.map((school) => (
                    <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <School className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{school.name}</p>
                            <p className="text-xs text-gray-400 md:hidden">{school.city}/{school.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{school.city} — {school.state}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                        {school.responsible ? (
                          <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" />{school.responsible}</div>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="badge-blue">{school._count?.forms ?? 0} formulários</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(school)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {isAdmin() && (
                            <button onClick={() => setDeleteId(school.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      <Modal open={modalOpen} onClose={closeModal} title={editingSchool ? 'Editar Escola' : 'Nova Escola'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Nome da Escola *</label>
              <input className={`input ${errors.name ? 'input-error' : ''}`} {...register('name', { required: 'Obrigatório' })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Cidade *</label>
              <input className={`input ${errors.city ? 'input-error' : ''}`} {...register('city', { required: 'Obrigatório' })} />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="label">Estado (UF) *</label>
              <input className={`input ${errors.state ? 'input-error' : ''}`} maxLength={2} {...register('state', { required: 'Obrigatório', maxLength: { value: 2, message: 'Ex: PR' } })} />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="label">Endereço *</label>
              <input className={`input ${errors.address ? 'input-error' : ''}`} {...register('address', { required: 'Obrigatório' })} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <label className="label">Telefone</label>
              <input className="input" placeholder="(00) 00000-0000" {...register('phone')} />
            </div>
            <div>
              <label className="label">Responsável</label>
              <input className="input" {...register('responsible')} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : editingSchool ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remover Escola"
        message="Tem certeza que deseja remover esta escola? Os formulários vinculados não serão excluídos."
        confirmLabel="Remover"
        danger
      />
    </div>
  )
}
