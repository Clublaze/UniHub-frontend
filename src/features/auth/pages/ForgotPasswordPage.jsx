// Place at: src/features/auth/pages/ForgotPasswordPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPasswordApi } from '../auth.api'
import AuthLayout from '../components/AuthLayout'
import * as S from '../components/authStyles'

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPasswordApi(email)
    } finally {
      // Always show success — backend never reveals if email exists
      setSent(true)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <div style={{ ...S.card, textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 20px',
            background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
          }}>
            📧
          </div>
          <h2 style={S.heading}>Check your inbox</h2>
          <p style={{ ...S.subheading, margin: '6px 0 28px' }}>
            If an account exists for{' '}
            <span style={{ color: '#38bdf8', fontWeight: '500' }}>{email}</span>,
            you'll receive a reset link shortly.
          </p>
          <Link to="/auth/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none',
          }}>
            <BackIcon /> Back to login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div style={S.card}>
        <Link to="/auth/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none',
          marginBottom: '24px',
        }}>
          <BackIcon /> Back to login
        </Link>

        <h2 style={S.heading}>Forgot password</h2>
        <p style={S.subheading}>Enter your email to receive a reset link</p>

        <form onSubmit={handleSubmit}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Email</label>
            <input
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={S.input}
              onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...(loading ? S.btnDisabled : S.btn), marginTop: '4px' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
