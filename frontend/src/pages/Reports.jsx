import { useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Download, FileSpreadsheet, FileText, Filter } from 'lucide-react'

export default function Reports() {
  const [schools, setSchools] = useState([])
  const [schoolId, setSchoolId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState({})

  useEffect(() => { api.get('/schools/simple').then(({ data }) => setSchools(data)) }, [])

  const download = async (resource, format) => {
    const key = `${resource}_${format}`
    setLoading((l) => ({ ...l, [key]: true }))
    try {
      const params = { format }
      if (schoolId) params.schoolId = schoolId
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const { data, headers } = await api.get(`/reports/${resource}`, {
        params,
        responseType: 'blob',
      })

      const contentDisposition = headers['content-disposition'] || ''
      const filename = contentDisposition.match(/filename="(.+)"/)?.[1] || `${resource}_ellp.${format}`

      const url = URL.createObjectURL(new Blob([data]))
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Relatório ${format.toUpperCase()} exportado!`)
    } catch {
      toast.error('Erro ao gerar relatório')
    } finally {
      setLoading((l) => ({ ...l, [key]: false }))
    }
  }

  const reports = [
    {
      title: 'Formulários Socioeconômicos',
      description: 'Exporta todos os dados dos formulários cadastrados com filtros por escola e data.',
      resource: 'forms',
      icon: FileText,
      color: 'blue',
    },
    {
      title: 'Escolas',
      description: 'Exporta a lista de escolas cadastradas com quantidade de formulários vinculados.',
      resource: 'schools',
      icon: FileSpreadsheet,
      color: 'green',
    },
  ]

  const colorMap = {
    blue: { icon: 'bg-blue-100 text-blue-600', border: 'border-blue-100' },
    green: { icon: 'bg-green-100 text-green-600', border: 'border-green-100' },
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-gray-800">Filtros de Exportação</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Escola</label>
            <select className="input" value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
              <option value="">Todas as escolas</option>
              {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Data Inicial</label>
            <input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Data Final</label>
            <input type="date" className="input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map(({ title, description, resource, icon: Icon, color }) => (
          <div key={resource} className={`card border ${colorMap[color].border}`}>
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color].icon} flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => download(resource, 'csv')}
                disabled={loading[`${resource}_csv`]}
                className="flex-1 btn-secondary justify-center text-sm"
              >
                <Download className="w-4 h-4" />
                {loading[`${resource}_csv`] ? 'Gerando...' : 'CSV'}
              </button>
              <button
                onClick={() => download(resource, 'xlsx')}
                disabled={loading[`${resource}_xlsx`]}
                className="flex-1 btn-success justify-center text-sm"
              >
                <Download className="w-4 h-4" />
                {loading[`${resource}_xlsx`] ? 'Gerando...' : 'Excel'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-gray-50 border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2 text-sm">Informações sobre exportação</h4>
        <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
          <li>Arquivos CSV podem ser abertos no Excel ou Google Sheets</li>
          <li>Arquivos Excel (.xlsx) já estão formatados para visualização</li>
          <li>Os filtros aplicados acima afetam todos os relatórios</li>
          <li>Dados sensíveis (CPF) são incluídos apenas para usuários autorizados</li>
        </ul>
      </div>
    </div>
  )
}
