// Place at: src/features/auth/pages/LoginPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useLogin } from '../hooks/useLogin'
import { resendVerificationApi } from '../auth.api'
import AuthLayout from '../components/AuthLayout'
import * as S from '../components/authStyles'

const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState(null)
  const [resending, setResending] = useState(false)

  const { mutate: login, isPending, error } = useLogin()

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
    login({ email, password }, {
      onError: (err) => {
        const msg = err?.response?.data?.message || ''
        if (err?.response?.status === 403 && msg.toLowerCase().includes('verify')) {
          setUnverifiedEmail(email)
        }
      },
    })
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
    <AuthLayout>
      <div style={S.card}>
        <h2 style={S.heading}>Welcome back</h2>
        <p style={S.subheading}>Sign in to your UniHub account</p>

        {/* Unverified email banner */}
        {unverifiedEmail && (
          <div style={S.warningBanner}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(251,191,36,0.95)', margin: '0 0 4px' }}>
              Please verify your email before logging in.
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(251,191,36,0.75)', margin: '0 0 8px' }}>
              We sent a link to {unverifiedEmail}
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: 'rgba(251,191,36,0.9)', fontSize: '12px',
                cursor: resending ? 'not-allowed' : 'pointer',
                textDecoration: 'underline', fontFamily: 'inherit',
              }}
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={S.fieldGroup}>
            <label style={S.label}>Username or Email</label>
            <input
              type="email"
              placeholder="you@ug.sharda.ac.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={S.input}
              onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Password */}
          <div style={S.fieldGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label style={{ ...S.label, marginBottom: 0 }}>Password</label>
              <Link to="/auth/forgot-password" style={{ ...S.linkSm, color: '#38bdf8' }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={S.inputWithEye}
                onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} style={S.eyeBtn}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* General error */}
          {error && !unverifiedEmail && (
            <p style={S.errorText}>{getErrorText()}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{ ...( isPending ? S.btnDisabled : S.btn), marginTop: '22px' }}
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ ...S.mutedText, marginTop: '20px' }}>
          Don't have an account?{' '}
          <Link to="/auth/register" style={S.link}>Sign up</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
