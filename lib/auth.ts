import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        Github({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),

        Google({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        })
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "database"
    }
}