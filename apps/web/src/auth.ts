import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google,
    GitHub,
  ],
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
})
