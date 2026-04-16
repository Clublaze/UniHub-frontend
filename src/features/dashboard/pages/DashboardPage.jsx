// Assembles all role-based widgets using AuthStore helpers
// Each widget handles its own data fetching
import useAuthStore from '../../../store/authStore'
import UpcomingEventsWidget from '../components/UpcomingEventsWidget'
import MyMembershipsWidget from '../components/MyMembershipsWidget'
import ClubLeadPanel from '../components/ClubLeadPanel'
import CoLeadPanel from '../components/CoLeadPanel'
import ApproverWidget from '../components/ApproverWidget'
import AdminOverviewWidget from '../components/AdminOverviewWidget'

export default function DashboardPage() {
  const store = useAuthStore()

  const user       = store.user
  const leadClubs  = store.getLeadClubs()
  const coLeadClubs = store.getClubsWhere('CO_LEAD')
  const isStudent  = user?.userType === 'STUDENT'

  return (
    <div className="space-y-8">

      {/* Welcome header — data from store, no API call */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Good morning, {user?.firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {user?.userType} · Sharda University
        </p>
      </div>

      {/* Upcoming events — everyone */}
      <UpcomingEventsWidget />

      {/* My memberships — students only */}
      {isStudent && <MyMembershipsWidget />}

      {/* Club lead panels — one per club */}
      {leadClubs.map(role => (
        <ClubLeadPanel
          key={role.scopeId}
          clubId={role.scopeId}
          clubName={role.scopeName}
        />
      ))}

      {/* Co-lead panels — one per club */}
      {coLeadClubs.map(role => (
        <CoLeadPanel
          key={role.scopeId}
          clubId={role.scopeId}
          clubName={role.scopeName}
        />
      ))}

      {/* Approver queue */}
      {store.isApprover() && <ApproverWidget />}

      {/* Admin overview */}
      {store.isAdmin() && <AdminOverviewWidget />}

    </div>
  )
}