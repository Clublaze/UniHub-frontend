import { useState } from 'react'
import { toast } from 'sonner'
import authClient from '../../../services/authClient'
import useAuthStore from '../../../store/authStore'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Separator } from '../../../components/ui/separator'
import { bannerClass } from '../../../styles/theme'

export default function SettingsPage() {
  const user    = useAuthStore(s => s.user)
  const logout  = useAuthStore(s => s.logout)

  const [form, setForm]     = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSaving(true)
    try {
      await authClient.patch('/api/auth/users/me/password', {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      })
      toast.success('Password changed! Please log in again.')
      // Force re-login after password change
      setTimeout(() => {
        logout()
        window.location.href = '/auth/login'
      }, 1500)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to change password. Check your current password.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Account info — read-only */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Account Information</h2>
        <Separator />
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Display Name</span>
            <span className="text-foreground font-medium">
              {user?.displayName ||
                `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Account Type</span>
            <span className="text-foreground">{user?.userType}</span>
          </div>
          {user?.systemId && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">System ID</span>
              <span className="text-foreground">{user.systemId}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          To update your name or email, contact your university administrator.
        </p>
      </div>

      {/* Change password */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Change Password</h2>
        <Separator />

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={form.currentPassword}
              onChange={set('currentPassword')}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>New Password</Label>
            <Input
              type="password"
              value={form.newPassword}
              onChange={set('newPassword')}
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters.
            </p>
          </div>
          <div className="space-y-1">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              required
            />
          </div>

          {error && (
            <div className={`rounded-md p-3 text-sm ${bannerClass.error}`}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}