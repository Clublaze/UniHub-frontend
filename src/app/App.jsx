import { RouterProvider } from 'react-router-dom'
import Providers from './providers'
import { router } from './router'
import { useInitAuth } from '../features/auth/hooks/useInitAuth'
import { Toaster } from '../components/ui/sonner'

function AppInner() {
  useInitAuth() // runs once on mount, restores session from cookie
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  )
}

export default function App() {
  return (
    <Providers>
      <AppInner />
    </Providers>
  )
}