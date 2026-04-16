import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import { usePublicSocietyDetail } from '../hooks/useExplore'
import ClubCard from '../components/ClubCard'
import EventCard from '../../../components/shared/EventCard'
import Loader from '../../../components/shared/Loader'

export default function ExploreSocietyDetailPage() {
  const { id } = useParams()
  const { data, isLoading } = usePublicSocietyDetail(id)

  if (isLoading) return <Loader text="Loading society..." />
  if (!data)     return <p className="text-muted-foreground">Society not found.</p>

  // Backend returns { society, clubs, recentEvents } or just the society object
  const society      = data.society?._id ? data.society : data
  const clubs        = data.clubs        ?? []
  const recentEvents = data.recentEvents ?? []

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/explore/societies"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to societies
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

      {society.description && (
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-foreground leading-relaxed">
            {society.description}
          </p>
        </div>
      )}

      {clubs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Clubs under {society.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map(club => <ClubCard key={club._id} club={club} />)}
          </div>
        </div>
      )}

      {recentEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Events</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentEvents.map(e => <EventCard key={e._id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  )
}