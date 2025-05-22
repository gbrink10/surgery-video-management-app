import { S3Client } from "@aws-sdk/client-s3"

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials are not properly configured")
}

export const s3Client = new S3Client({
  region: "eu-west-1", // Explicitly set to eu-west-1 as per your configuration
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true // Enable path-style addressing
})

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "surgery-app-videos"
