import { useState } from 'react'
import { Download } from 'lucide-react'
import { useAuditFeed, downloadAuditCsv } from '../hooks/useAudit'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { timeAgo, formatDate } from '../../../utils/date.util'
import useAuthStore from '../../../store/authStore'

const ENTITY_TYPES = [
  '', 'EVENT', 'BUDGET', 'SETTLEMENT', 'ECR',
  'ROLE', 'MEMBERSHIP', 'GOVERNANCE_CONFIG', 'ORGANIZATION',
]

// Human-readable action label mapping
const ACTION_LABEL = {
  EVENT_SUBMITTED:     'Event Submitted',
  EVENT_APPROVED:      'Event Approved',
  EVENT_REJECTED:      'Event Rejected',
  EVENT_CREATED:       'Event Created',
  STEP_APPROVED:       'Step Approved',
  STEP_REJECTED:       'Step Rejected',
  ROLE_ASSIGNED:       'Role Assigned',
  ROLE_REMOVED:        'Role Removed',
  BUDGET_SUBMITTED:    'Budget Submitted',
  BUDGET_APPROVED:     'Budget Approved',
  ECR_SUBMITTED:       'ECR Submitted',
  ECR_APPROVED:        'ECR Approved',
  MEMBERSHIP_APPROVED: 'Membership Approved',
  MEMBERSHIP_REJECTED: 'Membership Rejected',
  SETTLEMENT_SUBMITTED:'Settlement Submitted',
}

export default function AuditPage() {
  const store   = useAuthStore()
  const isAdmin = store.isAdmin()

  const [entityType, setEntityType] = useState('')
  const [page,       setPage]       = useState(1)
  const [exportFrom, setExportFrom] = useState('')
  const [exportTo,   setExportTo]   = useState('')
  const [exporting,  setExporting]  = useState(false)

  const { data, isLoading } = useAuditFeed({
    ...(entityType ? { entityType } : {}),
    page,
  })

  const logs       = data?.logs       ?? []
  const totalPages = data?.totalPages ?? 1

  const handleExport = async () => {
    if (!exportFrom || !exportTo) return
    setExporting(true)
    try {
      await downloadAuditCsv(exportFrom, exportTo)
    } catch {
      // toast handled by the download fn
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Immutable record of every governance action.
            {!isAdmin && ' Read-only for your role.'}
          </p>
        </div>

        {/* CSV export — admins only */}
        {isAdmin && (
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              type="date"
              value={exportFrom}
              onChange={e => setExportFrom(e.target.value)}
              className="w-40"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="date"
              value={exportTo}
              onChange={e => setExportTo(e.target.value)}
              className="w-40"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!exportFrom || !exportTo || exporting}
            >
              <Download className="h-4 w-4 mr-1.5" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={entityType}
          onValueChange={v => { setEntityType(v); setPage(1) }}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All entity types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All entity types</SelectItem>
            {ENTITY_TYPES.filter(Boolean).map(t => (
              <SelectItem key={t} value={t}>
                {t.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <Loader text="Loading audit feed..." />
      ) : logs.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No audit records found.</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {['Time', 'Action', 'Entity', 'Performed By'].map(h => (
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
                {logs.map((log, i) => (
                  <tr key={log._id || i} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {log.timestamp ? timeAgo(log.timestamp) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-foreground font-medium text-xs">
                        {ACTION_LABEL[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {log.entityType && (
                        <Badge variant="secondary" className="text-xs">
                          {log.entityType}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {log.performedBy}
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
    </div>
  )
}