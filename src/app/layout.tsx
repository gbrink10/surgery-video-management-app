import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ToastProvider } from "@/components/toast-provider"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Surgery App",
  description: "A modern platform for surgical video management and training",
  keywords: ["surgery", "medical", "training", "videos", "education", "VR", "Oculus"],
  authors: [{ name: "Surgery App Team" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider />
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
