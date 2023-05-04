import { getServerSession } from "next-auth/next";
import { authOptoins } from "../../pages/api/auth/[...nextauth]";
import prisma from "../libs/prismadb";
import { SafeUser } from "@/types";

export async function getSession() {
    return await getServerSession(authOptoins)
}

export interface IUser {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    hashedPassword: string | null;
    favoritedIds: string[];
}

export default async function getCurrentUser(): Promise<SafeUser | null> {
    try {
        const session = await getSession()

        if (!session?.user?.email) return null

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        })

        if (!currentUser) return null

        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        }
    } catch (err: any) {
        return null
    }
}