"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loading } from "@/components/loading"
import { listVideos, deleteVideo } from "@/lib/s3-operations"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Video {
  key: string
  url: string
  lastModified?: Date
  size?: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
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
        } else {
          setVideos([])
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error)
        toast.error("Failed to load videos")
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchVideos()
    }
  }, [session])

  const handleDeleteVideo = async (key: string) => {
    try {
      const result = await deleteVideo(key)
      if (result.success) {
        setVideos(videos.filter(video => video.key !== key))
        toast.success("Video deleted successfully")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Failed to delete video:", error)
      toast.error("Failed to delete video")
    }
  }

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

  if (status === "loading") {
    return <Loading />
  }

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
              <AvatarFallback>{session.user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{session.user?.name}</CardTitle>
              <CardDescription>{session.user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="videos">
        <TabsList>
          <TabsTrigger value="videos">My Videos</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          {loading ? (
            <Loading text="Loading your videos..." />
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card key={video.key} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Surgical Video</CardTitle>
                    <CardDescription>
                      Uploaded: {formatDate(video.lastModified)}
                      <br />
                      Size: {formatFileSize(video.size)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => window.open(video.url, "_blank")}>
                        View Video
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteVideo(video.key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardDescription>You haven't uploaded any videos yet</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Account settings will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
