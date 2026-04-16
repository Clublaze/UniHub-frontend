// Authenticated clubs listing — same data as /explore/clubs
// but links to /clubs/:id for the management context
import { useState } from 'react'
import { useClubsList } from '../hooks/useClubs'
import ClubCard from '../../explore/components/ClubCard'
import Loader from '../../../components/shared/Loader'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'

const TAGS = ['TECHNICAL', 'CULTURAL', 'SPORTS', 'ARTS', 'SCIENCE', 'BUSINESS']

const toList = (data) => Array.isArray(data) ? data : (data?.data ?? [])

export default function ClubsPage() {
  const [search,    setSearch]    = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [page,      setPage]      = useState(1)

  const { data, isLoading } = useClubsList({
    tag:   activeTag || undefined,
    page,
    limit: 12,
  })

  const clubs      = toList(data)
  const totalPages = Math.ceil((data?.total ?? clubs.length) / 12) || 1

  const filtered = clubs.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clubs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All clubs at your university
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <Input
          placeholder="Search clubs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeTag === '' ? 'default' : 'outline'}
            onClick={() => { setActiveTag(''); setPage(1) }}
          >
            All
          </Button>
          {TAGS.map(tag => (
            <Button
              key={tag}
              size="sm"
              variant={activeTag === tag ? 'default' : 'outline'}
              onClick={() => { setActiveTag(tag); setPage(1) }}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Loader text="Loading clubs..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No clubs found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(club => (
              // linkPrefix="/clubs" routes to the management detail page
              <ClubCard key={club._id} club={club} linkPrefix="/clubs" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline" size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline" size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}