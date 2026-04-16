import { useState } from 'react'
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import {
  useSettlement,
  useSubmitSettlement,
  useApproveSettlement,
} from '../../hooks/useEcr'
import StatusBadge from '../../../../components/shared/StatusBadge'
import Loader from '../../../../components/shared/Loader'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Textarea } from '../../../../components/ui/textarea'
import { Separator } from '../../../../components/ui/separator'

const emptyLine = { category: '', amount: '', gstBillUrl: '' }

function toForm(s) {
  if (!s) {
    return {
      actualIncome:      '',
      actualExpense:     '',
      expenseBreakdown:  [{ ...emptyLine }],
      advanceSettlement: '',
      notes:             '',
    }
  }
  return {
    actualIncome:      s.actualIncome      ?? '',
    actualExpense:     s.actualExpense     ?? '',
    expenseBreakdown:  s.expenseBreakdown?.length
      ? s.expenseBreakdown.map(l => ({
          category:   l.category   || '',
          amount:     l.amount     ?? '',
          gstBillUrl: l.gstBillUrl || '',
        }))
      : [{ ...emptyLine }],
    advanceSettlement: s.advanceSettlement ?? '',
    notes:             s.notes            || '',
  }
}

function SettlementReadOnly({ s }) {
  return (
    <div className="space-y-4 text-sm">

      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-card p-4">
        {[
          ['Actual Income',      `₹${(s.actualIncome      ?? 0).toLocaleString()}`],
          ['Actual Expense',     `₹${(s.actualExpense     ?? 0).toLocaleString()}`],
          ['Advance Settlement', `₹${(s.advanceSettlement ?? 0).toLocaleString()}`],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {s.notes && (
        <div>
          <p className="font-medium text-foreground mb-1">Notes</p>
          <p className="text-muted-foreground">{s.notes}</p>
        </div>
      )}

      {s.expenseBreakdown?.length > 0 && (
        <div>
          <p className="font-medium text-foreground mb-2">Expense Breakdown</p>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {['Category', 'Amount', 'GST Bill'].map(h => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 font-medium text-muted-foreground text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.expenseBreakdown.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2 text-foreground">{l.category}</td>
                    <td className="px-3 py-2 text-foreground">
                      ₹{(l.amount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      {l.gstBillUrl ? (
                        <a
                          href={l.gstBillUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-xs"
                        >
                          View Bill <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
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

export default function SettlementTab({ eventId, canSubmit, canApprove, isAdmin }) {
  const { data: settlement, isLoading }                      = useSettlement(eventId)
  const { mutate: submitSettlement,  isPending: submitting } = useSubmitSettlement(eventId)
  const { mutate: approveSettlement, isPending: approving  } = useApproveSettlement(eventId)

  const [form, setForm]        = useState(() => toForm(null))
  const [initialized, setInit] = useState(false)

  if (settlement && !initialized) {
    setForm(toForm(settlement))
    setInit(true)
  }

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const setLine = (i, field) => (e) =>
    setForm(prev => ({
      ...prev,
      expenseBreakdown: prev.expenseBreakdown.map((l, idx) =>
        idx === i ? { ...l, [field]: e.target.value } : l
      ),
    }))

  const addLine = () =>
    setForm(prev => ({
      ...prev,
      expenseBreakdown: [...prev.expenseBreakdown, { ...emptyLine }],
    }))

  const removeLine = (i) =>
    setForm(prev => ({
      ...prev,
      expenseBreakdown: prev.expenseBreakdown.filter((_, idx) => idx !== i),
    }))

  const handleSubmit = (e) => {
    e.preventDefault()
    submitSettlement({
      actualIncome:      Number(form.actualIncome)      || 0,
      actualExpense:     Number(form.actualExpense)      || 0,
      advanceSettlement: Number(form.advanceSettlement) || 0,
      notes:             form.notes.trim()              || undefined,
      expenseBreakdown:  form.expenseBreakdown
        .filter(l => l.category.trim())
        .map(l => ({
          category:   l.category.trim(),
          amount:     Number(l.amount) || 0,
          gstBillUrl: l.gstBillUrl.trim() || undefined,
        })),
    })
  }

  if (isLoading) return <Loader />

  if (settlement?.status === 'APPROVED') {
    return (
      <div className="space-y-4">
        <StatusBadge status="APPROVED" type="settlement" />
        <SettlementReadOnly s={settlement} />
      </div>
    )
  }

  if (canApprove && settlement?.status === 'UNDER_REVIEW') {
    return (
      <div className="space-y-5">
        <StatusBadge status="UNDER_REVIEW" type="settlement" />
        <SettlementReadOnly s={settlement} />
        <Separator />
        <Button onClick={() => approveSettlement()} disabled={approving}>
          {approving ? 'Approving...' : '✓ Approve Settlement'}
        </Button>
      </div>
    )
  }

  if (isAdmin && settlement) {
    return (
      <div className="space-y-4">
        <StatusBadge status={settlement.status} type="settlement" />
        <SettlementReadOnly s={settlement} />
      </div>
    )
  }

  if (!canSubmit) {
    return (
      <div className="rounded-lg border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Settlement is not accessible for your role.
        </p>
      </div>
    )
  }

  if (settlement?.status === 'UNDER_REVIEW') {
    return (
      <div className="space-y-4">
        <StatusBadge status="UNDER_REVIEW" type="settlement" />
        <p className="text-sm text-muted-foreground">
          Settlement is awaiting faculty approval.
        </p>
        <SettlementReadOnly s={settlement} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">

      <div className="grid grid-cols-2 gap-4">
        {[
          ['actualIncome',      'Actual Income (₹)'],
          ['actualExpense',     'Actual Expense (₹) *'],
          ['advanceSettlement', 'Advance Settlement (₹)'],
        ].map(([field, label]) => (
          <div key={field} className="space-y-1">
            <Label>{label}</Label>
            <Input
              type="number"
              min={0}
              value={form[field]}
              onChange={set(field)}
              required={field === 'actualExpense'}
            />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label>Notes</Label>
        <Textarea
          rows={2}
          value={form.notes}
          onChange={set('notes')}
          placeholder="Any additional remarks..."
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Expense Breakdown (with GST Bills)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            <Plus className="h-4 w-4 mr-1" /> Add Line
          </Button>
        </div>

        {form.expenseBreakdown.map((l, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-end">
            <div>
              {i === 0 && <Label className="text-xs mb-1 block">Category</Label>}
              <Input
                placeholder="e.g. Printing"
                value={l.category}
                onChange={setLine(i, 'category')}
              />
            </div>
            <div>
              {i === 0 && <Label className="text-xs mb-1 block">Amount (₹)</Label>}
              <Input
                type="number"
                min={0}
                value={l.amount}
                onChange={setLine(i, 'amount')}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                {i === 0 && <Label className="text-xs mb-1 block">GST Bill URL</Label>}
                <Input
                  placeholder="https://..."
                  value={l.gstBillUrl}
                  onChange={setLine(i, 'gstBillUrl')}
                />
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
        {submitting
          ? 'Submitting...'
          : settlement
          ? 'Update Settlement'
          : 'Submit Settlement'}
      </Button>

    </form>
  )
}
