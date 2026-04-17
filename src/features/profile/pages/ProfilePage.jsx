import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Globe, Camera, Pen, ExternalLink,
} from 'lucide-react'
import {
  useMyProfile,
  useUpdateProfile,
  useUploadPhoto,
  useDeletePhoto,
  useUploadCover,
  useDeleteCover,
} from '../hooks/useProfile'
import StatusBadge   from '../../../components/shared/StatusBadge'
import Loader        from '../../../components/shared/Loader'
import { Button }    from '../../../components/ui/button'
import { Input }     from '../../../components/ui/input'
import { Label }     from '../../../components/ui/label'
import { Textarea }  from '../../../components/ui/textarea'
import { Badge }     from '../../../components/ui/badge'
import { Separator } from '../../../components/ui/separator'
import { Progress }  from '../../../components/ui/progress'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../../../components/ui/dialog'
import { formatDate, timeAgo } from '../../../utils/date.util'
import useAuthStore from '../../../store/authStore'

// ── Edit Profile Dialog ─────────────────────────────────────────────────────
function EditProfileDialog({ profile, open, onClose }) {
  const { mutate: update, isPending } = useUpdateProfile()
  const user = useAuthStore(s => s.user)

  const [form, setForm] = useState({
    name:           profile?.name            || '',
    department:     profile?.department      || '',
    graduationYear: profile?.graduationYear  || '',
    bio:            profile?.bio             || '',
    linkedinUrl:    profile?.linkedinUrl     || '',
    githubUrl:      profile?.githubUrl       || '',
    portfolioUrl:   profile?.portfolioUrl    || '',
  })

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSave = () => {
    const payload = {
      name:       form.name.trim()       || undefined,
      department: form.department.trim() || undefined,
      bio:        form.bio.trim()        || undefined,
      linkedinUrl:  form.linkedinUrl.trim()  || null,
      githubUrl:    form.githubUrl.trim()    || null,
      portfolioUrl: form.portfolioUrl.trim() || null,
    }
    if (user?.userType === 'STUDENT' && form.graduationYear) {
      payload.graduationYear = Number(form.graduationYear)
    }
    update(payload, { onSuccess: onClose })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>Display Name</Label>
            <Input value={form.name} onChange={set('name')} placeholder="Your full name" />
          </div>
          <div className="space-y-1">
            <Label>Department</Label>
            <Input value={form.department} onChange={set('department')} placeholder="e.g. Computer Science" />
          </div>
          {user?.userType === 'STUDENT' && (
            <div className="space-y-1">
              <Label>Graduation Year</Label>
              <Input
                type="number"
                min={2020}
                max={2040}
                value={form.graduationYear}
                onChange={set('graduationYear')}
                placeholder="e.g. 2026"
              />
            </div>
          )}
          <div className="space-y-1">
            <Label>Bio <span className="text-xs text-muted-foreground">(max 300 chars)</span></Label>
            <Textarea
              rows={3}
              maxLength={300}
              value={form.bio}
              onChange={set('bio')}
              placeholder="A short description about yourself..."
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.bio.length}/300
            </p>
          </div>
          <Separator />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Social Links
          </p>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label>LinkedIn URL</Label>
              <Input value={form.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1">
              <Label>GitHub URL</Label>
              <Input value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1">
              <Label>Portfolio URL</Label>
              <Input value={form.portfolioUrl} onChange={set('portfolioUrl')} placeholder="https://yoursite.com" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={handleSave} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Badge icons ──────────────────────────────────────────────────────────────
const BADGE_ICON = {
  FIRST_EVENT:       '🎉',
  EVENT_VETERAN:     '🏆',
  HACKATHON_ORG:     '💻',
  CLUB_LEAD:         '⚙️',
  PRESIDENT:         '👑',
  FACULTY_ADVISOR:   '🎓',
  MULTI_CLUB:        '🌟',
  COMMUNITY_BUILDER: '🤝',
  LEADERSHIP_TRACK:  '🚀',
}

// ── Activity icon ────────────────────────────────────────────────────────────
const ACTIVITY_ICON = {
  ROLE_ASSIGNED:       '🏷️',
  MEMBERSHIP_APPROVED: '✅',
  EVENT_CREATED:       '📝',
  EVENT_SUBMITTED:     '📤',
  EVENT_APPROVED:      '🎉',
  EVENT_CLOSED:        '🔒',
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile()
  const [editOpen, setEditOpen] = useState(false)

  const photoRef = useRef()
  const coverRef = useRef()

  const { mutate: uploadPhoto,  isPending: uploadingPhoto  } = useUploadPhoto()
  const { mutate: deletePhoto,  isPending: deletingPhoto   } = useDeletePhoto()
  const { mutate: uploadCover,  isPending: uploadingCover  } = useUploadCover()
  const { mutate: deleteCover,  isPending: deletingCover   } = useDeleteCover()

  const user = useAuthStore(s => s.user)

  if (isLoading) return <Loader text="Loading profile..." />

  // Profile not set up yet — show a setup prompt
  if (!profile) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center space-y-4 max-w-xl mx-auto">
        <div className="text-5xl">👤</div>
        <h2 className="text-xl font-semibold text-foreground">
          Profile not set up yet
        </h2>
        <p className="text-sm text-muted-foreground">
          Your profile is being created. If this persists, run the profile-service
          seed script: <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">node scripts/seed.js</code>
        </p>
      </div>
    )
  }

  const displayName = profile.name ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    user?.email

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Cover photo ─────────────────────────────────────────────────── */}
      <div className="relative">
        <div
          className="w-full h-40 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border"
        >
          {profile.coverPhotoUrl && (
            <img
              src={profile.coverPhotoUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Cover photo action */}
        <div className="absolute top-3 right-3 flex gap-2">
          <input
            ref={coverRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])}
          />
          <Button
            size="sm"
            variant="secondary"
            className="backdrop-blur-sm bg-white/80"
            onClick={() => coverRef.current?.click()}
            disabled={uploadingCover || deletingCover}
          >
            <Camera className="h-3.5 w-3.5 mr-1" />
            {uploadingCover ? 'Uploading...' : 'Change Cover'}
          </Button>
          {profile.coverPhotoUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="backdrop-blur-sm bg-white/80 text-destructive hover:text-destructive"
              onClick={() => deleteCover()}
              disabled={deletingCover}
            >
              Remove
            </Button>
          )}
        </div>

        {/* Avatar — overlaps the cover */}
        <div className="absolute -bottom-12 left-6 flex items-end gap-3">
          <div className="relative">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={displayName}
                className="h-24 w-24 rounded-full object-cover border-4 border-card shadow-md"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-card shadow-md flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {displayName?.[0]?.toUpperCase() ?? '?'}
                </span>
              </div>
            )}
            <input
              ref={photoRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
            />
            <button
              onClick={() => photoRef.current?.click()}
              disabled={uploadingPhoto || deletingPhoto}
              className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:opacity-90 transition-opacity"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Name row (offset for avatar overlap) ─────────────────────────── */}
      <div className="pt-10 flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{profile.userType?.replace(/_/g, ' ')}</Badge>
            {profile.department && <span>{profile.department}</span>}
            {profile.graduationYear && (
              <span>Class of {profile.graduationYear}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Member since {profile.createdAt ? formatDate(profile.createdAt) : '—'}
          </p>
        </div>
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          <Pen className="h-4 w-4 mr-1.5" /> Edit Profile
        </Button>
      </div>

      {/* ── Profile completion bar ────────────────────────────────────────── */}
      {profile.completionScore < 100 && (
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Profile Completion</span>
            <span className="text-muted-foreground">{profile.completionScore}%</span>
          </div>
          <Progress value={profile.completionScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {!profile.name       && '• Add your name. '}
            {!profile.photoUrl   && '• Upload a photo. '}
            {!profile.bio        && '• Write a bio. '}
            {!profile.department && '• Add your department. '}
            {!profile.linkedinUrl && !profile.githubUrl && '• Add a social link. '}
          </p>
        </div>
      )}

      {/* ── Bio ──────────────────────────────────────────────────────────── */}
      {profile.bio && (
        <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
      )}

      {/* ── Social links ─────────────────────────────────────────────────── */}
      {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) && (
        <div className="flex flex-wrap gap-3">
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Globe className="h-4 w-4" /> LinkedIn
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Globe className="h-4 w-4" /> GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {profile.portfolioUrl && (
            <a href={profile.portfolioUrl} target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Globe className="h-4 w-4" /> Portfolio
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      <Separator />

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          ['Events Organised', profile.stats?.eventsOrganized ?? 0, '🎪'],
          ['Clubs Joined',     profile.stats?.clubsJoined     ?? 0, '🏛️'],
          ['Roles Held',       profile.stats?.rolesHeld       ?? 0, '🎯'],
        ].map(([label, value, icon]) => (
          <div key={label} className="rounded-lg border bg-card p-4 text-center">
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Badges ───────────────────────────────────────────────────────── */}
      {profile.badges?.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Achievements</h2>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map(b => (
              <div
                key={b.code}
                className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm"
                title={b.awardedAt ? `Earned ${formatDate(b.awardedAt)}` : ''}
              >
                <span>{BADGE_ICON[b.code] || '🏅'}</span>
                <span className="font-medium text-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Current roles ────────────────────────────────────────────────── */}
      {profile.currentRoles?.filter(r => r.status === 'ACTIVE').length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Current Roles</h2>
          <div className="rounded-lg border bg-card overflow-hidden">
            {profile.currentRoles
              .filter(r => r.status === 'ACTIVE')
              .map((r, i) => (
                <div
                  key={r._id || i}
                  className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {r.displayRoleName || r.canonicalRole?.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.scopeName}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {r.sessionId}
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Active memberships ────────────────────────────────────────────── */}
      {profile.memberships?.filter(m => m.status === 'ACTIVE').length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">My Clubs</h2>
          <div className="flex flex-wrap gap-2">
            {profile.memberships
              .filter(m => m.status === 'ACTIVE')
              .map(m => (
                <Link key={m.clubId} to={`/clubs/${m.clubId}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted text-sm py-1">
                    {m.clubName || m.clubId}
                  </Badge>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* ── Recent events ─────────────────────────────────────────────────── */}
      {profile.recentEvents?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Events I Organised</h2>
            <Link to="/events">
              <span className="text-xs text-muted-foreground hover:underline">
                View all →
              </span>
            </Link>
          </div>
          <div className="space-y-2">
            {profile.recentEvents.map(e => (
              <Link
                key={e._id}
                to={`/events/${e._id}`}
                className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.startDate ? formatDate(e.startDate) : ''}
                    {e.category && ` · ${e.category.replace(/_/g, ' ')}`}
                  </p>
                </div>
                <StatusBadge status={e.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Activity feed ─────────────────────────────────────────────────── */}
      {profile.activityFeed?.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Recent Activity</h2>
          <div className="rounded-lg border bg-card divide-y overflow-hidden">
            {profile.activityFeed
              .slice()
              .reverse()
              .slice(0, 10)
              .map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <span className="text-base shrink-0 mt-0.5">
                    {ACTIVITY_ICON[item.type] || '📌'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.timestamp ? timeAgo(item.timestamp) : ''}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Leaderboard score (if leaderboard-service is running) ─────────── */}
      {profile.leaderboard && (
        <div className="rounded-lg border bg-card p-5 space-y-2">
          <h2 className="font-semibold text-foreground">Leaderboard</h2>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {profile.leaderboard.xp ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                #{profile.leaderboard.rank ?? '—'}
              </p>
              <p className="text-xs text-muted-foreground">
                of {profile.leaderboard.totalUsers ?? '?'}
              </p>
            </div>
            {profile.leaderboard.level && (
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {profile.leaderboard.level}
                </p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit dialog */}
      <EditProfileDialog
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  )
}
