"use client"

import { Button } from "@nextui-org/react"
import { signIn, useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"

const SignInButton = () => {
  const searchParams = useSearchParams()
  const handleSignIn = async () => {
    await signIn("azure-ad", {
      redirect: true,
      callbackUrl: searchParams.get("callbackUrl") || "/"
    })
  }

  return (
    <Button color="secondary" onClick={handleSignIn}>
      <img src="./microsoft.svg" alt="microsoft" height={24} width={24} />
      <p className="uppercase">Sign in with microsoft</p>
    </Button>
  )
}

export default SignInButton
