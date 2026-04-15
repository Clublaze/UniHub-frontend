import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Choose your registration type</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link to="/auth/register/student">
            <Button className="w-full" variant="default">
              I'm a Student
            </Button>
          </Link>
          <Link to="/auth/register/faculty">
            <Button className="w-full" variant="outline">
              I'm Faculty / Staff
            </Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/auth/login" className="underline hover:text-foreground">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}