import { usePublicSocieties } from '../hooks/useExplore'
import SocietyCard from '../components/SocietyCard'
import Loader from '../../../components/shared/Loader'

const toList = (data) => (Array.isArray(data) ? data : data?.data ?? [])

export default function ExploreSocietiesPage() {
  const { data, isLoading } = usePublicSocieties()
  const societies = toList(data)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Societies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Student societies at your university
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
            <SocietyCard key={s._id} society={s} />
          ))}
        </div>
      )}
    </div>
  )
}