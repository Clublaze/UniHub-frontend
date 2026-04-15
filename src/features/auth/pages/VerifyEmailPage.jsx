import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { verifyEmailApi, resendVerificationApi } from '../auth.api'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent } from '../../../components/ui/card'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')

  const [status, setStatus] = useState('loading') // loading | success | error
  const [email, setEmail] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!token) { setStatus('error'); return }

    verifyEmailApi(token)
      .then(() => {
        setStatus('success')
        // Auto-redirect to login after 3s
        setTimeout(() => { window.location.href = '/auth/login' }, 3000)
      })
      .catch(() => setStatus('error'))
  }, [token])

  const handleResend = async () => {
    if (!email) return toast.error('Enter your email first')
    setResending(true)
    try {
      await resendVerificationApi(email)
      toast.success('New verification link sent!')
    } catch {
      toast.error('Failed to resend.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          {status === 'loading' && (
            <p className="text-muted-foreground">Verifying your email...</p>
          )}

          {status === 'success' && (
            <>
              <div className="text-4xl">✅</div>
              <h2 className="text-xl font-semibold">Email verified!</h2>
              <p className="text-muted-foreground text-sm">
                Redirecting to login in 3 seconds...
              </p>
              <Link to="/auth/login" className="text-sm underline">
                Go now
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-4xl">❌</div>
              <h2 className="text-xl font-semibold">Link expired or invalid</h2>
              <p className="text-muted-foreground text-sm">
                Request a new verification link below.
              </p>
              <div className="space-y-2 text-left">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Button className="w-full" onClick={handleResend} disabled={resending}>
                  {resending ? 'Sending...' : 'Request New Link'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}