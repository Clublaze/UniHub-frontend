// All status colors come from budgetStatusClass in theme.js via StatusBadge
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useBudget, useSubmitBudget, useApproveBudget, useRejectBudget } from '../../hooks/useBudget'
import { bannerClass } from '../../../../styles/theme'
import StatusBadge from '../../../../components/shared/StatusBadge'
import Loader from '../../../../components/shared/Loader'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Textarea } from '../../../../components/ui/textarea'
import { Separator } from '../../../../components/ui/separator'

const emptyLine = { category: '', amount: '', notes: '' }

function toForm(b) {
  if (!b) return {
    proposedIncome: '', proposedExpense: '',
    expenseBreakdown: [{ ...emptyLine }],
    sponsorshipAmount: '', advanceRequired: '', financeOfficerInitials: '',
  }
  return {
    proposedIncome:         b.proposedIncome            ?? '',
    proposedExpense:        b.proposedExpense            ?? '',
    expenseBreakdown:       b.expenseBreakdown?.length
                              ? b.expenseBreakdown.map(l => ({
                                  category: l.category || '',
                                  amount:   l.amount   ?? '',
                                  notes:    l.notes    || '',
                                }))
                              : [{ ...emptyLine }],
    sponsorshipAmount:      b.sponsorshipAmount          ?? '',
    advanceRequired:        b.advanceRequired            ?? '',
    financeOfficerInitials: b.financeOfficerInitials     || '',
  }
}

