import { useLocation } from "react-router-dom"
import { useEffect } from "react"

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')]">
      <div className="text-center bg-gray-900 bg-opacity-60 p-4 rounded-lg">
        <h1 className="text-4xl text-sakura-pink font-bold  mb-4">404</h1>
        <p className="text-xl text-sakura-pink mb-4 ">Oops! Page non trouvée</p>
        <a href="/" className="text-sakura-pink hover:font-bold underline">
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}

export default NotFound
