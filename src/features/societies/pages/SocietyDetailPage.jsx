import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import { useSocietyDetail } from '../../clubs/hooks/useClubs'
import ClubCard   from '../../explore/components/ClubCard'
import EventCard  from '../../../components/shared/EventCard'
import RolesTab   from '../../clubs/components/RolesTab'
import Loader     from '../../../components/shared/Loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import useAuthStore from '../../../store/authStore'

export default function SocietyDetailPage() {
  const { id }  = useParams()
  const store   = useAuthStore()

  const { data, isLoading } = useSocietyDetail(id)

  const canManageRoles = store.isFacultyApprover() || store.isAdmin()

  if (isLoading) return <Loader text="Loading society..." />
  if (!data)     return <p className="text-sm text-muted-foreground">Society not found.</p>

  const society      = data.society?._id  ? data.society  : data
  const clubs        = data.clubs         ?? []
  const recentEvents = data.recentEvents  ?? []

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/societies"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Societies
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        {society.logoUrl ? (
          <img
            src={society.logoUrl}
            alt={society.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{society.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{society.code}</p>
        </div>
      </div>

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          {canManageRoles && (
            <TabsTrigger value="roles">Roles</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="about" className="mt-4">
          {society.description ? (
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {society.description}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No description available.</p>
          )}
        </TabsContent>

        <TabsContent value="clubs" className="mt-4">
          {clubs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No clubs found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map(club => (
                <ClubCard key={club._id} club={club} linkPrefix="/clubs" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent events.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentEvents.map(e => (
                <EventCard key={e._id} event={e} />
              ))}
            </div>
          )}
        </TabsContent>

        {canManageRoles && (
          <TabsContent value="roles" className="mt-4">
            <RolesTab scopeId={id} scopeType="SOCIETY" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}