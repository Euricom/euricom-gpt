// "use client"

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
//         href="/loginEuricom"
//       >
//         Start Chatting
//         <IconArrowRight className="ml-1" size={20} />
//       </Link>
//     </div>
//   )
// }
import SignInButton from "./sign-in-button"

export default async function Login({
  searchParams
}: {
  searchParams: { message: string }
}) {
  return (
    <section className="flex h-screen w-screen bg-white">
      <div className="relative hidden md:block md:w-1/2">
        <img
          src="/euricom-office.webp"
          alt="Euricom office"
          className="h-full w-full object-cover"
        />
        <p className="absolute left-1/2 top-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 bg-accentEuricom-400 bg-opacity-40 p-3 text-center text-3xl text-white">
          Euri-gpt
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <img src="/euricom_logo.png" alt="Euricom" width={160} />
          <SignInButton />
        </div>
      </div>
    </section>
  )
}
