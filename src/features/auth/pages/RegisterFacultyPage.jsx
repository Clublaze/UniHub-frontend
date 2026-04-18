// Place at: src/features/auth/pages/RegisterFacultyPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useRegisterFaculty } from '../hooks/useRegister'
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

export default function RegisterFacultyPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)
  const [resending, setResending] = useState(false)

  const { mutate: register, isPending, error } = useRegisterFaculty()
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    register(form, { onSuccess: () => setDone(true) })
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerificationApi(form.email)
      toast.success('Verification email resent!')
    } catch {
      toast.error('Failed to resend.')
    } finally {
      setResending(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <AuthLayout>
        <div style={{ ...S.card, textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 20px',
            background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
          }}>
            ✉️
          </div>
          <h2 style={S.heading}>Verification email sent</h2>
          <p style={{ ...S.subheading, margin: '6px 0 24px' }}>
            Click the link sent to{' '}
            <span style={{ color: '#38bdf8', fontWeight: '500' }}>{form.email}</span>
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            style={{
              background: 'none', border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: '8px', color: '#38bdf8', padding: '9px 20px',
              fontSize: '13px', cursor: resending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: resending ? 0.6 : 1,
            }}
          >
            {resending ? 'Sending...' : 'Resend Email'}
          </button>
          <p style={{ ...S.mutedText, marginTop: '20px' }}>
            <Link to="/auth/login" style={S.linkSm}>Back to login</Link>
          </p>
        </div>
      </AuthLayout>
    )
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <AuthLayout>
      <div style={S.cardWide}>
        {/* Tab indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <Link
            to="/auth/register/student"
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', textAlign: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none', display: 'block', transition: 'all 0.2s',
            }}
          >
            🎓 Student
          </Link>
          <div style={{
            flex: 1, padding: '10px', borderRadius: '8px', textAlign: 'center',
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)',
            fontSize: '13px', fontWeight: '600', color: '#8b5cf6',
          }}>
            📖 Faculty
          </div>
        </div>

        <h2 style={S.heading}>Create an account</h2>
        <p style={S.subheading}>Use your official university email</p>

        <form onSubmit={handleSubmit}>
          {/* Name row */}
          <div style={S.row2}>
            <div>
              <label style={S.label}>First Name</label>
              <input
                value={form.firstName} onChange={set('firstName')} required
                style={S.input}
                onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>
            <div>
              <label style={S.label}>Last Name</label>
              <input
                value={form.lastName} onChange={set('lastName')} required
                style={S.input}
                onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={S.fieldGroup}>
            <label style={S.label}>University Email</label>
            <input
              type="email"
              placeholder="you@university.edu"
              value={form.email} onChange={set('email')} required
              style={S.input}
              onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Password */}
          <div style={S.fieldGroup}>
            <label style={S.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={set('password')} required
                style={S.inputWithEye}
                onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} style={S.eyeBtn}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && (
            <p style={S.errorText}>
              {error.response?.data?.message || 'Registration failed.'}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{ ...(isPending ? S.btnDisabled : S.btn), marginTop: '6px' }}
          >
            {isPending ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ ...S.mutedText, marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/auth/login" style={S.link}>Login</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
