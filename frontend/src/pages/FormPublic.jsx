import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'
import { BookOpen, CheckCircle, ArrowLeft } from 'lucide-react'

export default function FormPublic() {
  const [schools, setSchools] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [anonymous, setAnonymous] = useState(true)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { anonymous: true } })
  const govAssistance = watch('govAssistance')

  useEffect(() => {
    api.get('/schools/simple').then(({ data }) => setSchools(data)).catch(() => {})
  }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await api.post('/forms/public', {
        ...data,
        anonymous: data.anonymous === true || data.anonymous === 'true',
        internetAccess: data.internetAccess === true || data.internetAccess === 'true',
        computerAccess: data.computerAccess === true || data.computerAccess === 'true',
        govAssistance: data.govAssistance === true || data.govAssistance === 'true',
        schoolId: data.schoolId ? parseInt(data.schoolId) : null,
        residents: parseInt(data.residents),
        familyIncome: parseFloat(data.familyIncome),
      })
      setSubmitted(true)
    } catch (err) {
      const errs = err.response?.data?.errors
      if (errs) errs.forEach(e => toast.error(e.msg))
      else toast.error('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-utfpr-blue to-blue-900 flex items-center justify-center p-4">
        <Toaster />
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Formulário Enviado!</h2>
          <p className="text-gray-500 text-sm mb-6">Obrigado pela participação. Suas informações contribuem para melhorar o projeto ELLP.</p>
          <a href="/formulario-publico" className="btn-primary justify-center w-full">Enviar outro</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-utfpr-blue to-blue-900 py-8 px-4">
      <Toaster />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-utfpr-yellow rounded-xl mb-3">
            <BookOpen className="w-7 h-7 text-utfpr-blue" />
          </div>
          <h1 className="text-white text-2xl font-bold">Formulário Socioeconômico</h1>
          <p className="text-blue-300 text-sm mt-1">Projeto ELLP — UTFPR</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
            <strong>Suas informações são confidenciais.</strong> Os dados coletados são utilizados exclusivamente para fins acadêmicos pelo projeto de extensão ELLP.
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Identificação</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" {...register('anonymous')} onChange={(e) => setAnonymous(e.target.checked)} defaultChecked />
                <span className="text-sm text-gray-700">Prefiro não me identificar</span>
              </label>
            </div>

            {!anonymous && (
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
            )}

            <div>
              <label className="label">Escola</label>
              <select className="input" {...register('schoolId')}>
                <option value="">Selecione uma escola...</option>
                {schools.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.city}/{s.state}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Renda Familiar Mensal (R$) *</label>
                <input className={`input ${errors.familyIncome ? 'input-error' : ''}`} type="number" step="0.01" min="0" placeholder="0,00"
                  {...register('familyIncome', { required: 'Obrigatório' })} />
                {errors.familyIncome && <p className="text-red-500 text-xs mt-1">{errors.familyIncome.message}</p>}
              </div>
              <div>
                <label className="label">Número de Moradores *</label>
                <input className={`input ${errors.residents ? 'input-error' : ''}`} type="number" min="1"
                  {...register('residents', { required: 'Obrigatório', min: { value: 1, message: 'Mínimo 1' } })} />
                {errors.residents && <p className="text-red-500 text-xs mt-1">{errors.residents.message}</p>}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Recursos Disponíveis</h3>
              <div className="space-y-3">
                {[
                  { name: 'internetAccess', label: 'Tenho acesso à internet em casa' },
                  { name: 'computerAccess', label: 'Tenho computador ou notebook em casa' },
                  { name: 'govAssistance', label: 'Recebo algum auxílio governamental' },
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

            <div>
              <label className="label">Observações (opcional)</label>
              <textarea className="input resize-none" rows={3} {...register('observations')} />
            </div>

            <button type="submit" disabled={saving} className="w-full btn-primary justify-center py-3 text-base">
              {saving ? 'Enviando...' : 'Enviar Formulário'}
            </button>
          </form>
        </div>

        <p className="text-blue-400 text-xs text-center mt-4">
          Já tem acesso? <a href="/login" className="text-blue-300 hover:text-white underline">Entrar no sistema</a>
        </p>
      </div>
    </div>
  )
}
