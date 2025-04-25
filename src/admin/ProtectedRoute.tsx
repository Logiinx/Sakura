import React, { useState, useEffect } from "react"

import { supabase } from "@/lib/supabase" // Adjust path if needed
import type { Session } from "@supabase/supabase-js"

import Login from "./Login" // Import the Login component

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial session state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed, new session:", session)
      setSession(session)
      if (_event !== "INITIAL_SESSION") {
        // Avoid setting loading false again if it's just the initial check completing
        setLoading(false)
      }
    })

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p> {/* Or use a spinner component */}
      </div>
    )
  }

  // If no session, render the Login component
  if (!session) {
    return (
      <Login
        onLoginSuccess={() => {
          /* Session state will update via listener */
        }}
      />
    )
  }

  // If session exists, render the protected child component
  return <>{children}</>
}

export default ProtectedRoute
