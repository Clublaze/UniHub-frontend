// ECR status colors come from theme.js via StatusBadge (type="ecr")
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useEcr, useSubmitEcr, useApproveEcr } from '../../hooks/useEcr'
import StatusBadge from '../../../../components/shared/StatusBadge'
import Loader from '../../../../components/shared/Loader'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Textarea } from '../../../../components/ui/textarea'
import { Separator } from '../../../../components/ui/separator'

const emptyGuest = { name: '', affiliation: '' }

function toForm(ecr) {
  if (!ecr) return {
    actualParticipants: '', chiefGuests: [{ ...emptyGuest }],
    objectivesAchieved: '', eventDescription: '', lessonsLearned: '',
    photoUrls: [''], feedbackSummary: '', socialMediaReach: '',
  }
  return {
    actualParticipants: ecr.actualParticipants     ?? '',
    chiefGuests:        ecr.chiefGuests?.length ? ecr.chiefGuests : [{ ...emptyGuest }],
    objectivesAchieved: ecr.objectivesAchieved     || '',
    eventDescription:   ecr.eventDescription       || '',
    lessonsLearned:     ecr.lessonsLearned          || '',
    photoUrls:          ecr.photoUrls?.length ? ecr.photoUrls : [''],
    feedbackSummary:    ecr.feedbackSummary         || '',
    socialMediaReach:   ecr.socialMediaReach        ?? '',
  }
}

