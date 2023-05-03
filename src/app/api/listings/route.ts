import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb"
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(req: Request) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }
    const body = await req.json();
    const {
        category,
        location,
        guestCount,
        roomCount,
        bathRoomCount,
        imageSrc,
        price,
        title,
        description
    } = body;

    Object.keys(body).forEach((value: any) => {
        console.log("value Object.keys(body) :>> ", value);

        if (!body[value]) { // ?check if value is empty
            NextResponse.error();
        }
    });

    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount: bathRoomCount,
            guestCount,
            locationValue: location.label + ", " + location.value,
            price: parseInt(price, 10),
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing);
};

export async function GET(req: Request) { }