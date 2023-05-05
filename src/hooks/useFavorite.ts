import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast"

import { SafeUser } from "@/types";

import useLoginModal from "./useLoginModel";

interface IUserFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUserFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoritedIds || [];

        return list.includes(listingId); // ?return true if listingId is in list
    }, [listingId, currentUser]);

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!currentUser) return loginModal.onOpen();

        console.log("hasFavorited => ", hasFavorited);
        try {
            let request;
            if (hasFavorited) {
                request = () => axios.delete(`/api/favorites/${listingId}`);
            } else {
                request = () => axios.post(`/api/favorites/${listingId}`);
            }

            await request();
            toast.success("Success");
            router.refresh();
        } catch (err) {
            toast.error('Something went wrong');
        }
    }, [currentUser, hasFavorited, router, listingId, loginModal]);

    return {
        hasFavorited,
        toggleFavorite
    };
}

export default useFavorite;