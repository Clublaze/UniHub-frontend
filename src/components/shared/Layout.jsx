import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sheet, SheetContent } from '../ui/sheet'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Desktop sidebar — always visible on md+ ── */}
      <aside className="hidden w-60 shrink-0 md:block">
        <Sidebar />
        {/* onClose not passed here — desktop never needs to close the sidebar */}
      </aside>

      {/* ── Mobile sidebar — hidden until hamburger is clicked ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 p-0 border-0">
          <Sidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ── Main column: topbar + page content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        {/* Page content — this is where each route renders */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

    </div>
  )
}