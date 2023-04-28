"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react'
import { IconType } from 'react-icons';
import qs from "query-string"

interface CategoryBoxProps {
    label: string;
    icon: IconType;
    description?: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    description,
    selected
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }
        console.log("currentQuery CategoryBox => ", currentQuery)

        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }
        console.log("updatedQuery CategoryBox => ", updatedQuery)

        if (params?.get("category") === label) {
            // * if the category is already selected, remove it from the query (undo)
            console.log("will delete updatedQuery CategoryBox => ", updatedQuery)
            delete updatedQuery.category;
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery,
        }, { skipNull: true });

        router.push(url);
    }, [label, params, router]);

    return (
        <div
            onClick={handleClick}
            className={`flex flex-col items-center justify-center gap-2 p-3 transition border-b-2 cursor-pointer hover:text-neutral-800 ${selected ? 'border-b-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500'} `}
        >
            <Icon size={24} />
            <div className='text-sm font-medium'>{label}</div>
        </div>
    )
}

export default CategoryBox