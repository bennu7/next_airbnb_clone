import { NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb"

interface IParams {
    listingId?: string;
}

export async function POST(
    req: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;
    if (!listingId || typeof listingId !== 'string') {
        throw new Error("Invalid ID listing")
    }

    // const favoriteIds = [...(currentUser.favoritedIds || [])];
    let favoriteIds = [...(currentUser.favoritedIds || [])];

    favoriteIds.push(listingId);

    const user = await prisma.user.update({
        data: {
            favoritedIds: favoriteIds,
        },
        where: {
            id: currentUser.id
        }
    });

    return NextResponse.json(user);
}

export async function DELETE(
    req: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;
    if (!listingId || typeof listingId !== 'string') {
        throw new Error("Invalid ID listing")
    }

    let favoriteIds = [...(currentUser.favoritedIds || [])];
    favoriteIds = favoriteIds.filter((id) => id !== listingId);
    console.log('favoriteIds => ', favoriteIds);

    const user = await prisma.user.update({
        data: {
            favoritedIds: favoriteIds,
    },
        where: {
            id: currentUser.id
        }
    });

    return NextResponse.json(user);
}