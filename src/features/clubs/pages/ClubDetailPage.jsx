// Full club detail — about, events, members (conditional), roles (conditional)
// Join/leave button based on membership status from cached query
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Users } from 'lucide-react'
import { useClubDetail } from '../hooks/useClubs'
import MembersTab from '../components/MembersTab'
import RolesTab   from '../components/RolesTab'
import EventCard  from '../../../components/shared/EventCard'
import Loader     from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Badge }  from '../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { getMyMembershipsApi, applyToClubApi, leaveClubApi } from '../../memberships/memberships.api'
import useAuthStore from '../../../store/authStore'

export default function ClubDetailPage() {
  const { id }  = useParams()
  const store   = useAuthStore()
  const qc      = useQueryClient()
  const user    = store.user

  const { data, isLoading } = useClubDetail(id)

  // My memberships — already likely cached from dashboard / memberships page
  const { data: memberships = [] } = useQuery({
    queryKey: ['memberships', 'my'],
    queryFn:  () => getMyMembershipsApi().then(r => r.data.data ?? []),
    enabled:  !!user,
    staleTime: 1000 * 60 * 2,
  })

  const myMembership = memberships.find(m => m.clubId === id)

  const applyMutation = useMutation({
    mutationFn: () => applyToClubApi({ clubId: id, applicationNote: '' }),
    onSuccess:  () => {
      toast.success('Application submitted!')
      qc.invalidateQueries({ queryKey: ['memberships', 'my'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to apply.'),
  })

  const leaveMutation = useMutation({
    mutationFn: () => leaveClubApi(id),
    onSuccess:  () => {
      toast.success('You have left the club.')
      qc.invalidateQueries({ queryKey: ['memberships', 'my'] })
    },
    onError: () => toast.error('Failed to leave club.'),
  })

  // Role-based tab visibility
  const canManageMembers = store.hasRoleInScope('CLUB_LEAD', id) ||
                           store.hasRoleInScope('CO_LEAD', id)   ||
                           store.isAdmin()
  const canManageRoles   = store.isFacultyApprover() || store.isAdmin()

  if (isLoading) return <Loader text="Loading club..." />
  if (!data)     return <p className="text-sm text-muted-foreground">Club not found.</p>

  // Backend returns { club, leadership, memberCount, recentEvents } or just club object
  const club         = data.club?._id ? data.club : data
  const leadership   = data.leadership   ?? []
  const memberCount  = data.memberCount  ?? 0
  const recentEvents = data.recentEvents ?? []

  const JoinButton = () => {
    if (!myMembership) {
      return (
        <Button
          onClick={() => applyMutation.mutate()}
          disabled={applyMutation.isPending}
        >
          {applyMutation.isPending ? 'Applying...' : 'Join Club'}
        </Button>
      )
    }
    if (myMembership.status === 'PENDING') {
      return <Button variant="outline" disabled>Application Pending ⏳</Button>
    }
    if (myMembership.status === 'ACTIVE') {
      return (
        <Button
          variant="destructive"
          onClick={() => leaveMutation.mutate()}
          disabled={leaveMutation.isPending}
        >
          {leaveMutation.isPending ? 'Leaving...' : 'Leave Club'}
        </Button>
      )
    }
    return (
      <Button
        onClick={() => applyMutation.mutate()}
        disabled={applyMutation.isPending}
      >
        {applyMutation.isPending ? 'Applying...' : 'Apply Again'}
      </Button>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/clubs"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Clubs
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {club.logoUrl ? (
            <img
              src={club.logoUrl}
              alt={club.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {club.name?.[0]}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{club.name}</h1>
            <div className="flex items-center flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {memberCount} members
              </span>
              {club.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <JoinButton />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          {canManageMembers && (
            <TabsTrigger value="members">Members</TabsTrigger>
          )}
          {canManageRoles && (
            <TabsTrigger value="roles">Roles</TabsTrigger>
          )}
        </TabsList>

        {/* About */}
        <TabsContent value="about" className="mt-4 space-y-5">
          {club.description && (
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {club.description}
              </p>
            </div>
          )}

          {leadership.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Leadership
              </h3>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      {['Role', 'Name', 'Session'].map(h => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leadership.map((l, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-3 text-muted-foreground">
                          {l.displayRoleName || l.canonicalRole?.replace(/_/g, ' ')}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {l.userName || l.userId}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {l.sessionId || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Events */}
        <TabsContent value="events" className="mt-4">
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent events for this club.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Members — only club lead / co-lead / admin */}
        {canManageMembers && (
          <TabsContent value="members" className="mt-4">
            <MembersTab clubId={id} />
          </TabsContent>
        )}

        {/* Roles — only faculty approvers / admin */}
        {canManageRoles && (
          <TabsContent value="roles" className="mt-4">
            <RolesTab scopeId={id} scopeType="CLUB" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}