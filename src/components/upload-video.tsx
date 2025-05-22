"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X } from "lucide-react"
import { uploadVideo } from "@/lib/s3-operations"

export function UploadVideo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 500)

      const result = await uploadVideo(selectedFile)

      clearInterval(interval)
      setUploadProgress(100)

      if (result.success) {
        // Handle successful upload
        console.log("Video uploaded successfully:", result.url)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      // Handle error (show toast notification, etc.)
    } finally {
      setUploading(false)
      setSelectedFile(null)
      setUploadProgress(0)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="video-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              MP4, WebM, or MOV (MAX. 2GB)
            </p>
          </div>
          <input
            id="video-upload"
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
          <span className="text-sm truncate">{selectedFile.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedFile(null)}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-center text-gray-500">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </Button>
    </div>
  )
}
