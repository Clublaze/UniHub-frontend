import { useState } from 'react'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Switch } from '../../../components/ui/switch'
import { Separator } from '../../../components/ui/separator'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../../../components/ui/select'

const CANONICAL_ROLES = [
  'SECRETARY', 'VICE_PRESIDENT', 'PRESIDENT',
  'FACULTY_ADVISOR', 'HOD', 'DEAN', 'CLUB_LEAD',
]
const STEP_TYPES = ['SEQUENTIAL', 'PARALLEL']

// Valid scope overrides — Radix crashes on value=""
// Use a sentinel for "no override" (Default)
const NO_SCOPE_OVERRIDE = '__NONE__'
const SCOPE_OVERRIDES   = ['CLUB', 'SOCIETY', 'SCHOOL']

function getCurrentSession() {
  const d = new Date()
  const y = d.getFullYear()
  return d.getMonth() >= 7
    ? `${y}-${String(y + 1).slice(2)}`
    : `${y - 1}-${String(y).slice(2)}`
}

function buildInitial(config) {
  if (!config) {
    return {
      effectiveFrom:           new Date().toISOString().slice(0, 10),
      workflow:                [{ stepOrder: 1, canonicalRole: 'SECRETARY', stepType: 'SEQUENTIAL', scopeOverride: NO_SCOPE_OVERRIDE }],
      minimumNoticeDays:       15,
      requiresBudgetApproval:  true,
      ecrDeadlineDays:         3,
      blackoutDaysBeforeExam:  15,
      requiresTrio:            true,
      requiresSettlement:      true,
      allowMemberOnlyEvents:   false,
    }
  }
  return {
    effectiveFrom:           config.effectiveFrom?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    workflow:                config.approvalWorkflow?.length
      ? config.approvalWorkflow.map(s => ({
          stepOrder:     s.stepOrder,
          canonicalRole: s.canonicalRole,
          stepType:      s.stepType || 'SEQUENTIAL',
          // Map empty/null scopeOverride to sentinel
          scopeOverride: s.scopeOverride || NO_SCOPE_OVERRIDE,
        }))
      : [{ stepOrder: 1, canonicalRole: 'SECRETARY', stepType: 'SEQUENTIAL', scopeOverride: NO_SCOPE_OVERRIDE }],
    minimumNoticeDays:       config.rules?.minimumNoticeDays        ?? 15,
    requiresBudgetApproval:  config.rules?.requiresBudgetApproval   ?? true,
    ecrDeadlineDays:         config.rules?.ecrDeadlineDays          ?? 3,
    blackoutDaysBeforeExam:  config.rules?.blackoutDaysBeforeExam   ?? 15,
    requiresTrio:            config.rules?.requiresTrio             ?? true,
    requiresSettlement:      config.rules?.requiresSettlement       ?? true,
    allowMemberOnlyEvents:   config.rules?.allowMemberOnlyEvents    ?? false,
  }
}

