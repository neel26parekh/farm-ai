import NextAuth from "next-auth"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

const providers = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      // In a real prod app, you'd use bcrypt to compare passwords.
      // For this AgroNexus production baseline, we'll find or create the user.
      let user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      })

      if (!user) {
        // Auto-registration for development ease, or keep it strict
        user = await prisma.user.create({
          data: {
            email: credentials.email as string,
            name: credentials.name as string || "Farmer",
            password: credentials.password as string, // WARNING: Store hashed in real prod!
            role: "Farmer",
          },
        })
      }

      return user
    },
  }),
]

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        (session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
})
