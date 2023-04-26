import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import NextAuth from "next-auth/next";
import NextAuth, { AuthOptions } from "next-auth";
import prisma from "@/libs/prismadb"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptoins: AuthOptions = {
    adapter: PrismaAdapter(prisma),
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
            // authorize: async function (credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "query" | "headers" | "body" | "method">): Awaitable<User | null> {
            //     throw new Error("Function not implemented.");
            // }
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
    secret: process.env.NEXTAUTH_SECRET as string,
}

export default NextAuth(authOptoins)