import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/shared/ProtectedRoute'
import PublicRoute from '../components/shared/PublicRoute'

// Auth pages
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterChoicePage from '../features/auth/pages/RegisterChoicePage'
import RegisterStudentPage from '../features/auth/pages/RegisterStudentPage'
import RegisterFacultyPage from '../features/auth/pages/RegisterFacultyPage'
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage'
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage'

// Placeholder — replace as you build each phase
const Placeholder = ({ name }) => (
  <div className="p-8 text-muted-foreground">
    {name} — coming soon
  </div>
)

export const router = createBrowserRouter([
  // ── Public auth routes ──
  {
    path: '/auth/login',
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: '/auth/register',
    element: <PublicRoute><RegisterChoicePage /></PublicRoute>,
  },
  {
    path: '/auth/register/student',
    element: <PublicRoute><RegisterStudentPage /></PublicRoute>,
  },
  {
    path: '/auth/register/faculty',
    element: <PublicRoute><RegisterFacultyPage /></PublicRoute>,
  },
  {
    path: '/auth/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/auth/forgot-password',
    element: <PublicRoute><ForgotPasswordPage /></PublicRoute>,
  },
  {
    path: '/auth/reset-password',
    element: <PublicRoute><ResetPasswordPage /></PublicRoute>,
  },

  // ── Protected routes (add layout shell in Phase 2) ──
  {
    path: '/dashboard',
    element: <ProtectedRoute><Placeholder name="Dashboard" /></ProtectedRoute>,
  },
  {
    path: '/',
    element: <Placeholder name="Landing" />,
  },
])