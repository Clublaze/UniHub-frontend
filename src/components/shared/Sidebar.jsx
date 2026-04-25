// src/components/shared/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Compass, Calendar, Users, Building2,
  CalendarDays, ClipboardCheck, UserPlus, Shield,
  FileText, Trophy, User, Settings, HelpCircle, ChevronLeft, FolderTree,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { usePendingCount } from '../../features/approvals/hooks/usePendingCount'
import { dark, gradients, sidebar } from '../../styles/theme'

function NavItem({ to, icon: Icon, label, badge, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      onClick={onClick}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '8px',
        padding: '9px 12px',
        textDecoration: 'none',
        fontSize: '13.5px',
        fontWeight: '500',
        transition: 'all 0.15s',
        marginBottom: '2px',
        background: isActive
          ? sidebar.itemBgActive
          : 'transparent',
        color: isActive ? sidebar.itemTextActive : sidebar.itemText,
        border: isActive
          ? `1px solid ${sidebar.itemBorderActive}`
          : '1px solid transparent',
      })}
      className="sidebar-item"
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Icon size={16} />
        {label}
      </span>
      {badge > 0 && (
        <span style={{
          background: sidebar.badgeBg,
          color: sidebar.badgeText,
          border: `1px solid ${sidebar.badgeBorder}`,
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '600',
          padding: '1px 7px',
          minWidth: '20px',
          textAlign: 'center',
        }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar({ onClose }) {
  const store = useAuthStore()
  const pendingCount = usePendingCount()

  const showEvents     = store.getManagedClubs().length > 0 || store.isAdmin()
  const showApprovals  = store.isApprover()
  const showAudit      = store.isAdmin() || store.isApprover()
  const showGovernance = store.isFacultyApprover() || store.isAdmin()

  const user = store.user
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'
  const displayName = user?.displayName || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()

  const mainItems = [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',   show: true },
    { to: '/explore',     icon: Compass,         label: 'Explore',     show: true },
    { to: '/events',      icon: Calendar,        label: 'Events',      show: showEvents },
    { to: '/clubs',       icon: Users,           label: 'Clubs',       show: true },
    { to: '/societies',   icon: Building2,       label: 'Societies',   show: true },
    { to: '/calendar',    icon: CalendarDays,    label: 'Calendar',    show: true },
    { to: '/approvals',   icon: ClipboardCheck,  label: 'Approvals',   show: showApprovals, badge: pendingCount },
    { to: '/memberships', icon: UserPlus,        label: 'Memberships', show: true },
    { to: '/audit',       icon: Shield,          label: 'Audit Panel', show: showAudit },
    { to: '/admin/users', icon: Users,           label: 'Manage Users', show: store.isAdmin() },
    { to: '/admin/organizations', icon: FolderTree, label: 'Org Tree', show: store.isAdmin() },
    { to: '/governance',  icon: FileText,        label: 'Governance',  show: showGovernance },
    { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard', show: true },
  ]

  const accountItems = [
    { to: '/profile',  icon: User,       label: 'Profile' },
    { to: '/settings', icon: Settings,   label: 'Settings' },
    { to: '/help',     icon: HelpCircle, label: 'Help' },
  ]

  return (
    <div style={{
      width: '240px',
      height: '100%',
      background: sidebar.bg,
      borderRight: `1px solid ${sidebar.borderRight}`,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'inherit',
    }}>
      {/* Brand header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 16px 16px 16px',
        borderBottom: `1px solid ${sidebar.divider}`,
        height: '60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: gradients.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '800', fontSize: '14px', flexShrink: 0,
          }}>
            U
          </div>
          <span style={{
            fontSize: '16px', fontWeight: '700', color: sidebar.logoText,
            letterSpacing: '-0.3px',
          }}>
            UniHub
          </span>
        </div>
        <ChevronLeft size={16} color={dark.textMuted} style={{ cursor: 'pointer' }} />
      </div>

      {/* Scrollable nav */}
      <nav
        className="sidebar-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 10px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <p style={{
          fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: sidebar.sectionLabel,
          padding: '0 8px', marginBottom: '8px', marginTop: '4px',
        }}>
          Main Menu
        </p>

        {mainItems.filter(i => i.show).map(item => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            onClick={onClose}
          />
        ))}

        <div style={{ height: '1px', background: sidebar.divider, margin: '12px 8px' }} />

        <p style={{
          fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: sidebar.sectionLabel,
          padding: '0 8px', marginBottom: '8px',
        }}>
          Account
        </p>

        {accountItems.map(item => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* User card */}
      <div style={{
        padding: '10px 12px',
        borderTop: `1px solid ${sidebar.divider}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: sidebar.userCardBg,
          border: `1px solid ${sidebar.userCardBorder}`,
          borderRadius: '10px',
          padding: '10px 12px',
        }}>
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={displayName || 'Profile'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          ) : (
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: gradients.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: '12px', flexShrink: 0,
            }}>
              {initials}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: dark.text, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </p>
            <p style={{ fontSize: '11px', color: dark.textMuted, margin: 0 }}>
              {user?.userType?.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-item:hover {
          background: ${sidebar.itemBgHover} !important;
          color: ${sidebar.itemTextHover} !important;
        }

        .sidebar-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
