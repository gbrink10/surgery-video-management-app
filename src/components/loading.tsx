import { Loader2 } from "lucide-react"

interface LoadingProps {
  text?: string
}

export function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Loading />
    </div>
  )
}
