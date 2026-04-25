// src/components/shared/Topbar.jsx
import { Menu, Bell, LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import useAuthStore from '../../store/authStore'
import { useLogout } from '../../features/auth/hooks/useLogout'
import { usePendingCount } from '../../features/approvals/hooks/usePendingCount'
import { dark, topbar } from '../../styles/theme'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?'
}

export default function Topbar({ onMenuClick }) {
  const user         = useAuthStore(s => s.user)
  const handleLogout = useLogout()
  const pendingCount = usePendingCount()

  const firstName    = user?.firstName ?? 'there'
  const initials     = getInitials(user?.firstName, user?.lastName)

  return (
    <header style={{
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: topbar.bg,
      backdropFilter: topbar.backdropBlur,
      borderBottom: `1px solid ${topbar.borderBottom}`,
      flexShrink: 0,
    }}>
      {/* Left: hamburger + greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: dark.textSub, padding: '4px', display: 'flex',
          }}
        >
          <Menu size={20} />
        </button>

        <p style={{ fontSize: '15px', fontWeight: '500', color: dark.text, margin: 0 }}>
          Good {getGreeting()}, {firstName} 👋
        </p>
      </div>

      {/* Right: bell + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button style={{
            background: topbar.iconBtn,
            border: `1px solid ${topbar.iconBtnBorder}`,
            borderRadius: '8px',
            padding: '7px 8px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            color: dark.textSub,
          }}>
            <Bell size={16} />
          </button>
          {pendingCount > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: topbar.notifBadgeBg,
              color: topbar.notifBadgeText,
              borderRadius: '50%', width: '18px', height: '18px',
              fontSize: '10px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #080d1a',
            }}>
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}
        </div>

        {/* Avatar + dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user?.displayName || 'Profile'}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              ) : (
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: topbar.avatarBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '700', fontSize: '13px',
                }}>
                  {initials}
                </div>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            style={{
              background: '#111d35',
              border: `1px solid ${dark.cardBorder}`,
              borderRadius: '10px',
              minWidth: '200px',
            }}
          >
            <DropdownMenuLabel style={{ color: dark.text }}>
              <p style={{ fontWeight: '600', fontSize: '14px', margin: 0 }}>
                {user?.displayName || `${user?.firstName} ${user?.lastName}`}
              </p>
              <p style={{ fontSize: '12px', color: dark.textMuted, margin: '2px 0 0' }}>
                {user?.email}
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator style={{ background: dark.divider }} />

            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                style={{ display: 'flex', alignItems: 'center', gap: '8px',
                  color: dark.textSub, fontSize: '13px', padding: '8px 12px', cursor: 'pointer' }}
              >
                <User size={14} /> View Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator style={{ background: dark.divider }} />

            <DropdownMenuItem
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px',
                color: '#f87171', fontSize: '13px', padding: '8px 12px', cursor: 'pointer' }}
            >
              <LogOut size={14} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
