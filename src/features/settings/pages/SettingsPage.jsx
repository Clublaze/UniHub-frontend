import { useState } from 'react'
import { toast } from 'sonner'
import {
  useSettings,
  useUpdateNotifications,
  useUpdatePrivacy,
  useChangePassword,
} from '../hooks/useSettings'
import Loader from '../../../components/shared/Loader'
import { Button }    from '../../../components/ui/button'
import { Input }     from '../../../components/ui/input'
import { Label }     from '../../../components/ui/label'
import { Switch }    from '../../../components/ui/switch'
import { Separator } from '../../../components/ui/separator'
import { bannerClass } from '../../../styles/theme'
import useAuthStore from '../../../store/authStore'

// ── Notification setting row ─────────────────────────────────────────────────
function NotifToggle({ label, desc, fieldKey, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch
        checked={Boolean(value)}
        onCheckedChange={(checked) => onChange(fieldKey, checked)}
      />
    </div>
  )
}

// ── Privacy setting row ──────────────────────────────────────────────────────
function PrivacyToggle({ label, desc, fieldKey, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch
        checked={Boolean(value)}
        onCheckedChange={(checked) => onChange(fieldKey, checked)}
      />
    </div>
  )
}

export default function SettingsPage() {
  const user   = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)

  const { data: settings, isLoading } = useSettings()

  const { mutate: updateNotif,  isPending: savingNotif  } = useUpdateNotifications()
  const { mutate: updatePrivacy, isPending: savingPriv  } = useUpdatePrivacy()
  const { mutate: changePass,    isPending: changingPass } = useChangePassword()

  // Password form
  const [pwForm, setPwForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  })
  const [pwError, setPwError] = useState('')

  const handleNotifChange = (field, value) => {
    updateNotif({ [field]: value })
  }

  const handlePrivacyChange = (field, value) => {
    updatePrivacy({ [field]: value })
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPwError('')

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }

    changePass(
      { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
      {
        onSuccess: () => {
          toast.success('Password changed! Logging you out...')
          setTimeout(() => {
            logout()
            window.location.href = '/auth/login'
          }, 1500)
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || ''
          // Backend currently returns 503 for this endpoint
          if (err?.response?.status === 503) {
            setPwError('Password change is not available yet. Use the forgot password flow instead.')
          } else {
            setPwError(msg || 'Failed to change password. Check your current password.')
          }
        },
      }
    )
  }

  const displayName = user?.displayName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim()

  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* ── Account info — read-only ───────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Account Information</h2>
        <Separator />
        <div className="space-y-3 text-sm">
          {[
            ['Display Name', displayName || '—'],
            ['Email',        user?.email],
            ['Account Type', user?.userType?.replace(/_/g, ' ')],
            ...(user?.systemId ? [['System ID', user.systemId]] : []),
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="text-foreground font-medium text-right">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          To update your name or bio, visit your{' '}
          <a href="/profile" className="text-primary hover:underline">Profile page</a>.
          To change email, contact your administrator.
        </p>
      </div>

      {/* ── Notification preferences ──────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 space-y-2">
        <h2 className="text-base font-semibold text-foreground">Email Notifications</h2>
        <p className="text-xs text-muted-foreground">
          Control which events trigger email notifications to you.
        </p>
        <Separator className="mt-3" />

        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <div className="divide-y">
            <NotifToggle
              label="Role Assigned"
              desc="When you are given a new club role"
              fieldKey="emailOnRoleAssigned"
              value={settings?.notifications?.emailOnRoleAssigned ?? true}
              onChange={handleNotifChange}
            />
            <NotifToggle
              label="Event Approved"
              desc="When your submitted event is approved"
              fieldKey="emailOnEventApproved"
              value={settings?.notifications?.emailOnEventApproved ?? true}
              onChange={handleNotifChange}
            />
            <NotifToggle
              label="Event Rejected"
              desc="When your event is rejected by an approver"
              fieldKey="emailOnEventRejected"
              value={settings?.notifications?.emailOnEventRejected ?? true}
              onChange={handleNotifChange}
            />
            <NotifToggle
              label="Step Assigned to Me"
              desc="When an event reaches your step in the approval chain"
              fieldKey="emailOnStepAssigned"
              value={settings?.notifications?.emailOnStepAssigned ?? true}
              onChange={handleNotifChange}
            />
            <NotifToggle
              label="Membership Updates"
              desc="When a membership application is reviewed"
              fieldKey="emailOnMembership"
              value={settings?.notifications?.emailOnMembership ?? true}
              onChange={handleNotifChange}
            />
            <NotifToggle
              label="ECR Reminders"
              desc="Reminder emails when an ECR is overdue"
              fieldKey="emailOnEcrReminder"
              value={settings?.notifications?.emailOnEcrReminder ?? true}
              onChange={handleNotifChange}
            />
          </div>
        )}

        {savingNotif && (
          <p className="text-xs text-muted-foreground animate-pulse">Saving...</p>
        )}
      </div>

      {/* ── Privacy settings ──────────────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 space-y-2">
        <h2 className="text-base font-semibold text-foreground">Privacy</h2>
        <p className="text-xs text-muted-foreground">
          Control what others can see on your public profile.
        </p>
        <Separator className="mt-3" />

        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <div className="divide-y">
            <PrivacyToggle
              label="Public Profile"
              desc="Allow other university members to view your profile"
              fieldKey="showProfile"
              value={settings?.privacy?.showProfile ?? true}
              onChange={handlePrivacyChange}
            />
            <PrivacyToggle
              label="Show Email Address"
              desc="Display your email on your public profile"
              fieldKey="showEmail"
              value={settings?.privacy?.showEmail ?? false}
              onChange={handlePrivacyChange}
            />
            <PrivacyToggle
              label="Show Activity Feed"
              desc="Let others see your recent club and event activity"
              fieldKey="showActivityFeed"
              value={settings?.privacy?.showActivityFeed ?? true}
              onChange={handlePrivacyChange}
            />
          </div>
        )}

        {savingPriv && (
          <p className="text-xs text-muted-foreground animate-pulse">Saving...</p>
        )}
      </div>

      {/* ── Change password ───────────────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Change Password</h2>
        <Separator />

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={pwForm.currentPassword}
              onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>New Password</Label>
            <Input
              type="password"
              value={pwForm.newPassword}
              onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Min 8 characters, with uppercase, lowercase, and number.
            </p>
          </div>
          <div className="space-y-1">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={pwForm.confirmPassword}
              onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
              required
            />
          </div>

          {pwError && (
            <div className={`rounded-md p-3 text-sm ${bannerClass.error}`}>
              {pwError}
            </div>
          )}

          <Button type="submit" disabled={changingPass}>
            {changingPass ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}