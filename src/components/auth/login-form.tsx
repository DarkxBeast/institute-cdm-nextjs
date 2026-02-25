"use client"

import { useSearchParams } from "next/navigation"
import { login } from "@/app/login/actions"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Invalid email or password. Please try again.',
  session_expired: 'Your session has expired. Please login again.',
  unauthorized: 'You are not authorized to access this resource.',
  service_unavailable: 'Login service is temporarily unreachable. Please try again in a moment.',
  auth_unavailable: 'Unable to complete login right now.\nPlease try again.',
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error')
  const errorMessage = ERROR_MESSAGES[errorCode ?? '']

  return (
    <form className={cn("flex flex-col gap-6", className)} action={login} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {errorMessage && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center whitespace-pre-line">
            {errorMessage}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
          </div>
        </Field>
        <Field>
          <SubmitButton />
        </Field>
      </FieldGroup>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  )
}
