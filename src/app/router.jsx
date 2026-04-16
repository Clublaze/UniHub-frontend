import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/shared/ProtectedRoute'
import PublicRoute    from '../components/shared/PublicRoute'
import Layout         from '../components/shared/Layout'

// ── Auth ───────────────────────────────────────────────────────────────────────
import LoginPage            from '../features/auth/pages/LoginPage'
import RegisterChoicePage   from '../features/auth/pages/RegisterChoicePage'
import RegisterStudentPage  from '../features/auth/pages/RegisterStudentPage'
import RegisterFacultyPage  from '../features/auth/pages/RegisterFacultyPage'
import VerifyEmailPage      from '../features/auth/pages/VerifyEmailPage'
import ForgotPasswordPage   from '../features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage    from '../features/auth/pages/ResetPasswordPage'

// ── Dashboard ──────────────────────────────────────────────────────────────────
import DashboardPage from '../features/dashboard/pages/DashboardPage'

// ── Explore — Phase 3 ──────────────────────────────────────────────────────────
import ExplorePage              from '../features/explore/pages/ExplorePage'
import ExploreClubsPage         from '../features/explore/pages/ExploreClubsPage'
import ExploreClubDetailPage    from '../features/explore/pages/ExploreClubDetailPage'
import ExploreSocietiesPage     from '../features/explore/pages/ExploreSocietiesPage'
import ExploreSocietyDetailPage from '../features/explore/pages/ExploreSocietyDetailPage'
import ExploreEventsPage        from '../features/explore/pages/ExploreEventsPage'
import ExploreEventDetailPage   from '../features/explore/pages/ExploreEventDetailPage'

// ── Events — Phase 5 ───────────────────────────────────────────────────────────
import EventsListPage  from '../features/events/pages/EventsListPage'
import CreateEventPage from '../features/events/pages/CreateEventPage'
import EventDetailPage from '../features/events/pages/EventDetailPage'
import EditEventPage   from '../features/events/pages/EditEventPage'

// ── Approvals — Phase 6 ────────────────────────────────────────────────────────
import ApprovalsPage from '../features/approvals/pages/ApprovalsPage'

// ── Calendar — Phase 7 ────────────────────────────────────────────────────────
import CalendarPage from '../features/calendar/pages/CalendarPage'

// ── Clubs & Societies — Phase 8 ───────────────────────────────────────────────
import ClubsPage          from '../features/clubs/pages/ClubsPage'
import ClubDetailPage     from '../features/clubs/pages/ClubDetailPage'
import SocietiesPage      from '../features/societies/pages/SocietiesPage'
import SocietyDetailPage  from '../features/societies/pages/SocietyDetailPage'

// ── Memberships — Phase 8 ─────────────────────────────────────────────────────
import MembershipsPage from '../features/memberships/pages/MembershipsPage'

// ── Governance — Phase 9 ──────────────────────────────────────────────────────
import GovernancePage           from '../features/governance/pages/GovernancePage'
import GovernanceConfigPage     from '../features/governance/pages/GovernanceConfigPage'
import GovernanceTemplatesPage  from '../features/governance/pages/GovernanceTemplatesPage'

// ── Audit — Phase 9 ───────────────────────────────────────────────────────────
import AuditPage from '../features/audit/pages/AuditPage'

// ── Admin — Phase 9 ───────────────────────────────────────────────────────────
import AdminUsersPage         from '../features/admin/pages/AdminUsersPage'
import AdminOrganizationsPage from '../features/admin/pages/AdminOrganizationsPage'

// ── Phase 10 ──────────────────────────────────────────────────────────────────
import LeaderboardPage from '../features/leaderboard/pages/LeaderboardPage'
import ProfilePage     from '../features/profile/pages/ProfilePage'
import SettingsPage    from '../features/settings/pages/SettingsPage'
import HelpPage        from '../features/help/pages/HelpPage'

export const router = createBrowserRouter([

  // ── Public auth routes ─────────────────────────────────────────────────────
  { path: '/auth/login',            element: <PublicRoute><LoginPage /></PublicRoute> },
  { path: '/auth/register',         element: <PublicRoute><RegisterChoicePage /></PublicRoute> },
  { path: '/auth/register/student', element: <PublicRoute><RegisterStudentPage /></PublicRoute> },
  { path: '/auth/register/faculty', element: <PublicRoute><RegisterFacultyPage /></PublicRoute> },
  { path: '/auth/verify-email',     element: <VerifyEmailPage /> },
  { path: '/auth/forgot-password',  element: <PublicRoute><ForgotPasswordPage /></PublicRoute> },
  { path: '/auth/reset-password',   element: <PublicRoute><ResetPasswordPage /></PublicRoute> },

  // ── All protected routes share one Layout ─────────────────────────────────
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },

      // Dashboard
      { path: 'dashboard', element: <DashboardPage /> },

      // Explore
      { path: 'explore',                element: <ExplorePage /> },
      { path: 'explore/clubs',          element: <ExploreClubsPage /> },
      { path: 'explore/clubs/:id',      element: <ExploreClubDetailPage /> },
      { path: 'explore/societies',      element: <ExploreSocietiesPage /> },
      { path: 'explore/societies/:id',  element: <ExploreSocietyDetailPage /> },
      { path: 'explore/events',         element: <ExploreEventsPage /> },
      { path: 'explore/events/:id',     element: <ExploreEventDetailPage /> },

      // Events — new MUST come before :id
      { path: 'events',          element: <EventsListPage /> },
      { path: 'events/new',      element: <CreateEventPage /> },
      { path: 'events/:id',      element: <EventDetailPage /> },
      { path: 'events/:id/edit', element: <EditEventPage /> },

      // Approvals
      { path: 'approvals', element: <ApprovalsPage /> },

      // Calendar
      { path: 'calendar', element: <CalendarPage /> },

      // Clubs — members and roles are tabs inside ClubDetailPage
      { path: 'clubs',             element: <ClubsPage /> },
      { path: 'clubs/:id',         element: <ClubDetailPage /> },
      { path: 'clubs/:id/members', element: <ClubDetailPage /> },
      { path: 'clubs/:id/roles',   element: <ClubDetailPage /> },

      // Societies
      { path: 'societies',     element: <SocietiesPage /> },
      { path: 'societies/:id', element: <SocietyDetailPage /> },

      // Memberships
      { path: 'memberships', element: <MembershipsPage /> },

      // Governance — templates MUST come before :scopeId
      { path: 'governance',                element: <GovernancePage /> },
      { path: 'governance/templates',      element: <GovernanceTemplatesPage /> },
      { path: 'governance/:scopeId',       element: <GovernanceConfigPage /> },

      // Audit
      { path: 'audit', element: <AuditPage /> },

      // Admin
      { path: 'admin/users',         element: <AdminUsersPage /> },
      { path: 'admin/organizations', element: <AdminOrganizationsPage /> },

      // Phase 10
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'profile',     element: <ProfilePage /> },
      { path: 'settings',    element: <SettingsPage /> },
      { path: 'help',        element: <HelpPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/dashboard" replace /> },
])