import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Users as UsersIcon } from 'lucide-react'
import { Modal, LoadingSpinner, EmptyState, ConfirmDialog } from '../components/ui/index'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/users')
      setUsers(data)
    } catch { toast.error('Erro ao carregar usuários') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreate = () => { setEditingUser(null); reset({}); setModalOpen(true) }
  const openEdit = (u) => { setEditingUser(u); reset({ name: u.name, email: u.email, role: u.role, active: u.active }); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingUser(null); reset({}) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, data)
        toast.success('Usuário atualizado!')
      } else {
        await api.post('/users', data)
        toast.success('Usuário criado!')
      }
      closeModal(); fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`)
      toast.success('Usuário desativado')
      setDeleteId(null); fetchUsers()
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao remover') }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> Novo Usuário</button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? <LoadingSpinner text="Carregando..." /> : users.length === 0 ? (
          <EmptyState icon={UsersIcon} title="Nenhum usuário" action={<button onClick={openCreate} className="btn-primary">Novo Usuário</button>} />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Usuário</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Perfil</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-utfpr-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={u.role === 'ADMIN' ? 'badge-blue' : 'badge-gray'}>
                      {u.role === 'ADMIN' ? 'Administrador' : 'Voluntário'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={u.active ? 'badge-green' : 'badge-red'}>{u.active ? 'Ativo' : 'Inativo'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => openEdit(u)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(u.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={closeModal} title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Nome *</label>
            <input className={`input ${errors.name ? 'input-error' : ''}`} {...register('name', { required: 'Obrigatório' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">E-mail *</label>
            <input type="email" className={`input ${errors.email ? 'input-error' : ''}`} {...register('email', { required: 'Obrigatório' })} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          {!editingUser && (
            <div>
              <label className="label">Senha *</label>
              <input type="password" className={`input ${errors.password ? 'input-error' : ''}`}
                {...register('password', { required: 'Obrigatório', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          )}
          <div>
            <label className="label">Perfil</label>
            <select className="input" {...register('role')}>
              <option value="VOLUNTARIO">Voluntário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          {editingUser && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" {...register('active')} />
              <span className="text-sm text-gray-700">Usuário ativo</span>
            </label>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvando...' : editingUser ? 'Atualizar' : 'Criar'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Desativar Usuário" message="Tem certeza que deseja desativar este usuário?" confirmLabel="Desativar" danger />
    </div>
  )
}
