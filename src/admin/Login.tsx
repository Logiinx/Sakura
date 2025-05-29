import React, { useState, useEffect } from "react"
import { FiAlertCircle, FiShield } from "react-icons/fi"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase" // Adjust path if needed
import { toast } from "sonner"

// Rate limiting configuration
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds
const ATTEMPT_WINDOW = 5 * 60 * 1000 // 5 minutes window for attempts

interface LoginAttempt {
  timestamp: number
  ip?: string
}

// Simple in-memory rate limiting (in production, use Redis or database)
class RateLimiter {
  private attempts = new Map<string, LoginAttempt[]>()

  isBlocked(identifier: string): boolean {
    const userAttempts = this.attempts.get(identifier) || []
    const now = Date.now()

    // Clean old attempts
    const recentAttempts = userAttempts.filter((attempt) => now - attempt.timestamp < ATTEMPT_WINDOW)

    this.attempts.set(identifier, recentAttempts)

    // Check if user is locked out
    if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
      const lastAttempt = recentAttempts[recentAttempts.length - 1]
      return now - lastAttempt.timestamp < LOCKOUT_DURATION
    }

    return false
  }

  recordAttempt(identifier: string): void {
    const userAttempts = this.attempts.get(identifier) || []
    userAttempts.push({ timestamp: Date.now() })
    this.attempts.set(identifier, userAttempts)
  }

  getRemainingLockoutTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier) || []
    if (userAttempts.length < MAX_LOGIN_ATTEMPTS) return 0

    const lastAttempt = userAttempts[userAttempts.length - 1]
    const lockoutEnd = lastAttempt.timestamp + LOCKOUT_DURATION
    const remaining = lockoutEnd - Date.now()

    return Math.max(0, remaining)
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

const rateLimiter = new RateLimiter()

// Define the props the Login component expects, including onLoginSuccess callback
interface LoginProps {
  onLoginSuccess: () => void
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)

  // Check rate limiting status on component mount and periodically
  useEffect(() => {
    const checkRateLimit = () => {
      const identifier = email || "anonymous"
      const blocked = rateLimiter.isBlocked(identifier)
      const remaining = rateLimiter.getRemainingLockoutTime(identifier)

      setIsBlocked(blocked)
      setLockoutTimeRemaining(remaining)
    }

    checkRateLimit()
    const interval = setInterval(checkRateLimit, 1000)

    return () => clearInterval(interval)
  }, [email])

  // Format remaining lockout time
  const formatLockoutTime = (ms: number): string => {
    const minutes = Math.ceil(ms / (60 * 1000))
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  }

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // // Validate password strength
  // const isValidPassword = (password: string): boolean => {
  //   return password.length >= 8
  // }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission
    setError(null)

    // Client-side validation
    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    // if (!isValidPassword(password)) {
    //   setError("Password must be at least 8 characters long")
    //   return
    // }

    // Check rate limiting
    const identifier = email.toLowerCase().trim()
    if (rateLimiter.isBlocked(identifier)) {
      const remaining = rateLimiter.getRemainingLockoutTime(identifier)
      setError(`Too many failed attempts. Please try again in ${formatLockoutTime(remaining)}`)
      return
    }

    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      })

      if (signInError) {
        // Record failed attempt
        rateLimiter.recordAttempt(identifier)
        setAttemptCount((prev) => prev + 1)

        // Provide generic error message for security
        let errorMessage = "Échec de la connexion."
        if (signInError.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect."
        } else if (signInError.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez vérifier votre email et confirmer votre compte"
        } else {
          errorMessage = "Échec de la connexion. Veuillez réessayer."
        }

        setError(errorMessage)
        toast.error(errorMessage)
        throw signInError
      }

      // Success - reset rate limiter for this user
      rateLimiter.reset(identifier)
      setAttemptCount(0)

      // Clear form data
      setEmail("")
      setPassword("")

      // console.log("Login successful!") // Commented out log
      toast.success("Connexion réussie!")
      onLoginSuccess() // Call the callback function provided by the parent
    } catch (err) {
      console.error("Login failed:", err) // Keep console.error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[url('https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/camera404.webp')] bg-cover bg-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-bad-script text-3xl font-bold tracking-widest">
            Panel Admin <br /> Connexion
          </CardTitle>
          <CardDescription>Veuillez vous connecter pour continuer.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemple.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || isBlocked}
                autoComplete="email"
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || isBlocked}
                autoComplete="current-password"
                placeholder="Entrez votre mot de passe"
                minLength={8}
              />
            </div>

            {/* Rate limiting warning */}
            {attemptCount > 0 && attemptCount < MAX_LOGIN_ATTEMPTS && (
              <Alert>
                <FiShield className="h-4 w-4" />
                <AlertDescription>
                  {MAX_LOGIN_ATTEMPTS - attemptCount} tentative{MAX_LOGIN_ATTEMPTS - attemptCount !== 1 ? "s" : ""}{" "}
                  restante{MAX_LOGIN_ATTEMPTS - attemptCount !== 1 ? "s" : ""} avant verrouillage temporaire
                </AlertDescription>
              </Alert>
            )}

            {/* Lockout warning */}
            {isBlocked && (
              <Alert variant="destructive">
                <FiAlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Compte temporairement verrouillé en raison de trop nombreuses tentatives échouées. Veuillez réessayer
                  dans {formatLockoutTime(lockoutTimeRemaining)}.
                </AlertDescription>
              </Alert>
            )}

            {/* General error */}
            {error && !isBlocked && (
              <Alert variant="destructive">
                <FiAlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="hover:bg-sakura flex w-full rounded-md bg-sakura-pink font-semibold !text-white shadow-md text-shadow-md hover:bg-opacity-90"
              disabled={loading || isBlocked || !email || !password}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
