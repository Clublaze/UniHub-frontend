// Shared by CreateEventPage and EditEventPage.
// Props:
//   initialValues — null for create, or the existing event object for edit
//   onSubmit(payload) — called when all validation passes
//   isSubmitting — disables the submit button
//   leadClubs — from store.getLeadClubs(), array of { scopeId, scopeName }

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Switch } from '../../../components/ui/switch'
import { Separator } from '../../../components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../../components/ui/select'

const CATEGORIES = [
  'WORKSHOP', 'SEMINAR', 'HACKATHON', 'COMPETITION',
  'CULTURAL', 'GUEST_LECTURE', 'FDP', 'WEBINAR',
  'INDUSTRIAL_VISIT', 'OTHER',
]
const SPONSOR_TYPES = ['CASH', 'IN_KIND', 'MEDIA']

const emptyGuest   = { name: '', affiliation: '', role: '' }
const emptySponsor = { name: '', type: 'CASH' }

function buildInitial(iv) {
  return {
    organizingClubId:     iv?.organizingClubId                    || '',
    title:                iv?.title                               || '',
    description:          iv?.description                         || '',
    objective:            iv?.objective                           || '',
    category:             iv?.category                            || '',
    startDate:            iv?.startDate?.slice(0, 10)             || '',
    endDate:              iv?.endDate?.slice(0, 10)               || '',
    venue:                iv?.venue                               || '',
    expectedParticipants: iv?.expectedParticipants                || '',
    targetAudience:       iv?.targetAudience                      || '',
    isPublic:             iv?.isPublic                            ?? true,
    guestSpeakers:        iv?.guestSpeakers?.length
                            ? iv.guestSpeakers
                            : [{ ...emptyGuest }],
    sponsors:             iv?.sponsors?.length ? iv.sponsors : [],
    proposal:             iv?.attachments?.proposal               || '',
    runOfShow:            iv?.attachments?.runOfShow              || '',
    poster:               iv?.attachments?.poster                 || '',
  }
}

