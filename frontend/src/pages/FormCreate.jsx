import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Save } from 'lucide-react'

export default function FormCreate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [schools, setSchools] = useState([])
  const [saving, setSaving] = useState(false)
  const [anonymous, setAnonymous] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { anonymous: false, internetAccess: false, computerAccess: false, govAssistance: false }
  })

  const govAssistance = watch('govAssistance')

  useEffect(() => {
    api.get('/schools/simple').then(({ data }) => setSchools(data))
    if (isEdit) {
      api.get(`/forms/${id}`).then(({ data }) => {
        setAnonymous(data.anonymous)
        reset({
          ...data,
          schoolId: data.schoolId?.toString() || '',
          anonymous: data.anonymous,
        })
      })
    }
  }, [id])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        ...data,
        anonymous: data.anonymous === true || data.anonymous === 'true',
        internetAccess: data.internetAccess === true || data.internetAccess === 'true',
        computerAccess: data.computerAccess === true || data.computerAccess === 'true',
        govAssistance: data.govAssistance === true || data.govAssistance === 'true',
        schoolId: data.schoolId ? parseInt(data.schoolId) : null,
        residents: parseInt(data.residents),
        familyIncome: parseFloat(data.familyIncome),
      }
      if (isEdit) {
        await api.put(`/forms/${id}`, payload)
        toast.success('Formulário atualizado!')
      } else {
        await api.post('/forms', payload)
        toast.success('Formulário cadastrado!')
      }
      navigate('/formularios')
    } catch (err) {
      const errs = err.response?.data?.errors
      if (errs) errs.forEach(e => toast.error(e.msg))
      else toast.error(err.response?.data?.error || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/formularios')} className="btn-secondary py-1.5 px-3">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {isEdit ? 'Editar Formulário' : 'Novo Formulário Socioeconômico'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Anonymity */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Tipo de Cadastro</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded"
              {...register('anonymous')}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Cadastro anônimo (sem identificação pessoal)</span>
          </label>
        </div>

        {!anonymous && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Dados do Responsável</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Nome do Responsável</label>
                <input className="input" {...register('responsibleName')} />
              </div>
              <div>
                <label className="label">CPF</label>
                <input className="input" placeholder="000.000.000-00" {...register('cpf')} />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input className="input" placeholder="(00) 00000-0000" {...register('phone')} />
              </div>
              <div className="md:col-span-2">
                <label className="label">E-mail</label>
                <input className="input" type="email" {...register('email')} />
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Escola</h3>
          <div>
            <label className="label">Escola Vinculada</label>
            <select className="input" {...register('schoolId')}>
              <option value="">Selecione uma escola...</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.city}/{s.state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Dados Socioeconômicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Renda Familiar Mensal (R$) *</label>
              <input
                className={`input ${errors.familyIncome ? 'input-error' : ''}`}
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register('familyIncome', { required: 'Obrigatório', min: { value: 0, message: 'Valor inválido' } })}
              />
              {errors.familyIncome && <p className="text-red-500 text-xs mt-1">{errors.familyIncome.message}</p>}
            </div>
            <div>
              <label className="label">Número de Moradores *</label>
              <input
                className={`input ${errors.residents ? 'input-error' : ''}`}
                type="number"
                min="1"
                {...register('residents', { required: 'Obrigatório', min: { value: 1, message: 'Mínimo 1' } })}
              />
              {errors.residents && <p className="text-red-500 text-xs mt-1">{errors.residents.message}</p>}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Acesso a Recursos</h3>
          <div className="space-y-3">
            {[
              { name: 'internetAccess', label: 'Possui acesso à internet em casa' },
              { name: 'computerAccess', label: 'Possui computador ou notebook em casa' },
              { name: 'govAssistance', label: 'Recebe algum auxílio governamental' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" {...register(name)} />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
            {govAssistance && (
              <div className="ml-7">
                <label className="label">Qual auxílio?</label>
                <input className="input" placeholder="Ex: Bolsa Família, BPC..." {...register('govAssistanceType')} />
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Observações</h3>
          <textarea className="input resize-none" rows={4} placeholder="Informações adicionais relevantes..." {...register('observations')} />
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/formularios')} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  )
}
