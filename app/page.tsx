import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/server/auth"
import { createProfile } from "@/db/profile"
import { createWorkspace } from "@/db/workspaces"

export default async function HomePage() {
  const adUser = await getServerUser()

  // login to supabase (user/passw)
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // const { error: errorSignUp } = await supabase.auth.signUp({
  //   email: process.env.NEXT_PUBLIC_SUPABASE_EMAIL!,
  //   password: process.env.NEXT_PUBLIC_SUPABASE_PASSWORD!
  // })

  // return

  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.NEXT_PUBLIC_SUPABASE_EMAIL!,
    password: process.env.NEXT_PUBLIC_SUPABASE_PASSWORD!
  })
  if (error) {
    return redirect(`/help?message=${error.message}`)
  }

  // make sure the user has a profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", adUser.id)
    .single()

  if (!profile) {
    console.log("User does not have a profile, create it")

    await createProfile({
      user_id: adUser.id,
      username: adUser.name,
      display_name: adUser.name,
      bio: "",
      image_path: "",
      image_url: "",
      profile_context: "",
      use_azure_openai: false,
      has_onboarded: true
    })

    await createWorkspace({
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
      user_id: adUser.id,
      is_home: true
    })
  }

  // get home workspace for current AD user
  const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", adUser.id) // supabase user
    .eq("is_home", true)
    .single()

  if (!homeWorkspace) {
    console.log("User does not have a home workspace")
    throw new Error(homeWorkspaceError?.message)
  }

  return redirect(`/${homeWorkspace.id}/chat`)
}