// Read-only table shown to approvers and after approval
function BudgetReadOnly({ budget }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-card p-4">
        {[
          ['Proposed Income',     `₹${budget.proposedIncome?.toLocaleString()  ?? 0}`],
          ['Proposed Expense',    `₹${budget.proposedExpense?.toLocaleString() ?? 0}`],
          ['Sponsorship Amount',  `₹${budget.sponsorshipAmount?.toLocaleString() ?? 0}`],
          ['Advance Required',    `₹${budget.advanceRequired?.toLocaleString()  ?? 0}`],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {budget.expenseBreakdown?.length > 0 && (
        <div>
          <p className="font-medium text-foreground mb-2">Expense Breakdown</p>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {['Category', 'Amount', 'Notes'].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground text-xs">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budget.expenseBreakdown.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2 text-foreground">{l.category}</td>
                    <td className="px-3 py-2 text-foreground">₹{l.amount?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-muted-foreground">{l.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BudgetTab({ eventId, canSubmit, canApprove, isAdmin }) {
  const { data: budget, isLoading, error } = useBudget(eventId)
  const isNotFound = error?.response?.status === 404

  const { mutate: submitBudget, isPending: submitting }  = useSubmitBudget(eventId)
  const { mutate: approveBudget, isPending: approving }  = useApproveBudget(eventId)
  const { mutate: rejectBudget, isPending: rejecting }   = useRejectBudget(eventId)

  const [form, setForm]           = useState(() => toForm(null))
  const [initialized, setInit]    = useState(false)
  const [rejectReason, setReason] = useState('')
  const [showReject, setShowRej]  = useState(false)

  // Sync form with loaded budget — only on first load
  if (budget && !initialized) {
    setForm(toForm(budget))
    setInit(true)
  }

  const set    = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))
  const setLine = (i, f) => (e) =>
    setForm(prev => ({
      ...prev,
      expenseBreakdown: prev.expenseBreakdown.map((l, idx) =>
        idx === i ? { ...l, [f]: e.target.value } : l
      ),
    }))
  const addLine    = () =>
    setForm(p => ({ ...p, expenseBreakdown: [...p.expenseBreakdown, { ...emptyLine }] }))
  const removeLine = (i) =>
    setForm(p => ({ ...p, expenseBreakdown: p.expenseBreakdown.filter((_, idx) => idx !== i) }))

  const handleSubmit = (e) => {
    e.preventDefault()
    submitBudget({
      proposedIncome:        Number(form.proposedIncome)  || 0,
      proposedExpense:       Number(form.proposedExpense) || 0,
      expenseBreakdown:      form.expenseBreakdown
                               .filter(l => l.category.trim())
                               .map(l => ({ ...l, amount: Number(l.amount) || 0 })),
      sponsorshipAmount:     Number(form.sponsorshipAmount)     || 0,
      advanceRequired:       Number(form.advanceRequired)       || 0,
      financeOfficerInitials: form.financeOfficerInitials.trim() || undefined,
    })
  }

  if (isLoading) return <Loader />

  // APPROVED — full read-only for everyone
  if (budget?.status === 'APPROVED') {
    return (
      <div className="space-y-4">
        <StatusBadge status="APPROVED" type="budget" />
        <BudgetReadOnly budget={budget} />
      </div>
    )
  }

  // Approver sees read-only + approve/reject buttons
  if (canApprove && budget?.status === 'SUBMITTED') {
    return (
      <div className="space-y-5">
        <StatusBadge status="SUBMITTED" type="budget" />
        <BudgetReadOnly budget={budget} />
        <Separator />
        {!showReject ? (
          <div className="flex gap-3">
            <Button onClick={() => approveBudget()} disabled={approving}>
              {approving ? 'Approving...' : '✓ Approve Budget'}
            </Button>
            <Button variant="destructive" onClick={() => setShowRej(true)}>
              ✗ Reject
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-w-md">
            <Label>Rejection Reason *</Label>
            <Textarea
              rows={3}
              value={rejectReason}
              onChange={e => setReason(e.target.value)}
              placeholder="Explain why the budget is being rejected..."
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() =>
                  rejectBudget(rejectReason.trim(), {
                    onSuccess: () => { setShowRej(false); setReason('') },
                  })
                }
                disabled={!rejectReason.trim() || rejecting}
              >
                {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
              <Button variant="ghost" onClick={() => setShowRej(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Admin — always read-only
  if (isAdmin && budget) {
    return (
      <div className="space-y-4">
        <StatusBadge status={budget.status} type="budget" />
        <BudgetReadOnly budget={budget} />
      </div>
    )
  }

  // No permission
  if (!canSubmit) {
    return (
      <div className="rounded-lg border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Budget is only accessible to authorised roles.
        </p>
      </div>
    )
  }

  // Club lead reads submitted budget (awaiting approval)
  if (budget?.status === 'SUBMITTED') {
    return (
      <div className="space-y-4">
        <StatusBadge status="SUBMITTED" type="budget" />
        <p className="text-sm text-muted-foreground">
          Budget is awaiting approval. You cannot edit it now.
        </p>
        <BudgetReadOnly budget={budget} />
      </div>
    )
  }

  // Club lead — form (create or update draft/rejected)
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {budget?.status === 'REJECTED' && (
        <div className={`rounded-md p-3 text-sm ${bannerClass.error}`}>
          Budget was rejected. Please revise and resubmit.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {[
          ['proposedIncome',    'Proposed Income (₹)'],
          ['proposedExpense',   'Proposed Expense (₹) *'],
          ['sponsorshipAmount', 'Sponsorship Amount (₹)'],
          ['advanceRequired',   'Advance Required (₹)'],
        ].map(([field, label]) => (
          <div key={field} className="space-y-1">
            <Label>{label}</Label>
            <Input
              type="number"
              min={0}
              value={form[field]}
              onChange={set(field)}
              required={field === 'proposedExpense'}
            />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label>Finance Officer Initials</Label>
        <Input
          className="max-w-xs"
          value={form.financeOfficerInitials}
          onChange={set('financeOfficerInitials')}
          placeholder="e.g. MK"
        />
      </div>

      <Separator />

      {/* Expense breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Expense Breakdown</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            <Plus className="h-4 w-4 mr-1" /> Add Line
          </Button>
        </div>

        {form.expenseBreakdown.map((l, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-end">
            <div>
              {i === 0 && <Label className="text-xs mb-1 block">Category</Label>}
              <Input placeholder="e.g. Printing" value={l.category} onChange={setLine(i, 'category')} />
            </div>
            <div>
              {i === 0 && <Label className="text-xs mb-1 block">Amount (₹)</Label>}
              <Input type="number" min={0} value={l.amount} onChange={setLine(i, 'amount')} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                {i === 0 && <Label className="text-xs mb-1 block">Notes</Label>}
                <Input placeholder="Optional" value={l.notes} onChange={setLine(i, 'notes')} />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => removeLine(i)}
                disabled={form.expenseBreakdown.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : (budget ? 'Update Budget' : 'Submit Budget')}
      </Button>
    </form>
  )
}