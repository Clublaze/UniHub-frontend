import { useState } from 'react'
import { Shield, History } from 'lucide-react'
import {
  useAdminUsers,
  useBlockUser,
  useUnblockUser,
  useLoginHistory,
} from '../../audit/hooks/useAudit'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { formatDate, timeAgo } from '../../../utils/date.util'

// Sentinel — Radix UI Select crashes on value=""
const ALL_TYPES = '__ALL_USER_TYPES__'

const USER_TYPES = [
  'STUDENT', 'FACULTY', 'UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN',
]

function LoginHistoryDialog({ userId, onClose }) {
  const { data: logs = [], isLoading } = useLoginHistory(userId)

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Login History</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loader size="sm" />
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No login records found.</p>
        ) : (
          <div className="space-y-2 mt-2">
            {logs.map((log, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <div>
                  <p className="text-foreground font-medium">
                    {log.success ? '✅ Success' : '❌ Failed'}
                  </p>
                  {log.ipAddress && (
                    <p className="text-xs text-muted-foreground">{log.ipAddress}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {log.timestamp ? timeAgo(log.timestamp) : '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function BlockDialog({ user, onClose }) {
  const [reason, setReason] = useState('')
  const { mutate: block, isPending } = useBlockUser()

  if (!user) return null

  const handleBlock = () => {
    if (!reason.trim()) return
    block(
      { userId: user.id, reason: reason.trim() },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Block User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Blocking{' '}
            <strong>
              {user.displayName ||
                `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                user.email}
            </strong>{' '}
            will prevent them from logging in. This is reversible.
          </p>
          <div className="space-y-1">
            <Label>Reason *</Label>
            <Textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Why is this account being blocked?"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              disabled={!reason.trim() || isPending}
              onClick={handleBlock}
            >
              {isPending ? 'Blocking...' : 'Block Account'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Derive the best display name from a user object
function getUserDisplayName(user) {
  if (user.displayName) return user.displayName
  const full = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  if (full) return full
  return user.email
}

export default function AdminUsersPage() {
  const [search,      setSearch]      = useState('')
  const [userType,    setUserType]    = useState(ALL_TYPES)
  const [page,        setPage]        = useState(1)
  const [historyUser, setHistoryUser] = useState(null)
  const [blockTarget, setBlockTarget] = useState(null)

  // Convert sentinel to empty string for the API
  const realUserType = userType === ALL_TYPES ? '' : userType

  const { data, isLoading } = useAdminUsers({
    search:   search || undefined,
    userType: realUserType || undefined,
    page,
  })

  const { mutate: unblock, isPending: unblocking } = useUnblockUser()

  const users      = data?.users      ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all university user accounts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />

        <Select
          value={userType}
          onValueChange={v => { setUserType(v); setPage(1) }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All user types" />
          </SelectTrigger>
          <SelectContent>
            {/* Sentinel — Radix crashes on value="" */}
            <SelectItem value={ALL_TYPES}>All user types</SelectItem>
            {USER_TYPES.map(t => (
              <SelectItem key={t} value={t}>
                {t.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Loader text="Loading users..." />
      ) : users.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {['Name', 'Email', 'Type', 'Status', 'Joined', ''].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-medium text-muted-foreground text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {getUserDisplayName(user)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {user.userType?.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.status === 'BLOCKED' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {user.createdAt ? formatDate(user.createdAt) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setHistoryUser(user.id)}
                          title="Login history"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        {user.status === 'ACTIVE' || user.status === 'PENDING_VERIFICATION' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setBlockTarget(user)}
                          >
                            Block
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => unblock(user.id)}
                            disabled={unblocking}
                          >
                            Unblock
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline" size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline" size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <LoginHistoryDialog
        userId={historyUser}
        onClose={() => setHistoryUser(null)}
      />
      <BlockDialog
        user={blockTarget}
        onClose={() => setBlockTarget(null)}
      />
    </div>
  )
}