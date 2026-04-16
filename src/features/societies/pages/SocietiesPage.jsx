import { Link } from 'react-router-dom'
import { useSocietiesList } from '../../clubs/hooks/useClubs'
import SocietyCard from '../../explore/components/SocietyCard'
import Loader from '../../../components/shared/Loader'

// SocietyCard links to /explore/societies/:id by default
// Override with a custom card that links to /societies/:id
import { Building2 } from 'lucide-react'
import { Card, CardContent } from '../../../components/ui/card'

function SocietyCardAuth({ society }) {
  return (
    <Link to={`/societies/${society._id}`}>
      <Card className="hover:shadow-md transition-shadow h-full cursor-pointer">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            {society.logoUrl ? (
              <img
                src={society.logoUrl}
                alt={society.name}
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-sm text-foreground">{society.name}</h3>
              <p className="text-xs text-muted-foreground">{society.code}</p>
            </div>
          </div>
          {society.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {society.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default function SocietiesPage() {
  const { data: societies = [], isLoading } = useSocietiesList()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Societies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All student societies at your university
        </p>
      </div>

      {isLoading ? (
        <Loader text="Loading societies..." />
      ) : societies.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No societies found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {societies.map(s => (
            <SocietyCardAuth key={s._id} society={s} />
          ))}
        </div>
      )}
    </div>
  )
}