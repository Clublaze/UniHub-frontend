// linkPrefix lets callers control where clicking goes:
//   /explore/clubs/:id  (default — explore context)
//   /clubs/:id          (clubs management context)
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'

export default function ClubCard({ club, linkPrefix = '/explore/clubs' }) {
  return (
    <Link to={`${linkPrefix}/${club._id}`}>
      <Card className="hover:shadow-md transition-shadow h-full cursor-pointer">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            {club.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={club.name}
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-sm">
                  {club.name?.[0]}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {club.name}
              </h3>
              <p className="text-xs text-muted-foreground">{club.code}</p>
            </div>
          </div>

          {club.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {club.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {club.memberCount ?? 0} members
            </span>
            {club.tags?.[0] && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {club.tags[0]}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}