"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/app/admin/actions"

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setError(null)
    // On success the action redirects to /admin; it only returns on failure.
    startTransition(async () => {
      const result = await signIn(null, data)
      if (result && !result.ok) setError(result.error)
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="font-bold">
          Email
        </Label>
        <Input id="email" name="email" type="email" autoComplete="username" required className="border-2 border-black" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="font-bold">
          Password
        </Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required className="border-2 border-black" />
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  )
}
