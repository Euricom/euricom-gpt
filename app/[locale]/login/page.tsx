import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { SubmitButton } from "@/components/ui/submit-button"
import { createClient } from "@/lib/supabase/server"
import { User, getServerUser } from "@/server/auth"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { IconArrowRight } from "@tabler/icons-react"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login"
}

export default async function Login({
  searchParams
}: {
  searchParams: { message: string }
}) {
  const user = await getServerUser()

  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const session = (await supabase.auth.getSession()).data.session

  if (session) {
    const { data: homeWorkspace, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", "b34602d1-dc6d-449d-a367-e94efa035baf")
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      throw new Error(error?.message)
    }

    return redirect(`/${homeWorkspace.id}/chat`)
  }
  const { data: exists, error } = await supabase.rpc("check_user_exists", {
    email_to_check: user.email
  })
  if (error) {
    console.error("Error checking user existence", error)
  }

  const signIn = async () => {
    "use server"

    const email = user.email as string
    const password = user.id as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password
    // })

    // if (error) {
    //   return redirect(`/login?message=${error.message}`)
    // }
    // let session = (await supabase.auth.getSession()).data.session

    // console.log(session)

    const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", "b34602d1-dc6d-449d-a367-e94efa035baf")
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      throw new Error(
        homeWorkspaceError?.message || "An unexpected error occurred"
      )
    }

    return redirect(`/${homeWorkspace.id}/chat`)
  }

  const getEnvVarOrEdgeConfigValue = async (name: string) => {
    "use server"
    if (process.env.EDGE_CONFIG) {
      return await get<string>(name)
    }

    return process.env[name]
  }

  const signUp = async () => {
    "use server"

    const email = user.email as string
    const password = user.id as string

    const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
      "EMAIL_DOMAIN_WHITELIST"
    )
    const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
      ? emailDomainWhitelistPatternsString?.split(",")
      : []
    const emailWhitelistPatternsString =
      await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
    const emailWhitelist = emailWhitelistPatternsString?.trim()
      ? emailWhitelistPatternsString?.split(",")
      : []

    // If there are whitelist patterns, check if the email is allowed to sign up
    if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
      const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1])
      const emailMatch = emailWhitelist?.includes(email)
      if (!domainMatch && !emailMatch) {
        return redirect(
          `/login?message=Email ${email} is not allowed to sign up.`
        )
      }
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
        // emailRedirectTo: `${origin}/auth/callback`
      }
    })

    if (error) {
      console.error(error)
      return redirect(`/login?message=${error.message}`)
    }

    return redirect("/setup")

    // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
    // return redirect("/login?message=Check email to continue sign in process")
  }

  signIn()

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <ChatbotUISVG theme={"dark"} scale={0.3} />
      </div>

      <div className="mt-2 text-4xl font-bold">Chatbot UI</div>
      <form className="" action={exists ? signIn : signUp}>
        <SubmitButton className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold">
          Start chatting
          <IconArrowRight className="ml-1" size={20} />
        </SubmitButton>
      </form>
    </div>
  )
}
