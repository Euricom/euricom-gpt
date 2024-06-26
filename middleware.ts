// import { createClient } from "@/lib/supabase/middleware"
// import { i18nRouter } from "next-i18n-router"
// import { NextResponse, type NextRequest } from "next/server"
// import i18nConfig from "./i18nConfig"
// import { useContext } from "react"
// import { ChatbotUIContext } from "./context/context"

// export async function middleware(request: NextRequest) {
//   const i18nResult = i18nRouter(request, i18nConfig)
//   if (i18nResult) return i18nResult

//   try {
//     const { supabase, response } = createClient(request)

//     const session = await supabase.auth.getSession()

//     const redirectToChat = session && request.nextUrl.pathname === "/"

//     //Changes Euricom to adapt Azure (use azure user instead of supabase user)
//     const { user } = useContext(ChatbotUIContext)

//     if (redirectToChat && user) {
//       const { data: homeWorkspace, error } = await supabase
//         .from("workspaces")
//         .select("*")
//         .eq("user_id", user.id)
//         .eq("is_home", true)
//         .single()

//       if (!homeWorkspace) {
//         throw new Error(error?.message)
//       }

//       return NextResponse.redirect(
//         new URL(`/${homeWorkspace.id}/chat`, request.url)
//       )
//     }

//     return response
//   } catch (e) {
//     return NextResponse.next({
//       request: {
//         headers: request.headers
//       }
//     })
//   }
// }

// export const config = {
//   matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
// }

import { withAuthentication, chain } from "./lib/middlewares"

export default chain([
  // withI18n,
  withAuthentication({
    publicRoutes: ["/help"]
  })
])

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - public static files *.*
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     */
    "/((?!api|.*\\..*|_next/static|_next/image|favicon.ico|robots.txt).*)"
  ]
}
