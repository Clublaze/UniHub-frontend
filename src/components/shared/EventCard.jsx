// src/components/shared/EventCard.jsx
import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import { dark, darkStatusBadge, getDarkBadge } from '../../styles/theme'
import { formatDate } from '../../utils/date.util'

export default function EventCard({ event, linkPrefix = '/explore/events' }) {
  const badge = getDarkBadge(event.status)

  return (
    <Link to={`${linkPrefix}/${event._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: dark.card,
        border: `1px solid ${dark.cardBorder}`,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.15s',
        height: '100%',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = dark.cardBorderHover
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = dark.cardBorder
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Poster image */}
        <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden' }}>
          {event.attachments?.poster ? (
            <img
              src={event.attachments.poster}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(139,92,246,0.15) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Calendar size={28} color='rgba(56,189,248,0.5)' />
            </div>
          )}

          {/* Status badge overlay */}
          {event.status && (
            <span style={{
              position: 'absolute', top: '10px', left: '10px',
              background: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`,
              borderRadius: '6px',
              fontSize: '10px', fontWeight: '600',
              padding: '3px 8px',
              textTransform: 'capitalize',
            }}>
              {event.status.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        {/* Card content */}
        <div style={{ padding: '14px' }}>
          <h3 style={{
            fontSize: '14px', fontWeight: '600', color: dark.accentBlue,
            margin: '0 0 6px', lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {event.title}
          </h3>

          <p style={{ fontSize: '12px', color: dark.textMuted, margin: '0 0 8px' }}>
            {event.organizingClubName || ''}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '11px', color: dark.textMuted }}>
              <Calendar size={11} />
              {formatDate(event.startDate)}
            </span>
            {event.venue && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '11px', color: dark.textMuted }}>
                <MapPin size={11} />
                {event.venue}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
