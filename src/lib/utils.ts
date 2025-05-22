import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function generateThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }

    video.onseeked = () => {
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg'))
      } else {
        reject(new Error('Failed to get canvas context'))
      }
    }

    video.onerror = () => {
      reject(new Error('Failed to load video'))
    }

    video.src = URL.createObjectURL(videoFile)
    // Seek to 25% of the video duration for the thumbnail
    video.currentTime = 1
  })
}

export function isValidVideoFile(file: File) {
  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
  return validTypes.includes(file.type)
}
