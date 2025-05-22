"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] space-y-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Something went wrong!</h1>
          <p className="text-muted-foreground">
            An error occurred while processing your request.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm overflow-auto max-w-2xl">
              {error.message}
            </pre>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
