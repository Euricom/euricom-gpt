"use client"

import Link from "next/link"
import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <div
      className="flex cursor-pointer flex-col items-center"
      //Changes Euricom to adapt Azure (remove Link so icon doesn't redirect)
      // href="https://www.chatbotui.com"
      // target="_blank"
      // rel="noopener noreferrer"
    >
      <div className="mb-2">
        <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
      </div>

      <div className="text-4xl font-bold tracking-wide">Chatbot UI</div>
    </div>
  )
}
