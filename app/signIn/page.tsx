import type { NextPage } from "next"
import SignInButton from "./sign-in-button"
import { getServerAuthSession } from "@/lib/server/auth"
import { redirect } from "next/navigation"
import SignInAuto from "./sign-in-auto"

export const dynamic = "force-dynamic"

const SignInPage = async ({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) => {
  const callbackUrl = (searchParams?.callbackUrl as string) ?? "/"

  const session = await getServerAuthSession()
  if (session) {
    console.log("Session found, redirecting to callback URL")
    redirect(callbackUrl)
  }

  const error = searchParams?.error as string
  if (!error) {
    // perform silent sign-in
    return <SignInAuto />
  }

  // when we receive an error on the silent login, show the sign-in button
  return (
    <section className="flex h-screen w-screen bg-white">
      <div className="relative hidden md:block md:w-1/2">
        <img
          src="/euricom-office.webp"
          alt="Euricom office"
          className="h-full w-full object-cover"
        />
        <p className="absolute left-1/2 top-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 bg-accentEuricom-400 bg-opacity-40 p-3 text-center text-3xl text-white">
          Euri-gpt
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <img src="/euricom_logo.png" alt="Euricom" width={160} />
          <SignInButton />
        </div>
      </div>
    </section>
  )
}

export default SignInPage
