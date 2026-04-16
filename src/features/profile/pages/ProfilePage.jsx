// All data comes from AuthStore (already fetched at login) — no extra API calls
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { User, Mail, Shield } from 'lucide-react'
import { getMyMembershipsApi } from '../../memberships/memberships.api'
import { getAllEventsApi }      from '../../events/events.api'
import StatusBadge             from '../../../components/shared/StatusBadge'
import Loader                  from '../../../components/shared/Loader'
import { Badge }               from '../../../components/ui/badge'
import { Separator }           from '../../../components/ui/separator'
import { formatDate }          from '../../../utils/date.util'
import useAuthStore            from '../../../store/authStore'

export default function ProfilePage() {
  const store = useAuthStore()
  const user  = store.user
  const roles = store.roles.filter(r => r.status === 'ACTIVE')

  const { data: memberships = [], isLoading: loadingM } = useQuery({
    queryKey: ['memberships', 'my'],
    queryFn:  () => getMyMembershipsApi().then(r => r.data.data ?? []),
    staleTime: 1000 * 60 * 2,
  })

  const activeMemberships = memberships.filter(m => m.status === 'ACTIVE')

  const { data: eventData, isLoading: loadingE } = useQuery({
    queryKey: ['events', 'mine'],
    queryFn:  () =>
      getAllEventsApi({ limit: 5 }).then(r => {
        const d = r.data.data
        return Array.isArray(d) ? d : (d?.data ?? [])
      }),
    staleTime: 1000 * 60 * 2,
  })

  const myEvents = eventData ?? []

  if (!user) return <Loader text="Loading profile..." />

  const displayName = user.displayName ||
    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

      {/* Basic info */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary">
              {displayName?.[0] ?? '?'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{user.userType}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{user.email}</span>
          </div>

          {user.systemId && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              <span>ID: {user.systemId}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0" />
            <span>
              {user.isEmailVerified ? '✅ Email verified' : '⚠️ Email not verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Current roles */}
      {roles.length > 0 && (
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <h3 className="font-semibold text-foreground">Current Roles</h3>
          <div className="space-y-2">
            {roles.map(r => (
              <div
                key={r._id}
                className="flex items-center justify-between gap-2"
              >
                <p className="text-sm text-foreground">
                  {r.displayRoleName || r.canonicalRole.replace(/_/g, ' ')}
                  {r.scopeName && (
                    <span className="text-muted-foreground">
                      {' '}&mdash; {r.scopeName}
                    </span>
                  )}
                </p>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {r.sessionId}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Club memberships */}
      {loadingM ? (
        <Loader size="sm" />
      ) : activeMemberships.length > 0 && (
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">My Clubs</h3>
            <Link to="/memberships">
              <span className="text-xs text-muted-foreground hover:underline">
                View all →
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeMemberships.map(m => (
              <Link key={m.clubId} to={`/clubs/${m.clubId}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  {m.clubName || m.clubId}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent events */}
      {loadingE ? (
        <Loader size="sm" />
      ) : myEvents.length > 0 && (
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Events I Organised</h3>
            <Link to="/events">
              <span className="text-xs text-muted-foreground hover:underline">
                View all →
              </span>
            </Link>
          </div>
          <div className="space-y-2">
            {myEvents.map(e => (
              <Link
                key={e._id}
                to={`/events/${e._id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2.5 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.startDate ? formatDate(e.startDate) : ''}
                  </p>
                </div>
                <StatusBadge status={e.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}