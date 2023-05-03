import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import NextAuth from "next-auth/next";
import NextAuth, { AuthOptions, User } from "next-auth";
import prisma from "@/libs/prismadb"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET

export const authOptoins: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                console.log("credentials [...nextauth.ts] => ", credentials);
                if (!credentials?.email || !credentials.password) {
                    throw new Error("invalid credentials")
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user?.hashedPassword) {
                    throw new Error("invalid credentials")
                }

                const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
                if (!isCorrectPassword) {
                    throw new Error("invalid credentials")
                }

                return user;
            },
        })
    ],
    pages: {
        signIn: "/",
        // signIn: "/auth/signin",
        // signOut: "/auth/signout",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
    },
}


export default NextAuth(authOptoins)