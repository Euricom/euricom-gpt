// "use client"

import { cookies, headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getServerUser } from "@/server/auth"
import { createProfile } from "@/db/profile"
import { createWorkspace } from "@/db/workspaces"

//Original code ChatBot UI - 16/05/2024 - d60e1f3ee9d2caf8c9aab659791b841690183b2d
// import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
// import { IconArrowRight } from "@tabler/icons-react"
// import { useTheme } from "next-themes"
// import Link from "next/link"

// export default function HomePage() {
//   const { theme } = useTheme()

//   return (
//     <div className="flex size-full flex-col items-center justify-center">
//       <div>
//         <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
//       </div>

//       <div className="mt-2 text-4xl font-bold">Chatbot UI</div>

//       <Link
//         className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
//         href="/login"
//       >
//         Start Chatting
//         <IconArrowRight className="ml-1" size={20} />
//       </Link>
//     </div>
//   )
// }

//Changes Euricom to adapt Azure (Azure login)

export default async function HomePage({
  searchParams
}: {
  searchParams: { message: string }
}) {
  console.log("HOME PAGE")
  const user = await getServerUser()

  // login to supabase (user/passw)
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
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
    .eq("user_id", user.id)
    .single()

  // return <p>Home Page</p>

  if (!profile) {
    console.log("User does not have a profile")
    // return <p>Home Page</p>
    // throw new Error("User does not have a profile")

    console.log("Create profile")
    await createProfile({
      user_id: user.id,
      username: user.name,
      display_name: user.name,
      bio: "",
      image_path: "",
      image_url: "",
      profile_context: "",
      use_azure_openai: false,
      has_onboarded: true
    })

    console.log("Create workspace")
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
      user_id: user.id,
      is_home: true
    })

    console.log("Done")
  }

  // return <p>Home Page</p>

  // get home workspace for current AD user
  const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", user.id) // supabase user
    .eq("is_home", true)
    .single()

  if (!homeWorkspace) {
    console.log("User does not have a home workspace")
    throw new Error(homeWorkspaceError?.message)
  }
  console.log("homeWorkspace", homeWorkspace)

  return redirect(`/${homeWorkspace.id}/chat`)

  return <p>Home Page</p>

  // return (
  //   <section className="flex h-screen w-screen bg-white">
  //     <div className="relative hidden md:block md:w-1/2">
  //       <img
  //         src="/euricom-office.webp"
  //         alt="Euricom office"
  //         className="h-full w-full object-cover"
  //       />
  //       <p className="absolute left-1/2 top-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 bg-accentEuricom-400 bg-opacity-40 p-3 text-center text-3xl text-white">
  //         Euri-gpt
  //       </p>
  //     </div>
  //     <div className="flex flex-1 items-center justify-center">
  //       <div className="flex flex-col items-center justify-center gap-4 text-center">
  //         <img src="/euricom_logo.png" alt="Euricom" width={160} />
  //         <SignInButton />
  //       </div>
  //     </div>
  //   </section>
  // )
}
