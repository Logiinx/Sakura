import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')]">
      <div className="rounded-lg bg-gray-900 bg-opacity-60 p-4 text-center">
        <h1 className="mb-4 text-4xl font-bold text-sakura-pink">404</h1>
        <p className="mb-4 text-xl text-sakura-pink">Oops! Page non trouvée</p>
        <a href="/" className="text-sakura-pink underline hover:font-bold">
          Retour à l&apos;accueil
        </a>
      </div>
    </div>
  )
}

export default NotFound
