import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Protect all routes that start with /api/upload
      if (req.nextUrl.pathname.startsWith("/api/upload")) {
        return !!token
      }

      // Allow all other routes
      return true
    },
  },
})

export const config = {
  matcher: [
    "/api/upload/:path*",
    "/uploads",
  ],
}
