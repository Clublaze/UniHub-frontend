import { useState } from 'react'
import { History } from 'lucide-react'
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
  DialogDescription,
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

const ALL_TYPES = '__ALL_USER_TYPES__'

const USER_TYPES = [
  'STUDENT', 'FACULTY', 'UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN',
]

function formatLoginReason(log) {
  if (log.success) return 'Authenticated successfully'

  const labels = {
    WRONG_PASSWORD: 'Wrong password',
    USER_NOT_FOUND: 'User not found',
    BLOCKED: 'Blocked account',
    EMAIL_NOT_VERIFIED: 'Email not verified',
  }

  return labels[log.failReason] || 'Login failed'
}

function summarizeUserAgent(userAgent) {
  if (!userAgent) return null

  const browser =
    userAgent.includes('Edg/') ? 'Microsoft Edge'
      : userAgent.includes('Chrome/') ? 'Google Chrome'
        : userAgent.includes('Firefox/') ? 'Mozilla Firefox'
          : userAgent.includes('Safari/') && !userAgent.includes('Chrome/') ? 'Safari'
            : null

  const platform =
    userAgent.includes('Windows') ? 'Windows'
      : userAgent.includes('Mac OS X') ? 'macOS'
        : userAgent.includes('Android') ? 'Android'
          : userAgent.includes('iPhone') || userAgent.includes('iPad') ? 'iOS'
            : userAgent.includes('Linux') ? 'Linux'
              : null

  if (browser && platform) return `${browser} on ${platform}`
  return browser || platform || userAgent
}

function formatDateTime(dateStr) {
  if (!dateStr) return 'Unknown time'

  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function LoginHistoryDialog({ userId, onClose }) {
  const { data: logs = [], isLoading } = useLoginHistory(userId)

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className="no-scrollbar max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Login History</DialogTitle>
          <DialogDescription>
            Recent sign-in attempts for this user account.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Loader size="sm" />
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No login records found.</p>
        ) : (
          <div className="mt-2 space-y-3">
            {logs.map((log, i) => (
              <div
                key={log.id || log._id || `${log.timestamp || 'unknown'}-${log.ipAddress || i}`}
                className="space-y-3 rounded-md border px-4 py-3 text-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {log.success ? 'Success' : 'Failed'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatLoginReason(log)}
                    </p>
                  </div>

                  <Badge variant={log.success ? 'outline' : 'destructive'} className="text-xs">
                    {log.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="text-foreground">{formatDateTime(log.timestamp)}</p>
                    <p className="text-muted-foreground">
                      {log.timestamp ? timeAgo(log.timestamp) : ''}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">IP Address</p>
                    <p className="text-foreground">{log.ipAddress || 'Unavailable'}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Email Used</p>
                    <p className="break-all text-foreground">{log.email || 'Unavailable'}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Device / Browser</p>
                    <p className="break-words text-foreground">
                      {summarizeUserAgent(log.userAgent) || 'Unavailable'}
                    </p>
                  </div>
                </div>
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

  const trimmedReason = reason.trim()
  const canSubmit = Boolean(user.id && trimmedReason.length >= 5)

  const handleBlock = () => {
    if (!canSubmit) return

    block(
      { userId: user.id, reason: trimmedReason },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Block User</DialogTitle>
          <DialogDescription>
            Blocking this account prevents future logins until it is manually unblocked.
          </DialogDescription>
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
            <p className="text-xs text-muted-foreground">
              Minimum 5 characters.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              disabled={!canSubmit || isPending}
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

function getUserDisplayName(user) {
  if (user.displayName) return user.displayName
  const full = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  if (full) return full
  return user.email
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [userType, setUserType] = useState(ALL_TYPES)
  const [page, setPage] = useState(1)
  const [historyUser, setHistoryUser] = useState(null)
  const [blockTarget, setBlockTarget] = useState(null)

  const realUserType = userType === ALL_TYPES ? '' : userType

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    userType: realUserType || undefined,
    page,
  })

  const { mutate: unblock, isPending: unblocking } = useUnblockUser()

  const users = data?.users ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all university user accounts.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />

        <Select
          value={userType}
          onValueChange={value => { setUserType(value); setPage(1) }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All user types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES}>All user types</SelectItem>
            {USER_TYPES.map(type => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ')}
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
              <thead className="border-b bg-muted/50">
                <tr>
                  {['Name', 'Email', 'Type', 'Status', 'Joined', ''].map(header => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr
                    key={user.id || user._id || user.email}
                    className="border-t transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {getUserDisplayName(user)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
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
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {user.createdAt ? formatDate(user.createdAt) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
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
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(current => current - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(current => current + 1)}
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