export default function GovernanceConfigEditor({
  scopeId,
  existingConfig,
  onSave,
  isSaving,
}) {
  const [form, setForm] = useState(() => buildInitial(existingConfig))

  const setRule  = (field, val) => setForm(f => ({ ...f, [field]: val }))
  const setField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const addStep = () =>
    setForm(f => ({
      ...f,
      workflow: [
        ...f.workflow,
        {
          stepOrder:     f.workflow.length + 1,
          canonicalRole: 'SECRETARY',
          stepType:      'SEQUENTIAL',
          scopeOverride: NO_SCOPE_OVERRIDE,
        },
      ],
    }))

  const removeStep = (i) =>
    setForm(f => ({
      ...f,
      workflow: f.workflow
        .filter((_, idx) => idx !== i)
        .map((s, idx) => ({ ...s, stepOrder: idx + 1 })),
    }))

  const moveStep = (i, dir) => {
    const next = [...form.workflow]
    const swap = i + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[i], next[swap]] = [next[swap], next[i]]
    next.forEach((s, idx) => { s.stepOrder = idx + 1 })
    setForm(f => ({ ...f, workflow: next }))
  }

  const setStep = (i, field, val) =>
    setForm(f => ({
      ...f,
      workflow: f.workflow.map((s, idx) =>
        idx === i ? { ...s, [field]: val } : s
      ),
    }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      scopeId,
      effectiveFrom: form.effectiveFrom,
      approvalWorkflow: form.workflow.map(s => ({
        stepOrder:     s.stepOrder,
        canonicalRole: s.canonicalRole,
        stepType:      s.stepType,
        // Convert sentinel back to undefined (backend treats missing as "no override")
        scopeOverride: s.scopeOverride === NO_SCOPE_OVERRIDE ? undefined : s.scopeOverride,
      })),
      rules: {
        minimumNoticeDays:      Number(form.minimumNoticeDays),
        requiresBudgetApproval: form.requiresBudgetApproval,
        ecrDeadlineDays:        Number(form.ecrDeadlineDays),
        blackoutDaysBeforeExam: Number(form.blackoutDaysBeforeExam),
        requiresTrio:           form.requiresTrio,
        requiresSettlement:     form.requiresSettlement,
        allowMemberOnlyEvents:  form.allowMemberOnlyEvents,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Effective from */}
      <div className="space-y-1 max-w-xs">
        <Label>Effective From *</Label>
        <Input
          type="date"
          value={form.effectiveFrom}
          onChange={setField('effectiveFrom')}
          required
        />
        <p className="text-xs text-muted-foreground">
          Creates a new version. Previous events stay bound to the old version.
        </p>
      </div>

      <Separator />

      {/* Approval workflow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Approval Workflow</h3>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" /> Add Step
          </Button>
        </div>

        <div className="space-y-3">
          {form.workflow.map((step, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Step {step.stepOrder}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    type="button" variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => moveStep(i, -1)}
                    disabled={i === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button" variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => moveStep(i, 1)}
                    disabled={i === form.workflow.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => removeStep(i)}
                    disabled={form.workflow.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Role *</Label>
                  <Select
                    value={step.canonicalRole}
                    onValueChange={(v) => setStep(i, 'canonicalRole', v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CANONICAL_ROLES.map(r => (
                        <SelectItem key={r} value={r}>
                          {r.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Step Type</Label>
                  <Select
                    value={step.stepType}
                    onValueChange={(v) => setStep(i, 'stepType', v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STEP_TYPES.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Scope Override</Label>
                  <Select
                    value={step.scopeOverride}
                    onValueChange={(v) => setStep(i, 'scopeOverride', v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {/* Sentinel — Radix crashes on value="" */}
                      <SelectItem value={NO_SCOPE_OVERRIDE}>
                        Default (auto-resolve)
                      </SelectItem>
                      {SCOPE_OVERRIDES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rules */}
      <div className="space-y-5">
        <h3 className="font-semibold text-foreground">Governance Rules</h3>

        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {[
            ['minimumNoticeDays',      'Minimum Notice Days'],
            ['ecrDeadlineDays',        'ECR Deadline (days after event)'],
            ['blackoutDaysBeforeExam', 'Blackout Days Before Exam'],
          ].map(([field, label]) => (
            <div key={field} className="space-y-1">
              <Label className="text-sm">{label}</Label>
              <Input
                type="number"
                min={0}
                value={form[field]}
                onChange={(e) => setRule(field, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[
            ['requiresBudgetApproval', 'Requires Budget Approval',
              'Event cannot be fully approved until budget is also approved.'],
            ['requiresTrio',           'Requires Trio Documents',
              'Proposal + Run of Show + Poster must all be uploaded before submission.'],
            ['requiresSettlement',     'Requires Post-Event Settlement',
              'Financial settlement must be submitted and approved before event closes.'],
            ['allowMemberOnlyEvents',  'Allow Members-Only Events',
              'Club can mark events as internal — not visible in public Explore.'],
          ].map(([field, label, desc]) => (
            <div key={field} className="flex items-start gap-3">
              <Switch
                checked={Boolean(form[field])}
                onCheckedChange={(v) => setRule(field, v)}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSaving} className="min-w-36">
        {isSaving ? 'Saving...' : (existingConfig ? 'Save New Version' : 'Create Config')}
      </Button>

    </form>
  )
}