// Role assignment form — userId is typed manually (no search endpoint available)
import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { useScopeRoles, useAssignRole, useRemoveRole } from '../hooks/useClubs'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../../../components/ui/select'
import { formatDate } from '../../../utils/date.util'

const CANONICAL_ROLES = [
  'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER',
  'PR_HEAD', 'CLUB_LEAD', 'CO_LEAD', 'COORDINATOR',
  'FACULTY_ADVISOR', 'HOD', 'DEAN',
]

// Guess the current academic session from today's date
// Aug–Dec → first half; Jan–Jul → second half of same year
function getCurrentSession() {
  const d = new Date()
  const y = d.getFullYear()
  return d.getMonth() >= 7
    ? `${y}-${String(y + 1).slice(2)}`
    : `${y - 1}-${String(y).slice(2)}`
}

function AssignRoleDialog({ scopeId, scopeType }) {
  const [open, setOpen]         = useState(false)
  const [userId, setUserId]     = useState('')
  const [role, setRole]         = useState('')
  const [displayName, setDn]    = useState('')
  const [sessionId, setSession] = useState(getCurrentSession())

  const { mutate: assign, isPending } = useAssignRole(scopeId)

  const handleAssign = () => {
    if (!userId.trim() || !role) return
    assign(
      {
        userId:          userId.trim(),
        scopeId,
        scopeType:       scopeType || 'CLUB',
        canonicalRole:   role,
        displayRoleName: displayName.trim() || undefined,
        sessionId:       sessionId.trim(),
      },
      {
        onSuccess: () => {
          setOpen(false)
          setUserId('')
          setRole('')
          setDn('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Assign Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>User ID *</Label>
            <Input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Paste the user's ID here"
            />
            <p className="text-xs text-muted-foreground">
              Find the user ID from the Audit Panel or Admin Users page.
            </p>
          </div>

          <div className="space-y-1">
            <Label>Canonical Role *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {CANONICAL_ROLES.map(r => (
                  <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Display Title (optional)</Label>
            <Input
              value={displayName}
              onChange={e => setDn(e.target.value)}
              placeholder="e.g. General Secretary"
            />
            <p className="text-xs text-muted-foreground">
              What this role is called at your university. Shown in the UI.
            </p>
          </div>

          <div className="space-y-1">
            <Label>Session *</Label>
            <Input
              value={sessionId}
              onChange={e => setSession(e.target.value)}
              placeholder="2025-26"
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleAssign}
              disabled={!userId.trim() || !role || isPending}
            >
              {isPending ? 'Assigning...' : 'Assign Role'}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function RolesTab({ scopeId, scopeType }) {
  const { data: roles = [], isLoading } = useScopeRoles(scopeId)
  const { mutate: remove, isPending: removing } = useRemoveRole(scopeId)

  const activeRoles = roles.filter(r => r.status === 'ACTIVE')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Role Assignments</h3>
        <AssignRoleDialog scopeId={scopeId} scopeType={scopeType} />
      </div>

      {isLoading ? (
        <Loader size="sm" />
      ) : activeRoles.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No roles assigned yet. Use the button above to assign one.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {['Role', 'Display Title', 'User', 'Session', ''].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeRoles.map(r => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {r.canonicalRole.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.displayRoleName || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.userName || r.userId}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.sessionId}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(r._id)}
                      disabled={removing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}