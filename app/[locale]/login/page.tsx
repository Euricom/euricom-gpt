import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { SubmitButton } from "@/components/ui/submit-button"
import { createProfile } from "@/db/profile"
import { createWorkspace } from "@/db/workspaces"
import { createClient } from "@/lib/supabase/server"
import { User, getServerUser } from "@/server/auth"
import { Database, TablesInsert } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { IconArrowRight } from "@tabler/icons-react"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
// import { RedirectType, redirect } from "next/navigation"
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

  console.log("voor de login")

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "kobe.dehandschutter@euri.com",
    password: "18d332af-2d5b-49e5-8c42-9168b3910f97"
  })

  console.log(data)
  console.log(error)
  console.log("na de login")

  // if (error) {
  //   return redirect(`/login?message=${error.message}`)
  // }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!profile) {
    if (!profile) {
      const newProfile: TablesInsert<"profiles"> = {
        user_id: user.id,
        username: user.name,
        display_name: user.name,
        bio: "",
        image_path: "",
        image_url: "",
        profile_context: "",
        use_azure_openai: false,
        has_onboarded: true
      }

      await createProfile(newProfile)

      const newHomeWorkspace: TablesInsert<"workspaces"> = {
        default_context_length: 4096,
        default_model: "gpt-4-turbo-preview",
        default_prompt: "You are a friendly, helpful AI assistant.",
        default_temperature: 0.5,
        description: "My home workspace.",
        embeddings_provider: "openai",
        include_profile_context: true,
        include_workspace_instructions: true,
        instructions: "",
        name: "Home",
        user_id: user.id,
        is_home: true
      }

      await createWorkspace(newHomeWorkspace)
    }
  }

  const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_home", true)
    .single()

  // if (errorLogin) {
  //   return redirect(`/login?message=${errorLogin.message}`)
  // }

  // if (user) {
  //   const { data: homeWorkspace, error } = await supabase
  //     .from("workspaces")
  //     .select("*")
  //     .eq("user_id", user.id)
  //     .eq("is_home", true)
  //     .single()

  if (!homeWorkspace) {
    throw new Error(homeWorkspaceError?.message)
    // return redirect("/setup")
  }
  console.log("voor de redirect")

  return redirect(`/${homeWorkspace.id}/chat`)
  // }

  // const { data: exists, error } = await supabase.rpc("check_user_exists", {
  //   email_to_check: user.email
  // })
  // if (error) {
  //   console.error("Error checking user existence", error)
  // }

  // const signIn = async () => {
  //   "use server"

  //   const email = user.email as string
  //   const password = user.id as string
  //   const cookieStore = cookies()
  //   const supabase = createClient(cookieStore)

  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password
  //   })

  //   if (error) {
  //     return redirect(`/login?message=${error.message}`)
  //   }
  //   let session = (await supabase.auth.getSession()).data.session

  //   const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
  //     .from("workspaces")
  //     .select("*")
  //     .eq("user_id", "18d332af-2d5b-49e5-8c42-9168b3910f97")
  //     .eq("is_home", true)
  //     .single()

  // if (!homeWorkspace) {
  //   throw new Error(
  //     homeWorkspaceError?.message || "An unexpected error occurred"
  //   )
  // }

  // return redirect(`/${homeWorkspace.id}/chat`)
  // }

  // const getEnvVarOrEdgeConfigValue = async (name: string) => {
  //   "use server"
  //   if (process.env.EDGE_CONFIG) {
  //     return await get<string>(name)
  //   }

  //   return process.env[name]
  // }

  // const signUp = async () => {
  //   "use server"

  //   const cookieStore = cookies()
  //   const supabasehier = createClient(cookieStore)

  //   // const { data: homeWorkspace1, error1 } = await supabase
  //   //   .from("workspaces")
  //   //   .select("*")
  //   //   .eq("user_id", user.id)
  //   //   .eq("is_home", true)
  //   //   .single()

  //   const { data, error: errorLogin } =
  //     await supabasehier.auth.signInWithPassword({
  //       email: "kobe.dehandschutter@euri.com",
  //       password: "18d332af-2d5b-49e5-8c42-9168b3910f97"
  //     })

  //   const { data: homeWorkspace, error } = await supabasehier
  //     .from("workspaces")
  //     .select("*")
  //     .eq("user_id", user.id)
  //     .eq("is_home", true)
  //     .single()
  // }

  //   const email = user.email as string
  //   const password = user.id as string

  //   const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
  //     "EMAIL_DOMAIN_WHITELIST"
  //   )
  //   const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
  //     ? emailDomainWhitelistPatternsString?.split(",")
  //     : []
  //   const emailWhitelistPatternsString =
  //     await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
  //   const emailWhitelist = emailWhitelistPatternsString?.trim()
  //     ? emailWhitelistPatternsString?.split(",")
  //     : []

  //   // If there are whitelist patterns, check if the email is allowed to sign up
  //   if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
  //     const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1])
  //     const emailMatch = emailWhitelist?.includes(email)
  //     if (!domainMatch && !emailMatch) {
  //       return redirect(
  //         `/login?message=Email ${email} is not allowed to sign up.`
  //       )
  //     }
  //   }

  //   const cookieStore = cookies()
  //   const supabase = createClient(cookieStore)

  //   const { error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
  //       // emailRedirectTo: `${origin}/auth/callback`
  //     }
  //   })

  //   if (error) {
  //     console.error(error)
  //     return redirect(`/login?message=${error.message}`)
  //   }

  //   return redirect("/setup")

  //   // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
  //   // return redirect("/login?message=Check email to continue sign in process")
  // }

  // signIn()

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <ChatbotUISVG theme={"dark"} scale={0.3} />
      </div>

      <div className="mt-2 text-4xl font-bold">Chatbot UI</div>
      {/* <form className="" action={signIn}>
        <SubmitButton className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold">
          Start chatting
          <IconArrowRight className="ml-1" size={20} />
        </SubmitButton>
      </form> */}
    </div>
  )
}
