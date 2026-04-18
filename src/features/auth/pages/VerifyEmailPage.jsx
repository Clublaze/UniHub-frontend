// Place at: src/features/auth/pages/VerifyEmailPage.jsx
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { verifyEmailApi, resendVerificationApi } from '../auth.api'
import AuthLayout from '../components/AuthLayout'
import * as S from '../components/authStyles'

const Spinner = () => (
  <div style={{
    width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 20px',
    border: '3px solid rgba(56,189,248,0.15)',
    borderTopColor: '#38bdf8',
    animation: 'spin 0.8s linear infinite',
  }} />
)

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
    <AuthLayout showFooter={false}>
      {/* Inject spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ ...S.card, textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <Spinner />
            <h2 style={{ ...S.heading, textAlign: 'center' }}>Verifying your email</h2>
            <p style={{ ...S.subheading, margin: '6px 0 0', textAlign: 'center' }}>
              Just a moment...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 20px',
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
            }}>
              ✅
            </div>
            <h2 style={{ ...S.heading, textAlign: 'center' }}>Email verified!</h2>
            <p style={{ ...S.subheading, margin: '6px 0 24px', textAlign: 'center' }}>
              Redirecting to login in 3 seconds...
            </p>
            <Link to="/auth/login" style={{
              ...S.link,
              display: 'inline-block',
              padding: '10px 24px',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: '8px',
            }}>
              Go to login →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 20px',
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
            }}>
              ❌
            </div>
            <h2 style={{ ...S.heading, textAlign: 'center' }}>Link expired or invalid</h2>
            <p style={{ ...S.subheading, margin: '6px 0 24px', textAlign: 'center' }}>
              Request a new verification link below.
            </p>
            <div style={{ textAlign: 'left' }}>
              <label style={S.label}>Your email address</label>
              <input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ ...S.input, marginBottom: '12px' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
              <button
                onClick={handleResend}
                disabled={resending}
                style={resending ? S.btnDisabled : S.btn}
              >
                {resending ? 'Sending...' : 'Request New Link'}
              </button>
            </div>
            <p style={{ ...S.mutedText, marginTop: '20px' }}>
              <Link to="/auth/login" style={S.linkSm}>Back to login</Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
