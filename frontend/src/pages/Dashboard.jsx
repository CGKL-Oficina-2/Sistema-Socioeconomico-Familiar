import { useState, useEffect } from 'react'
import api from '../services/api'
import { StatCard, LoadingSpinner } from '../components/ui/index'
import { Users, School, Wifi, TrendingUp, Monitor, Heart } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#003082', '#FFB800', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Carregando estatísticas..." />

  const { summary, charts, recentForms } = stats || {}

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Famílias Cadastradas" value={summary?.totalFamilies ?? 0} icon={Users} color="blue" subtitle="Total no sistema" />
        <StatCard title="Escolas Ativas" value={summary?.totalSchools ?? 0} icon={School} color="green" subtitle="Cadastradas" />
        <StatCard title="Renda Média" value={`R$ ${(summary?.avgIncome ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={TrendingUp} color="yellow" subtitle="Por família" />
        <StatCard title="Acesso à Internet" value={`${summary?.internetAccessRate ?? 0}%`} icon={Wifi} color="purple" subtitle="Das famílias" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Média de Moradores" value={summary?.avgResidents ?? 0} icon={Users} color="blue" subtitle="Por residência" />
        <StatCard title="Acesso a Computador" value={`${summary?.computerAccessRate ?? 0}%`} icon={Monitor} color="green" subtitle="Das famílias" />
        <StatCard title="Auxílio Governamental" value={`${summary?.govAssistanceRate ?? 0}%`} icon={Heart} color="red" subtitle="Recebem algum auxílio" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income distribution */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Distribuição de Renda</h3>
          {charts?.incomeDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts.incomeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(v) => [`${v} famílias`, 'Quantidade']} />
                <Bar dataKey="count" fill="#003082" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">Sem dados</p>}
        </div>

        {/* School distribution */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Famílias por Escola</h3>
          {charts?.schoolDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={charts.schoolDistribution}
                  dataKey="count"
                  nameKey="schoolName"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {charts.schoolDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">Sem dados</p>}
        </div>

        {/* Access comparison */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Acesso a Recursos</h3>
          {charts?.accessComparison ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts.accessComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="hasAccess" name="Com acesso" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="noAccess" name="Sem acesso" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">Sem dados</p>}
        </div>

        {/* Recent forms */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Últimos Cadastros</h3>
          <div className="space-y-3">
            {recentForms?.length > 0 ? recentForms.map((f) => (
              <div key={f.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                  {f.anonymous ? '?' : (f.responsibleName?.charAt(0) || '?')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {f.anonymous ? 'Anônimo' : (f.responsibleName || 'Sem nome')}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{f.school?.name || 'Sem escola'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">R$ {Number(f.familyIncome).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            )) : <p className="text-gray-400 text-sm text-center py-8">Nenhum formulário cadastrado</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
