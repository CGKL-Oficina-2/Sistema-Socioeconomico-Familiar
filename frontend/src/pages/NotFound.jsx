import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Página não encontrada</h1>
        <p className="text-gray-500 mt-2 mb-6">A página que você procura não existe.</p>
        <Link to="/" className="btn-primary">Voltar ao início</Link>
      </div>
    </div>
  )
}
