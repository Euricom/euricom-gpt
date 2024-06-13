import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request })
  console.log(token?.accessToken)

  const profilePic = await fetch(
    "https://graph.microsoft.com/v1.0/me/photo/$value",
    {
      headers: {
        Authorization: "Bearer " + token?.accessToken
      }
    }
  )
  console.log(profilePic)
  return new Response(JSON.stringify({ profilePic }), {
    status: 200
  })
}
