import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useLogin } from '../hooks/useLogin'
import { resendVerificationApi } from '../auth.api'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [unverifiedEmail, setUnverifiedEmail] = useState(null)
  const [resending, setResending] = useState(false)

  const { mutate: login, isPending, error } = useLogin()

  // Parse error message from backend
  const errMsg = error?.response?.data?.message || ''
  const status = error?.response?.status

  const getErrorText = () => {
    if (status === 401) return 'Incorrect email or password.'
    if (status === 403 && errMsg.toLowerCase().includes('blocked'))
      return 'Your account has been suspended. Contact your administrator.'
    if (status === 429)
      return 'Too many failed attempts. Please wait 15 minutes before trying again.'
    if (errMsg) return errMsg
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setUnverifiedEmail(null)
    login(
      { email, password },
      {
        onError: (err) => {
          const msg = err?.response?.data?.message || ''
          if (err?.response?.status === 403 && msg.toLowerCase().includes('verify')) {
            setUnverifiedEmail(email)
          }
        },
      }
    )
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerificationApi(unverifiedEmail)
      toast.success('Verification email sent!')
    } catch {
      toast.error('Failed to resend. Try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in to UniHub</CardTitle>
          <CardDescription>Enter your university email to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Unverified email banner */}
          {unverifiedEmail && (
            <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              <p className="font-medium">Please verify your email before logging in.</p>
              <p className="mt-1 text-yellow-700">We sent a link to {unverifiedEmail}</p>
              <Button
                variant="link"
                className="mt-1 h-auto p-0 text-yellow-800 underline"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@ug.sharda.ac.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {/* General error (not unverified) */}
            {error && !unverifiedEmail && (
              <p className="text-sm text-destructive">{getErrorText()}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/auth/register" className="underline hover:text-foreground">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}