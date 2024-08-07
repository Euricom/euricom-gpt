import { Toaster } from "@/components/ui/sonner"
import { GlobalState } from "@/components/utility/global-state"
import { Providers } from "@/components/utility/providers"
import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ReactNode } from "react"
import "./globals.css"
import { getServerUser } from "@/lib/server/auth"

const inter = Inter({ subsets: ["latin"] })
const APP_NAME = "Euri Chatbot"
const APP_DEFAULT_TITLE = "Euri Chatbot"
const APP_TITLE_TEMPLATE = "%s - Euri Chatbot"
const APP_DESCRIPTION =
  "Euri ChatBot is our advanced chatbot supporting all OpenAI models and is well-versed in Euricom policies, providing comprehensive assistance and information"

interface RootLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: APP_DEFAULT_TITLE
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
}

export const viewport: Viewport = {
  themeColor: "#000000"
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getServerUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers attribute="class" defaultTheme="dark">
          <Toaster richColors position="top-center" duration={3000} />
          <div className="bg-background text-foreground flex h-dvh flex-col items-center overflow-x-auto">
            <GlobalState user={user}>{children}</GlobalState>
          </div>
        </Providers>
      </body>
    </html>
  )
}
