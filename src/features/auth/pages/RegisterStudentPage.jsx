import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useRegisterStudent } from '../hooks/useRegister'
import { resendVerificationApi } from '../auth.api'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'

export default function RegisterStudentPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', systemId: ''
  })
  const [done, setDone] = useState(false)
  const [resending, setResending] = useState(false)

  const { mutate: register, isPending, error } = useRegisterStudent()

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    register(form, {
      onSuccess: () => setDone(true),
    })
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerificationApi(form.email)
      toast.success('Verification email resent!')
    } catch {
      toast.error('Failed to resend.')
    } finally {
      setResending(false)
    }
  }

  const errMsg = error?.response?.data?.message || ''

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="text-4xl">✉️</div>
            <h2 className="text-xl font-semibold">Verification email sent</h2>
            <p className="text-muted-foreground text-sm">
              Click the link in the email sent to{' '}
              <span className="font-medium text-foreground">{form.email}</span> to activate your account.
            </p>
            <Button variant="link" onClick={handleResend} disabled={resending}>
              {resending ? 'Sending...' : 'Resend Email'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Student Registration</CardTitle>
          <CardDescription>Use your university email address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={form.lastName} onChange={set('lastName')} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>University Email</Label>
              <Input type="email" value={form.email} onChange={set('email')} required
                placeholder="2100000001.student@ug.sharda.ac.in" />
            </div>

            <div className="space-y-2">
              <Label>Enrollment / System ID</Label>
              <Input value={form.systemId} onChange={set('systemId')} required
                placeholder="2100000001" />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={set('password')} required />
              <p className="text-xs text-muted-foreground">
                Min 8 characters, with uppercase, lowercase, number, and special character
              </p>
            </div>

            {errMsg && <p className="text-sm text-destructive">{errMsg}</p>}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/auth/login" className="underline hover:text-foreground">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}