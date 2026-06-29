import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Apple from "next-auth/providers/apple";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Google({}),
    GitHub({}),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    }),
  ],
} satisfies NextAuthConfig;
