"use client";

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation';
import { format } from "date-fns"
import Image from 'next/image';

import { Listing, Reservation } from '@prisma/client'

import { SafeUser } from '@/types';
import useCountries from '@/hooks/useCountries';
import HeartButton from '../HeartButton';
import Button from '../Button';


interface ListingCardProps {
    data: Listing;
    key: string;
    reservation?: Reservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
    key,
    data,
    currentUser,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = "",
}) => {
    const router = useRouter();
    const { getByValue } = useCountries();
    const location = getByValue(data.locationValue);

    const handleCancel = useCallback(() => {
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (disabled) return;

            onAction?.(actionId);
        }
    }, [disabled, onAction, actionId]);

    const price = useMemo(() => {
        if (reservation) return reservation.totalPrice;

        return data.price;
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if (!reservation) return null;

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, "PP")} - ${format(end, "PP")}`;
    }, [reservation]);

    return (
        <div>
            <div
                key={key}
                onClick={() => router.push(`/listings/${data.id}`)}
                className='col-span-1 bg-gray-200 cursor-pointer group'
            >
                ListingCard
            </div>
            <div className='flex flex-col w-full gap-2'>
                <div className='relative w-full overflow-hidden aspect-square rounded-xl'>
                    <Image
                        alt='Listing'
                        src={data.imageSrc}
                        className='object-cover w-full h-full transition group-hover:scale-110 bg-slate-100'
                        fill
                    />
                    <div className='absolute top-3 right-3'>
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className='text-lg font-semibold'>
                    {data.locationValue}
                </div>
                <div className='font-light text-neutral-500'>
                    {reservationDate || data.category}
                </div>
                <div className='flex flex-row items-center gap-1'>
                    <div className='font-semibold'>
                        $ {price}
                    </div>
                    <div>
                        {!reservation && (
                            <div className='font-light'>
                                night
                            </div>
                        )}
                    </div>
                    {onAction && actionLabel && (
                        <Button
                            label={actionId}
                            disabled={disabled}
                            onClick={handleCancel}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListingCard