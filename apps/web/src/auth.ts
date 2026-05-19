import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  ...authConfig,
  providers: [
    ...authConfig.providers.filter((p) => p.id !== "credentials"),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await db.user.findUnique({ where: { email } })
          if (!user || !user.passwordHash) return null

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

          if (passwordsMatch) return user
        }

        return null
      },
    }),
  ],
})
