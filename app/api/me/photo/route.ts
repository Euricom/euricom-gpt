import { getServerUser } from "@/server/auth"
import { api, GraphError } from "@/server/graph/graph"

export async function GET() {
  const user = await getServerUser()
  if (!user.isAuthenticated) {
    return new Response(null, {
      status: 404
    })
  }

  try {
    const photo = await api.getImage(`/users/${user.id}/photo/$value`)
    return new Response(photo, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=604800, stale-while-revalidate=86400"
      }
    })
  } catch (error: any) {
    if (error instanceof GraphError && error.status === 404) {
      // MS graph fails with 404 when userId is invalid/unknown
      // Lets return NotFound instead
      return new Response(null, {
        status: 404
      })
    }

    // something else, rethrow
    return new Response(null, {
      status: 500
    })
  }
}
