// Import all maps from theme — never write color classes directly here
import {
  statusBadgeClass,
  membershipBadgeClass,
  budgetStatusClass,
  ecrStatusClass,
} from '../../styles/theme'

// type: 'event' | 'membership' | 'budget' | 'ecr' | 'settlement'
// settlement uses the same map as ecr (DRAFT/UNDER_REVIEW/APPROVED)

const maps = {
  event:      statusBadgeClass,
  membership: membershipBadgeClass,
  budget:     budgetStatusClass,
  ecr:        ecrStatusClass,
  settlement: ecrStatusClass,
}

export default function StatusBadge({ status, type = 'event' }) {
  const map = maps[type] ?? statusBadgeClass
  const cls = map[status]  ?? 'bg-gray-100 text-gray-600'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {status?.replace(/_/g, ' ')}
    </span>
  )
}