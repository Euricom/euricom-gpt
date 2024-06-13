//Changes Euricom to adapt Azure (Auth server)

import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  Session
} from "next-auth"
import AzureProvider from "next-auth/providers/azure-ad"

import { JWT } from "next-auth/jwt"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next" {
  /**
   * Used with withAuth helper is applied to a NextApiHandler
   */
  interface NextApiRequest {
    nextauth: {
      token: JWT
      session: Session
    }
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    // default
    name?: string | null
    email?: string | null
    picture?: string | null
    sub?: string

    // extended
    accessToken: string
    refreshToken?: string
    expiresAt: number
    roles: string[]
    oid: string
    iat: number
    exp: number
    jti: string
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop
   * on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    tokenExpiresAt: string
    tokenExpiresIn: string
    user: {
      id: string
      name: string
      email: string
      roles: string[]
    }
  }

  /** Azure AD Account */
  interface Account {
    provider: string
    providerAccountId: string
    token_type: "Bearer"
    scope: string
    expires_at: number
    ext_expires_in: number
    access_token: string
    id_token: string
    session_state: string
  }

  /** Azure AD Profile (id_token payload) */
  interface Profile {
    aud: string
    iss: string // https://login.microsoftonline.com/0b53d2c1-bc55-4ab3-a161-927d289257f2/v2.0
    iat: number
    nbf: number
    exp: number
    aio: string
    oid: string
    preferred_username: string
    rh: string
    roles: string[]
    tid: string
    uti: string
    ver: "2.0"
  }
}

type RefreshTokenPayload =
  | {
      token_type: "Bearer"
      scope: string
      expires_in: number
      ext_expires_in: number
      refresh_token: string
      access_token: string
      id_token: string
    }
  | {
      error: string
      error_description: string
      error_codes: number[]
      error_uri: string
    }

export type User = {
  id: string
  name: string
  email: string
  roles: string[]
  isAuthenticated: boolean
}

/*
 * Takes a token, and returns a new token with updated
 * `accessToken` and `expiresAt`.
 */
const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    if (!token.refreshToken) {
      throw new Error("No refresh token available.")
    }

    const response = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.AZURE_AD_CLIENT_ID!,
          client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
          refresh_token: token.refreshToken,
          scope: "openid profile email offline_access"
        }),
        method: "POST"
      }
    )
    const data: RefreshTokenPayload = await response.json()
    if ("error" in data) {
      throw new Error(`Failed to refresh accessToken: ${data.error}`)
    }
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return {
      ...token,
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token
    }
  } catch (error) {
    if (error instanceof Error) {
    }

    // throwing the error will cause the session to be invalidated
    // and the user must re-login
    throw error
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: false,
  pages: {
    // Change the default behavior to use `/login` as the path for the sign-in page
    signIn: "/signIn"
  },
  session: {
    maxAge: 1 * 24 * 60 * 60 // 24h - should be the same as the refresh token lifetime
  },
  // adapter: PrismaAdapter(db),
  providers: [
    AzureProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      // idToken: true,
      checks: ["pkce"], // to prevent CSRF and authorization code injection attacks.
      authorization: {
        params: {
          scope: "openid profile email offline_access"
        }
      }
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    jwt({ token, account, user, profile }) {
      // log.debug('jwt: %o', { token });
      // Initial sign in
      if (profile && account) {
        delete user?.image // lets keep auth cookie small
        const clockSkew = 60 * 10 * 1000 // 10 minutes
        const expiresAt = account.expires_at * 1000 - clockSkew // ms
        return {
          expiresAt,
          oid: profile.oid,
          iat: token.iat,
          exp: token.exp,
          jti: token.jti,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          roles: profile.roles,
          ...user
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.expiresAt) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    session({ session, token }) {
      if (session.user) {
        // get time span until token expires
        const date = new Date(0)
        date.setMilliseconds(token.expiresAt - Date.now())
        const timeSpanUntilExpires = date.toISOString().substring(11, 19)
        const roles = token.roles || []

        // create session object
        session.user.id = token.oid
        session.user.name = token.name || ""
        session.user.email = token.email || ""
        session.user.roles = roles
        session.tokenExpiresAt = new Date(token.expiresAt).toISOString()
        session.tokenExpiresIn = timeSpanUntilExpires

        // console.log('session', session, token);
      }
      return session
    }
  }
}

///////////////
// Some helper functions to work with the session and user object.
///////////////

export type Role = "admin" | "user"

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)

/**
 * Usages:
 * ```
 * const isAdmin = isInRole(user, 'admin');
 * const isAllowed = isInRole(user, ['admin', 'user']);
 * ```
 *
 * @returns true when the user has the given role or one of the roles
 */
export const isInRole = (user: User, role: Role | Role[]) => {
  const userRoles = user?.roles || []
  if (Array.isArray(role)) {
    return role.some(r => userRoles.includes(r))
  }
  return userRoles.includes(role)
}

/**
 * @returns true when the user is authenticated
 */
export const isAuthenticated = (session: Session) => !!session

/**
 * Get a user from the session or return the anonymous user.
 */
export const getServerUser = async () => {
  const session = await getServerSession(authOptions)
  return getUser(session)
}

/**
 * Get a user from the session or return the anonymous user.
 * Simplifies the usage of the user object (never null)
 * @param session
 */
export const getUser = (session: Session | null): User => {
  if (!session?.user) {
    return {
      id: "",
      name: "anonymous",
      email: "",
      roles: [],
      isAuthenticated: false
    }
  }
  return {
    ...session?.user,
    isAuthenticated: !!session?.user.id
  }
}
