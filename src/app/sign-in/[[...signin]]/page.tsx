"use client";  
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <SignIn signUpForceRedirectUrl={"/dashboard"}/>
    </div>
  )
}