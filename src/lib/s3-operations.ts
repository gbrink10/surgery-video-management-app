import { 
  PutObjectCommand, 
  GetObjectCommand, 
  ListObjectsV2Command,
  DeleteObjectCommand 
} from "@aws-sdk/client-s3"
import { s3Client, BUCKET_NAME } from "./s3-config"

export async function uploadVideo(file: File) {
  const key = `videos/${Date.now()}-${file.name}`
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: file.type,
  })

  try {
    await s3Client.send(command)
    return {
      success: true,
      key,
      url: `https://s3.eu-west-1.amazonaws.com/${BUCKET_NAME}/${key}`
    }
  } catch (error) {
    console.error("Error uploading video:", error)
    return {
      success: false,
      error: "Failed to upload video"
    }
  }
}

export async function listVideos() {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: "videos/",
  })

  try {
    const response = await s3Client.send(command)
    return {
      success: true,
      videos: response.Contents?.map(item => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        url: `https://s3.eu-west-1.amazonaws.com/${BUCKET_NAME}/${item.Key}`
      })) || []
    }
  } catch (error) {
    console.error("Error listing videos:", error)
    return {
      success: false,
      error: "Failed to list videos"
    }
  }
}

export async function deleteVideo(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  try {
    await s3Client.send(command)
    return {
      success: true
    }
  } catch (error) {
    console.error("Error deleting video:", error)
    return {
      success: false,
      error: "Failed to delete video"
    }
  }
}

export async function getVideoUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  try {
    const url = await s3Client.send(command)
    return {
      success: true,
      url
    }
  } catch (error) {
    console.error("Error getting video URL:", error)
    return {
      success: false,
      error: "Failed to get video URL"
    }
  }
}
