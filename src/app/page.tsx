"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/video-player"
import { UploadVideo } from "@/components/upload-video"
import { listVideos } from "@/lib/s3-operations"

interface Video {
  key: string
  url: string
  lastModified?: Date
  size?: number
}

export default function Home() {
  const { data: session } = useSession()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const result = await listVideos()
        if (result.success && result.videos) {
          setVideos(result.videos.map(video => ({
            key: video.key || "",
            url: video.url || "",
            lastModified: video.lastModified,
            size: video.size
          })))
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const formatDate = (date?: Date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString()
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Surgery Training Platform</h1>
      
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="uploads">My Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading videos...</div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card key={video.key} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Surgical Video</CardTitle>
                    <CardDescription>
                      Uploaded: {formatDate(video.lastModified)}
                      <br />
                      Size: {formatFileSize(video.size)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setSelectedVideo(video.url)}
                      className="w-full"
                    >
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No videos available
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          <p className="text-center text-muted-foreground">Your favorite videos will appear here</p>
        </TabsContent>

        <TabsContent value="uploads">
          {session ? (
            <div className="max-w-2xl mx-auto">
              <UploadVideo />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Please sign in to upload videos</p>
              <Button>Sign In</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-background rounded-lg overflow-hidden">
            <div className="p-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedVideo(null)}
                className="mb-4"
              >
                Close
              </Button>
              <VideoPlayer src={selectedVideo} onClose={() => setSelectedVideo(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
