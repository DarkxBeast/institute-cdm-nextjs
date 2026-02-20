import { Suspense } from "react"
import Image from "next/image"
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/login.png"
          alt="The Career Company campus"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="relative mx-auto mb-8 h-60 w-4/5 overflow-hidden rounded-2xl lg:hidden">
              <Image
                src="/images/logo.png"
                alt="The Career Company logo"
                fill
                className="object-contain dark:brightness-[0.2] dark:grayscale"
                priority
              />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
