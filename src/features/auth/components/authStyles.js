// Place at: src/components/shared/authStyles.js
// Shared dark-theme style tokens for all auth pages.

export const card = {
  width: '100%',
  maxWidth: '440px',
  background: 'rgba(13,21,38,0.95)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  padding: '36px 32px',
  boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
}

export const cardWide = { ...card, maxWidth: '480px' }

export const input = {
  width: '100%',
  background: 'rgba(8,13,26,0.8)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#ffffff',
  padding: '11px 14px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

export const inputWithEye = { ...input, paddingRight: '44px' }

export const label = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '7px',
}

export const btn = {
  width: '100%',
  background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
  border: 'none',
  borderRadius: '8px',
  color: '#ffffff',
  padding: '12px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  letterSpacing: '0.2px',
  transition: 'opacity 0.2s, transform 0.1s',
  fontFamily: 'inherit',
}

export const btnDisabled = {
  ...btn,
  opacity: 0.55,
  cursor: 'not-allowed',
}

export const link = {
  color: '#38bdf8',
  textDecoration: 'none',
  fontSize: '14px',
  cursor: 'pointer',
}

export const linkSm = { ...link, fontSize: '13px' }

export const heading = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 6px',
  letterSpacing: '-0.3px',
}

export const subheading = {
  fontSize: '14px',
  color: 'rgba(255,255,255,0.48)',
  margin: '0 0 28px',
}

export const errorText = {
  fontSize: '13px',
  color: '#f87171',
  margin: '8px 0 0',
}

export const mutedText = {
  fontSize: '13px',
  color: 'rgba(255,255,255,0.4)',
  textAlign: 'center',
}

export const fieldGroup = { marginBottom: '18px' }

export const row2 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginBottom: '18px',
}

export const warningBanner = {
  background: 'rgba(251,191,36,0.1)',
  border: '1px solid rgba(251,191,36,0.25)',
  borderRadius: '8px',
  padding: '12px 14px',
  marginBottom: '20px',
}

export const successBanner = {
  background: 'rgba(34,197,94,0.1)',
  border: '1px solid rgba(34,197,94,0.22)',
  borderRadius: '8px',
  padding: '12px 14px',
  marginBottom: '20px',
}

export const eyeBtn = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'rgba(255,255,255,0.38)',
  display: 'flex',
  padding: '4px',
  alignItems: 'center',
}
