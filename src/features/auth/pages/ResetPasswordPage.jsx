// Place at: src/features/auth/pages/ResetPasswordPage.jsx
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { resetPasswordApi } from '../auth.api'
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

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    if (password !== confirm) { setErr('Passwords do not match.'); return }
    if (!token) { setErr('Reset token is missing.'); return }

    setLoading(true)
    try {
      await resetPasswordApi(token, password)
      toast.success('Password reset successfully. Please log in.')
      navigate('/auth/login')
    } catch (error) {
      setErr(error?.response?.data?.message || 'Link is invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div style={S.card}>
        <h2 style={S.heading}>Reset your password</h2>
        <p style={S.subheading}>Enter your new password below</p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div style={S.fieldGroup}>
            <label style={S.label}>New Password</label>
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

          {/* Confirm Password */}
          <div style={S.fieldGroup}>
            <label style={S.label}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={S.inputWithEye}
                onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} style={S.eyeBtn}>
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {err && <p style={S.errorText}>{err}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...(loading ? S.btnDisabled : S.btn), marginTop: '6px' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