export default function EventForm({
  initialValues = null,
  onSubmit,
  isSubmitting = false,
  leadClubs = [],
}) {
  const [form, setForm]     = useState(() => buildInitial(initialValues))
  const [errors, setErrors] = useState({})
  const isEdit              = !!initialValues?._id

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const setVal = (field, value) =>
    setForm(f => ({ ...f, [field]: value }))

  // Guest handlers
  const addGuest    = () =>
    setForm(f => ({ ...f, guestSpeakers: [...f.guestSpeakers, { ...emptyGuest }] }))
  const removeGuest = (i) =>
    setForm(f => ({ ...f, guestSpeakers: f.guestSpeakers.filter((_, idx) => idx !== i) }))
  const setGuest    = (i, field) => (e) =>
    setForm(f => ({
      ...f,
      guestSpeakers: f.guestSpeakers.map((g, idx) =>
        idx === i ? { ...g, [field]: e.target.value } : g
      ),
    }))

  // Sponsor handlers
  const addSponsor    = () =>
    setForm(f => ({ ...f, sponsors: [...f.sponsors, { ...emptySponsor }] }))
  const removeSponsor = (i) =>
    setForm(f => ({ ...f, sponsors: f.sponsors.filter((_, idx) => idx !== i) }))
  const setSponsor    = (i, field, value) =>
    setForm(f => ({
      ...f,
      sponsors: f.sponsors.map((s, idx) =>
        idx === i ? { ...s, [field]: value } : s
      ),
    }))

  const validate = () => {
    const e = {}
    if (!form.organizingClubId)
      e.organizingClubId = 'Select a club'
    if (!form.title?.trim() || form.title.trim().length < 3)
      e.title = 'Title must be at least 3 characters'
    if (!form.description?.trim() || form.description.trim().length < 10)
      e.description = 'Description must be at least 10 characters'
    if (!form.objective?.trim() || form.objective.trim().length < 10)
      e.objective = 'Objective must be at least 10 characters'
    if (!form.category)
      e.category = 'Select a category'
    if (!form.startDate)
      e.startDate = 'Start date is required'
    if (!form.endDate)
      e.endDate = 'End date is required'
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be on or after start date'
    if (!form.venue?.trim())
      e.venue = 'Venue is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      organizingClubId:     form.organizingClubId,
      title:                form.title.trim(),
      description:          form.description.trim(),
      objective:            form.objective.trim(),
      category:             form.category,
      startDate:            form.startDate,
      endDate:              form.endDate,
      venue:                form.venue.trim(),
      expectedParticipants: form.expectedParticipants ? Number(form.expectedParticipants) : undefined,
      targetAudience:       form.targetAudience?.trim() || undefined,
      isPublic:             form.isPublic,
      guestSpeakers:        form.guestSpeakers.filter(g => g.name.trim()),
      sponsors:             form.sponsors.filter(s => s.name.trim()),
      attachments: {
        proposal:  form.proposal  || undefined,
        runOfShow: form.runOfShow || undefined,
        poster:    form.poster    || undefined,
      },
    })
  }

  const err = (field) =>
    errors[field] ? (
      <p className="text-xs text-destructive mt-1">{errors[field]}</p>
    ) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Club selection */}
      {leadClubs.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-semibold text-foreground">Organizing Club</h3>
          <div className="space-y-1">
            <Label>Club *</Label>
            <Select
              value={form.organizingClubId}
              onValueChange={(v) => setVal('organizingClubId', v)}
              disabled={isEdit}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select a club" />
              </SelectTrigger>
              <SelectContent>
                {leadClubs.map(c => (
                  <SelectItem key={c.scopeId} value={c.scopeId}>
                    {c.scopeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err('organizingClubId')}
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                Organizing club cannot be changed after creation.
              </p>
            )}
          </div>
          <Separator />
        </section>
      )}

      {/* Basic info */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">Basic Information</h3>

        <div className="space-y-1">
          <Label>Event Title *</Label>
          <Input
            value={form.title}
            onChange={set('title')}
            placeholder="e.g. AI Workshop 2025"
            className="max-w-lg"
          />
          {err('title')}
        </div>

        <div className="space-y-1">
          <Label>Category *</Label>
          <Select value={form.category} onValueChange={(v) => setVal('category', v)}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {err('category')}
        </div>

        <div className="space-y-1">
          <Label>
            Description *
            <span className="text-xs text-muted-foreground ml-1">(min 10 chars)</span>
          </Label>
          <Textarea
            rows={3}
            value={form.description}
            onChange={set('description')}
            placeholder="What is this event about?"
            className="max-w-lg"
          />
          {err('description')}
        </div>

        <div className="space-y-1">
          <Label>
            Objective *
            <span className="text-xs text-muted-foreground ml-1">(min 10 chars)</span>
          </Label>
          <Textarea
            rows={2}
            value={form.objective}
            onChange={set('objective')}
            placeholder="What will attendees gain?"
            className="max-w-lg"
          />
          {err('objective')}
        </div>
      </section>

      <Separator />

      {/* Schedule & venue */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">Schedule & Venue</h3>

        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <div className="space-y-1">
            <Label>Start Date *</Label>
            <Input type="date" value={form.startDate} onChange={set('startDate')} />
            {err('startDate')}
          </div>
          <div className="space-y-1">
            <Label>End Date *</Label>
            <Input type="date" value={form.endDate} onChange={set('endDate')} />
            {err('endDate')}
          </div>
        </div>

        <div className="space-y-1">
          <Label>Venue *</Label>
          <Input
            value={form.venue}
            onChange={set('venue')}
            placeholder="e.g. Auditorium A"
            className="max-w-sm"
          />
          {err('venue')}
        </div>
      </section>

      <Separator />

      {/* Audience */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">Audience</h3>

        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <div className="space-y-1">
            <Label>Expected Participants</Label>
            <Input
              type="number"
              min={0}
              value={form.expectedParticipants}
              onChange={set('expectedParticipants')}
              placeholder="e.g. 200"
            />
          </div>
          <div className="space-y-1">
            <Label>Target Audience</Label>
            <Input
              value={form.targetAudience}
              onChange={set('targetAudience')}
              placeholder="e.g. CSE students"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={form.isPublic}
            onCheckedChange={(v) => setVal('isPublic', v)}
          />
          <div>
            <p className="text-sm font-medium text-foreground">Public Event</p>
            <p className="text-xs text-muted-foreground">
              Visible on the Explore page for all university members
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Guest speakers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Guest Speakers</h3>
          <Button type="button" variant="outline" size="sm" onClick={addGuest}>
            <Plus className="h-4 w-4 mr-1" /> Add Guest
          </Button>
        </div>

        <div className="space-y-3 max-w-lg">
          {form.guestSpeakers.map((g, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-end">
              <div className="space-y-1">
                {i === 0 && <Label className="text-xs">Name</Label>}
                <Input
                  placeholder="Full name"
                  value={g.name}
                  onChange={setGuest(i, 'name')}
                />
              </div>
              <div className="space-y-1">
                {i === 0 && <Label className="text-xs">Affiliation</Label>}
                <Input
                  placeholder="Organisation"
                  value={g.affiliation}
                  onChange={setGuest(i, 'affiliation')}
                />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  {i === 0 && <Label className="text-xs">Role</Label>}
                  <Input
                    placeholder="e.g. Keynote"
                    value={g.role}
                    onChange={setGuest(i, 'role')}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeGuest(i)}
                  disabled={form.guestSpeakers.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Sponsors */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Sponsors</h3>
          <Button type="button" variant="outline" size="sm" onClick={addSponsor}>
            <Plus className="h-4 w-4 mr-1" /> Add Sponsor
          </Button>
        </div>

        {form.sponsors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sponsors added yet.</p>
        ) : (
          <div className="space-y-3 max-w-lg">
            {form.sponsors.map((s, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  {i === 0 && <Label className="text-xs">Sponsor Name</Label>}
                  <Input
                    placeholder="Company or person"
                    value={s.name}
                    onChange={(e) => setSponsor(i, 'name', e.target.value)}
                  />
                </div>
                <div className="w-32 space-y-1">
                  {i === 0 && <Label className="text-xs">Type</Label>}
                  <Select
                    value={s.type}
                    onValueChange={(v) => setSponsor(i, 'type', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPONSOR_TYPES.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeSponsor(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Documents */}
      <section className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">Documents</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Paste public URLs to your uploaded PDFs and images (S3, Google Drive, etc.)
          </p>
        </div>

        <div className="space-y-3 max-w-lg">
          <div className="space-y-1">
            <Label>Event Proposal (PDF URL)</Label>
            <Input value={form.proposal} onChange={set('proposal')} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label>Run of Show (PDF URL)</Label>
            <Input value={form.runOfShow} onChange={set('runOfShow')} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label>Poster (Image URL)</Label>
            <Input value={form.poster} onChange={set('poster')} placeholder="https://..." />
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="min-w-36">
          {isSubmitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Event')}
        </Button>
      </div>

    </form>
  )
}