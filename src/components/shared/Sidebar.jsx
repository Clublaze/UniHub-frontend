import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Compass, Calendar, Users, Building2,
  CalendarDays, ClipboardCheck, UserPlus, Shield,
  FileText, Trophy, User, Settings, HelpCircle,
} from 'lucide-react'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import useAuthStore from '../../store/authStore'
import { usePendingCount } from '../../features/approvals/hooks/usePendingCount'

// Single nav link — handles active styling and optional badge
function NavItem({ to, icon: Icon, label, badge, onClick }) {
  return (
    <NavLink
      to={to}
      // 'end' on dashboard prevents it staying active for all child routes
      end={to === '/dashboard'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-md px-3 py-2 text-sm
         font-medium transition-colors ${
           isActive
             ? 'bg-primary text-primary-foreground'
             : 'text-muted-foreground hover:bg-accent hover:text-foreground'
         }`
      }
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </span>
      {badge > 0 && (
        <Badge
          variant="secondary"
          className="ml-auto h-5 min-w-5 px-1 text-xs"
        >
          {badge > 99 ? '99+' : badge}
        </Badge>
      )}
    </NavLink>
  )
}

// onClose — passed only from mobile Sheet, undefined on desktop (that's fine)
export default function Sidebar({ onClose }) {
  const store = useAuthStore()
  const pendingCount = usePendingCount()

  // ── Visibility — all logic lives in AuthStore helpers ──────────────
  const showEvents     = store.getManagedClubs().length > 0 || store.isAdmin()
  const showApprovals  = store.isApprover()
  const showAudit      = store.isAdmin() || store.isApprover()
  const showGovernance = store.isFacultyApprover() || store.isAdmin()

  const mainItems = [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',   show: true },
    { to: '/explore',     icon: Compass,         label: 'Explore',     show: true },
    { to: '/events',      icon: Calendar,        label: 'Events',      show: showEvents },
    { to: '/clubs',       icon: Users,           label: 'Clubs',       show: true },
    { to: '/societies',   icon: Building2,       label: 'Societies',   show: true },
    { to: '/calendar',    icon: CalendarDays,    label: 'Calendar',    show: true },
    {
      to: '/approvals',
      icon: ClipboardCheck,
      label: 'Approvals',
      show: showApprovals,
      badge: pendingCount,
    },
    { to: '/memberships', icon: UserPlus,        label: 'Memberships', show: true },
    { to: '/audit',       icon: Shield,          label: 'Audit Panel', show: showAudit },
    { to: '/governance',  icon: FileText,        label: 'Governance',  show: showGovernance },
    { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard', show: true },
  ]

  const accountItems = [
    { to: '/profile',  icon: User,        label: 'Profile' },
    { to: '/settings', icon: Settings,    label: 'Settings' },
    { to: '/help',     icon: HelpCircle,  label: 'Help' },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-card">
      {/* Brand */}
      <div className="flex h-14 items-center border-b px-5">
        <span className="text-lg font-bold tracking-tight text-foreground">
          UniHub
        </span>
      </div>

      {/* Scrollable nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Main Menu
        </p>

        <div className="space-y-0.5">
          {mainItems
            .filter(item => item.show)
            .map(item => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                onClick={onClose}
              />
            ))}
        </div>

        <Separator className="my-4" />

        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </p>

        <div className="space-y-0.5">
          {accountItems.map(item => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              onClick={onClose}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}