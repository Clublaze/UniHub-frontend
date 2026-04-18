// Place at: src/components/shared/AuthLayout.jsx

const GraduationCapIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#38bdf8" />
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="#8b5cf6" />
  </svg>
)

export default function AuthLayout({ children, showFooter = true }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080d1a',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', left: '-8%', top: '18%',
        width: '580px', height: '580px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', right: '-8%', top: '28%',
        width: '680px', height: '680px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '900px', height: '450px',
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', display: 'flex',
        flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Logo + Branding */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(139,92,246,0.15))',
            borderRadius: '16px',
            border: '1px solid rgba(56,189,248,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 0 32px rgba(56,189,248,0.12)',
          }}>
            <GraduationCapIcon />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#38bdf8', margin: 0, letterSpacing: '-0.3px' }}>
            UniHub
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
            University Management Platform
          </p>
        </div>

        {children}

        {showFooter && (
          <p style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.28)', textAlign: 'center', maxWidth: '360px' }}>
            By continuing, you agree to UniHub's{' '}
            <span style={{ color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>Terms of Service</span>{' '}
            and{' '}
            <span style={{ color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
        )}
      </div>
    </div>
  )
}
