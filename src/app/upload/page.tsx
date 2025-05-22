"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadVideo } from "@/components/upload-video"
import { Loading } from "@/components/loading"
import { siteConfig } from "@/config/site"

export default function UploadPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Loading />
  }

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to upload videos</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Surgical Video</CardTitle>
          <CardDescription>
            Share your surgical procedures with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Upload Guidelines</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>Maximum file size: {Math.floor(siteConfig.videoConfig.maxSize / (1024 * 1024 * 1024))}GB</li>
                <li>Supported formats: MP4, WebM, MOV</li>
                <li>Maximum duration: {Math.floor(siteConfig.videoConfig.maxDuration / 3600)} hour</li>
                <li>Ensure proper lighting and stable camera work</li>
                <li>Remove any sensitive or identifying information</li>
                <li>Include relevant procedure details in the title</li>
              </ul>
            </div>
            
            <UploadVideo />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
