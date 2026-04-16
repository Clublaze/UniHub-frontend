import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { Card, CardContent } from '../../../components/ui/card'

export default function SocietyCard({ society }) {
  return (
    <Link to={`/explore/societies/${society._id}`}>
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