function EcrReadOnly({ ecr }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-card p-4">
        <div>
          <p className="text-xs text-muted-foreground">Actual Participants</p>
          <p className="font-medium text-foreground">{ecr.actualParticipants}</p>
        </div>
        {ecr.socialMediaReach != null && (
          <div>
            <p className="text-xs text-muted-foreground">Social Media Reach</p>
            <p className="font-medium text-foreground">{ecr.socialMediaReach}</p>
          </div>
        )}
      </div>
      {[
        ['Objectives Achieved', ecr.objectivesAchieved],
        ['Event Description',   ecr.eventDescription],
        ['Lessons Learned',     ecr.lessonsLearned],
        ['Feedback Summary',    ecr.feedbackSummary],
      ].filter(([, v]) => v).map(([label, value]) => (
        <div key={label}>
          <p className="font-medium text-foreground mb-1">{label}</p>
          <p className="text-muted-foreground">{value}</p>
        </div>
      ))}
      {ecr.chiefGuests?.filter(g => g.name).length > 0 && (
        <div>
          <p className="font-medium text-foreground mb-1">Chief Guests</p>
          {ecr.chiefGuests.filter(g => g.name).map((g, i) => (
            <p key={i} className="text-muted-foreground">
              {g.name}{g.affiliation ? ` · ${g.affiliation}` : ''}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default function EcrTab({ eventId, canSubmit, canApprove, isAdmin }) {
  const { data: ecr, isLoading, error } = useEcr(eventId)
  const { mutate: submitEcr,  isPending: submitting } = useSubmitEcr(eventId)
  const { mutate: approveEcr, isPending: approving  } = useApproveEcr(eventId)

  const [form, setForm]       = useState(() => toForm(null))
  const [initialized, setInit] = useState(false)

  if (ecr && !initialized) { setForm(toForm(ecr)); setInit(true) }

  const set      = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))
  const setGuest = (i, f) => (e) =>
    setForm(p => ({
      ...p,
      chiefGuests: p.chiefGuests.map((g, idx) =>
        idx === i ? { ...g, [f]: e.target.value } : g
      ),
    }))
  const addGuest    = () => setForm(p => ({ ...p, chiefGuests: [...p.chiefGuests, { ...emptyGuest }] }))
  const removeGuest = (i) => setForm(p => ({ ...p, chiefGuests: p.chiefGuests.filter((_, idx) => idx !== i) }))
  const setPhoto    = (i) => (e) =>
    setForm(p => ({
      ...p,
      photoUrls: p.photoUrls.map((u, idx) => idx === i ? e.target.value : u),
    }))
  const addPhoto    = () => setForm(p => ({ ...p, photoUrls: [...p.photoUrls, ''] }))
  const removePhoto = (i) => setForm(p => ({ ...p, photoUrls: p.photoUrls.filter((_, idx) => idx !== i) }))

  const handleSubmit = (e) => {
    e.preventDefault()
    submitEcr({
      actualParticipants: Number(form.actualParticipants) || 0,
      chiefGuests:        form.chiefGuests.filter(g => g.name.trim()),
      objectivesAchieved: form.objectivesAchieved.trim(),
      eventDescription:   form.eventDescription.trim(),
      lessonsLearned:     form.lessonsLearned.trim() || undefined,
      photoUrls:          form.photoUrls.filter(u => u.trim()),
      feedbackSummary:    form.feedbackSummary.trim() || undefined,
      socialMediaReach:   form.socialMediaReach ? Number(form.socialMediaReach) : undefined,
    })
  }

  if (isLoading) return <Loader />

  if (ecr?.status === 'APPROVED') {
    return (
      <div className="space-y-4">
        <StatusBadge status="APPROVED" type="ecr" />
        <EcrReadOnly ecr={ecr} />
      </div>
    )
  }

  if (canApprove && ecr?.status === 'SUBMITTED') {
    return (
      <div className="space-y-5">
        <StatusBadge status="SUBMITTED" type="ecr" />
        <EcrReadOnly ecr={ecr} />
        <Separator />
        <Button onClick={() => approveEcr()} disabled={approving}>
          {approving ? 'Approving...' : '✓ Approve ECR'}
        </Button>
      </div>
    )
  }

  if (isAdmin && ecr) {
    return (
      <div className="space-y-4">
        <StatusBadge status={ecr.status} type="ecr" />
        <EcrReadOnly ecr={ecr} />
      </div>
    )
  }

  if (!canSubmit) {
    return (
      <div className="rounded-lg border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">ECR is not accessible for your role.</p>
      </div>
    )
  }

  if (ecr?.status === 'SUBMITTED') {
    return (
      <div className="space-y-4">
        <StatusBadge status="SUBMITTED" type="ecr" />
        <p className="text-sm text-muted-foreground">Awaiting faculty approval.</p>
        <EcrReadOnly ecr={ecr} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-1">
        <Label>Actual Participants *</Label>
        <Input
          type="number" min={0}
          value={form.actualParticipants}
          onChange={set('actualParticipants')}
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Chief Guests</Label>
          <Button type="button" variant="outline" size="sm" onClick={addGuest}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        {form.chiefGuests.map((g, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              {i === 0 && <Label className="text-xs">Name</Label>}
              <Input placeholder="Full name" value={g.name} onChange={setGuest(i, 'name')} />
            </div>
            <div className="flex-1 space-y-1">
              {i === 0 && <Label className="text-xs">Affiliation</Label>}
              <Input placeholder="Organisation" value={g.affiliation} onChange={setGuest(i, 'affiliation')} />
            </div>
            <Button
              type="button" variant="ghost" size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => removeGuest(i)}
              disabled={form.chiefGuests.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label>Objectives Achieved *</Label>
        <Textarea rows={3} value={form.objectivesAchieved} onChange={set('objectivesAchieved')} required />
      </div>

      <div className="space-y-1">
        <Label>Event Description *</Label>
        <Textarea rows={3} value={form.eventDescription} onChange={set('eventDescription')} required />
      </div>

      <div className="space-y-1">
        <Label>Lessons Learned</Label>
        <Textarea rows={2} value={form.lessonsLearned} onChange={set('lessonsLearned')} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Photo URLs</Label>
          <Button type="button" variant="outline" size="sm" onClick={addPhoto}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        {form.photoUrls.map((u, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="https://..."
              value={u}
              onChange={setPhoto(i)}
              className="flex-1"
            />
            <Button
              type="button" variant="ghost" size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => removePhoto(i)}
              disabled={form.photoUrls.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label>Feedback Summary</Label>
        <Textarea rows={2} value={form.feedbackSummary} onChange={set('feedbackSummary')} />
      </div>

      <div className="space-y-1">
        <Label>Social Media Reach</Label>
        <Input type="number" min={0} value={form.socialMediaReach} onChange={set('socialMediaReach')} />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit ECR'}
      </Button>
    </form>
  )
}