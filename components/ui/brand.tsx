"use client"

import Link from "next/link"
import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  const iconPath =
    theme === "dark" ? "/eurichatbot-dark.png" : "/eurichatbot-light.png"

  return (
    <div
      className="flex cursor-pointer flex-col items-center"
      //Changes Euricom to adapt Azure (remove Link so icon doesn't redirect)
      // href="https://www.chatbotui.com"
      // target="_blank"
      // rel="noopener noreferrer"
    >
      <div className="mb-2">
        <img src={iconPath} className="w-16 h-16 object-cover" />
      </div>

      <div className="text-4xl font-bold tracking-wide">Euri Chatbot</div>
    </div>
  )
}
