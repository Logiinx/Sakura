import React, { useEffect, useState, useCallback } from "react"

import { supabase } from "@/lib/supabase" // Adjust path if needed
import type { Session } from "@supabase/supabase-js"
import { toast } from "sonner"

import Login from "./Login" // Import the Login component

// Session configuration
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000 // Show warning 5 minutes before timeout
const CHECK_INTERVAL = 60 * 1000 // Check session every minute

interface SessionInfo {
  lastActivity: number
  warningShown: boolean
}

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    lastActivity: Date.now(),
    warningShown: false,
  })

  // Update last activity time
  const updateActivity = useCallback(() => {
    setSessionInfo((prev) => ({
      ...prev,
      lastActivity: Date.now(),
      warningShown: false,
    }))
  }, [])

  // Handle session timeout
  const handleSessionTimeout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      toast.error("Session expirée. Veuillez vous reconnecter.")
    } catch (error) {
      console.error(
        "Erreur lors de l'expiration de session:",
        error instanceof Error ? error.message : "Erreur inconnue"
      )
    }
  }, [])

  // Show session warning
  const showSessionWarning = useCallback(() => {
    if (!sessionInfo.warningShown) {
      setSessionInfo((prev) => ({ ...prev, warningShown: true }))
      toast.warning("Votre session expirera dans 5 minutes. Veuillez sauvegarder votre travail.", {
        duration: 10000,
      })
    }
  }, [sessionInfo.warningShown])

  // Check session validity
  const checkSession = useCallback(async () => {
    try {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Erreur de vérification de session:", error.message)
        await handleSessionTimeout()
        return
      }

      if (!currentSession) {
        setSession(null)
        return
      }

      // Check if session is expired based on Supabase's expiration
      const now = Date.now() / 1000 // Convert to seconds
      if (currentSession.expires_at && currentSession.expires_at < now) {
        await handleSessionTimeout()
        return
      }

      // Check our custom activity timeout
      const timeSinceActivity = Date.now() - sessionInfo.lastActivity

      if (timeSinceActivity > SESSION_TIMEOUT) {
        await handleSessionTimeout()
        return
      }

      // Show warning if approaching timeout
      if (timeSinceActivity > SESSION_TIMEOUT - WARNING_TIME && !sessionInfo.warningShown) {
        showSessionWarning()
      }

      setSession(currentSession)
    } catch (error) {
      console.error("Erreur de validation de session:", error instanceof Error ? error.message : "Erreur inconnue")
      await handleSessionTimeout()
    }
  }, [sessionInfo.lastActivity, sessionInfo.warningShown, handleSessionTimeout, showSessionWarning])

  useEffect(() => {
    // Check initial session state
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Erreur de session initiale:", error.message)
          setSession(null)
        } else {
          setSession(session)
          if (session) {
            updateActivity()
          }
        }
      } catch (error) {
        console.error(
          "Erreur d'initialisation d'authentification:",
          error instanceof Error ? error.message : "Erreur inconnue"
        )
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === "SIGNED_IN" && session) {
          setSession(session)
          updateActivity()
          toast.success("Connexion réussie")
        } else if (event === "SIGNED_OUT") {
          setSession(null)
          setSessionInfo({ lastActivity: Date.now(), warningShown: false })
        } else if (event === "TOKEN_REFRESHED" && session) {
          setSession(session)
          updateActivity()
        } else if (event === "USER_UPDATED" && session) {
          setSession(session)
        }
      } catch (error) {
        console.error(
          "Erreur de changement d'état d'authentification:",
          error instanceof Error ? error.message : "Erreur inconnue"
        )
      }

      if (event !== "INITIAL_SESSION") {
        setLoading(false)
      }
    })

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [updateActivity])

  // Set up session monitoring
  useEffect(() => {
    if (!session) return

    // Check session periodically
    const sessionInterval = setInterval(checkSession, CHECK_INTERVAL)

    // Listen for user activity to reset timeout
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const handleActivity = () => {
      updateActivity()
    }

    // Add event listeners for user activity
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      clearInterval(sessionInterval)
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [session, checkSession, updateActivity])

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session) {
        // Page became visible, check session validity
        checkSession()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [session, checkSession])

  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-sakura-pink"></div>
          <p className="text-gray-600">Vérification de l&apos;authentification...</p>
        </div>
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
