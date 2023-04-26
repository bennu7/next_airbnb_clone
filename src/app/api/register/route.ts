import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, name, password } = body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword,
        }
    })
    console.log("user registered => ", user)


    return NextResponse.json(user);
};