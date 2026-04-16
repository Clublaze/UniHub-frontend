// Leaderboard is computed frontend-side from org tree + events data.
// Score per club = (APPROVED events × 3) + (CLOSED events × 5) + (members × 1)
// Member counts come from the club's public profile responses.
import { useQuery } from '@tanstack/react-query'
import { getPublicEventsApi } from '../../explore/explore.api'
import { getClubsListApi }    from '../../clubs/clubs.api'
import Loader from '../../../components/shared/Loader'
import { Badge } from '../../../components/ui/badge'
import env from '../../../config/env'

const MEDALS = ['🥇', '🥈', '🥉']

// Fetch all clubs, then compute score from event counts
function useLeaderboard() {
  const { data: clubData, isLoading: loadingClubs } = useQuery({
    queryKey: ['leaderboard', 'clubs'],
    queryFn:  () => getClubsListApi({ limit: 100 }),
    select:   (res) => {
      const d = res.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    },
    staleTime: 1000 * 60 * 5,
  })

  const { data: eventData, isLoading: loadingEvents } = useQuery({
    queryKey: ['leaderboard', 'events'],
    queryFn:  () => getPublicEventsApi({ limit: 200 }),
    select:   (res) => {
      const d = res.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    },
    staleTime: 1000 * 60 * 5,
  })

  const clubs  = clubData  ?? []
  const events = eventData ?? []

  // Build score per club
  const scored = clubs.map(club => {
    const clubEvents   = events.filter(e => e.organizingClubId === club._id)
    const approvedCnt  = clubEvents.filter(e => e.status === 'APPROVED').length
    const closedCnt    = clubEvents.filter(e => e.status === 'CLOSED').length
    const members      = club.memberCount ?? 0
    const score        = approvedCnt * 3 + closedCnt * 5 + members

    return {
      _id:         club._id,
      name:        club.name,
      logoUrl:     club.logoUrl,
      tags:        club.tags ?? [],
      memberCount: members,
      approvedCnt,
      closedCnt,
      score,
    }
  })

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score)

  return { clubs: scored, isLoading: loadingClubs || loadingEvents }
}

// Visual bar showing score relative to top club's score
function ScoreBar({ score, max }) {
  const pct = max === 0 ? 0 : Math.round((score / max) * 100)
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-foreground w-12 text-right">
        {score} pts
      </span>
    </div>
  )
}

export default function LeaderboardPage() {
  const { clubs, isLoading } = useLeaderboard()
  const maxScore = clubs[0]?.score ?? 0

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">🏆 Club Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ranked by events organised and members. Updated in real time.
        </p>
      </div>

      {/* Scoring legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground rounded-lg border bg-card p-3">
        <span>Scoring:</span>
        <span>Approved event = <strong className="text-foreground">3 pts</strong></span>
        <span>Closed event = <strong className="text-foreground">5 pts</strong></span>
        <span>Active member = <strong className="text-foreground">1 pt</strong></span>
      </div>

      {isLoading ? (
        <Loader text="Computing scores..." />
      ) : clubs.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No clubs to rank yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {clubs.map((club, i) => (
            <div
              key={club._id}
              className={`rounded-lg border bg-card px-5 py-4 flex items-center gap-4 ${
                i < 3 ? 'border-primary/30' : ''
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center text-lg font-bold text-muted-foreground shrink-0">
                {i < 3 ? MEDALS[i] : `#${i + 1}`}
              </div>

              {/* Club identity */}
              <div className="flex items-center gap-3 w-40 shrink-0">
                {club.logoUrl ? (
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="h-9 w-9 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">
                      {club.name?.[0]}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {club.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {club.memberCount} members
                  </p>
                </div>
              </div>

              {/* Score bar */}
              <ScoreBar score={club.score} max={maxScore} />

              {/* Tags */}
              {club.tags?.[0] && (
                <Badge variant="secondary" className="text-xs shrink-0 hidden sm:inline-flex">
                  {club.tags[0]}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}