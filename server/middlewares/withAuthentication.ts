import { getToken } from "next-auth/jwt"
import { NextFetchEvent, NextRequest } from "next/server"
import { MiddlewareFactory } from "./types"
import { RouteMatcherParam, createRouteMatcher, redirectTo } from "../route"

export type WithAuthenticationConfig = {
  /**
   * Public routes that don't require authentication
   * Examples:
   * - '/theme'
   * - (req: NextRequest) => req.nextUrl.pathname.startsWith('/theme')
   * - /my-path/(.*)
   * - ((?!^/admin/).*)
   * - /:locale/sign-in
   */
  publicRoutes: RouteMatcherParam
  signIn?: string
}

const withDefaultPublicRoutes = (
  publicRoutes: RouteMatcherParam | undefined,
  signInPage: string
) => {
  const routes = [publicRoutes || ""].flat().filter(Boolean)
  routes.push(signInPage)
  //
  // add here other public routes
  //
  return routes as RouteMatcherParam
}

export const withAuthentication =
  (config: WithAuthenticationConfig): MiddlewareFactory =>
  next => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
      const signInPage = config.signIn || "/signIn"

      console.log("Checking authentication", signInPage, request.url)

      // for public routes, we don't need to check for authentication
      const isPublicRoute = createRouteMatcher(
        withDefaultPublicRoutes(config.publicRoutes, signInPage)
      )
      if (isPublicRoute(request)) {
        return next(request, _next)
      }

      // When we are not authenticated, we redirect to the sign-in page
      const { nextUrl } = request
      const { pathname } = nextUrl
      const token = await getToken({ req: request })

      if (!token && !pathname.includes(signInPage)) {
        if (pathname === "/") {
          return redirectTo(`${signInPage}`, request.nextUrl.origin)
        }
        // add callbackUrl to the sign-in page, so we can return to it after the login process
        return redirectTo(
          `${signInPage}?callbackUrl=${request.url}`,
          request.nextUrl.origin
        )
      }

      // All good (authenticated)
      console.log("Authenticated", token?.email)
      return next(request, _next)
    }
  }
