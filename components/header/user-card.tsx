import { ChatbotUIContext } from "@/context/context"

import { Avatar, Card, CardHeader } from "@nextui-org/react"
import { useContext } from "react"

export const UserCard = async () => {
  const { user } = useContext(ChatbotUIContext)
  if (!user) {
    return <div></div>
  }

  return (
    <Card shadow="none" className="max-w-[320px]  px-2 py-1 text-inherit">
      <CardHeader className="flex gap-2 border-b-1 border-default-200">
        <Avatar src={`/api/me/photo?v=${user.id}`} size="lg" />
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      </CardHeader>
    </Card>
  )
}
