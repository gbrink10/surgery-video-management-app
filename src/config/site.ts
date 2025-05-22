export const siteConfig = {
  name: "Surgery App",
  description: "A modern platform for surgical video management and training",
  url: process.env.NEXTAUTH_URL || "http://localhost:8000",
  links: {
    github: "https://github.com/gbrink10/SurgeryApp",
  },
  videoConfig: {
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB in bytes
    allowedTypes: ["video/mp4", "video/webm", "video/quicktime"],
    maxDuration: 3600, // 1 hour in seconds
  },
  features: {
    authentication: true,
    videoUpload: true,
    videoPlayback: true,
    favorites: true,
    passthrough: true,
  },
  aws: {
    region: process.env.AWS_REGION || "us-east-1",
    bucketName: process.env.AWS_S3_BUCKET_NAME || "surgery-app-videos",
  },
  theme: {
    defaultTheme: "system" as const,
    light: {
      background: "white",
      text: "black",
    },
    dark: {
      background: "black",
      text: "white",
    },
  },
  metadata: {
    keywords: [
      "surgery",
      "medical",
      "training",
      "videos",
      "education",
      "VR",
      "Oculus",
      "passthrough",
    ],
    authors: [
      {
        name: "Surgery App Team",
      },
    ],
  },
}

export type SiteConfig = typeof siteConfig
