// src/components/shared/Layout.jsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sheet, SheetContent } from '../ui/sheet'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { dark } from '../../styles/theme'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: dark.bg,
      }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden md:block"
        style={{ width: '240px', flexShrink: 0 }}
      >
        <div style={{ width: '240px', height: '100%' }}>
          <Sidebar />
        </div>
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          style={{ width: '240px', padding: 0, border: 'none' }}
        >
          <Sidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
            background: dark.bg,
            color: dark.text,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}