"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

const SignInAuto = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    handleSignIn()
  }, [])

  const handleSignIn = async () => {
    await signIn(
      "azure-ad",
      {
        redirect: true,
        callbackUrl: searchParams.get("callbackUrl") || "/"
      },
      {
        prompt: "none"
      }
    )
  }

  return <div />
}

export default SignInAuto
