// Place at: src/features/auth/pages/RegisterChoicePage.jsx
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import * as S from '../components/authStyles'

const StudentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
)

const FacultyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

export default function RegisterChoicePage() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <div style={S.card}>
        <h2 style={S.heading}>Create an account</h2>
        <p style={S.subheading}>Join UniHub to get started</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {/* Student option */}
          <button
            onClick={() => navigate('/auth/register/student')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 20px',
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(56,189,248,0.25)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              width: '100%',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(56,189,248,0.14)'
              e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(56,189,248,0.08)'
              e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)'
            }}
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(139,92,246,0.15))',
              border: '1px solid rgba(56,189,248,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#38bdf8',
            }}>
              <StudentIcon />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', margin: '0 0 3px' }}>
                I'm a Student
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                University enrollment ID required
              </p>
            </div>
            <svg style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Faculty option */}
          <button
            onClick={() => navigate('/auth/register/faculty')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 20px',
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.22)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              width: '100%',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(139,92,246,0.14)'
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.22)'
            }}
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(56,189,248,0.1))',
              border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#8b5cf6',
            }}>
              <FacultyIcon />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', margin: '0 0 3px' }}>
                I'm Faculty / Staff
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                Official university email required
              </p>
            </div>
            <svg style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <p style={S.mutedText}>
          Already have an account?{' '}
          <Link to="/auth/login" style={S.link}>Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
