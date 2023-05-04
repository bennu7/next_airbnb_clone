"use client";

import { useRouter } from 'next/navigation'
import React from 'react'
import Heading from './Heading';
import Button from './Button';

interface EmptyStateProps {
    title?: string,
    subtitle?: string,
    showReset?: boolean,
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = "No exact matches",
    subtitle = "try changing or removing some filters",
    showReset
}) => {
    const router = useRouter();

    return (
        <div className='flex h-[60vh] flex-col gap-2 justify-center items-center'>
            <Heading
                title={title}
                subtitle={subtitle}
                center
            />
            <div className='w-48 mt-4'>
                {showReset && (
                    <Button
                        label='Remove all filters'
                        outline
                        onClick={() => router.push('/')}
                    />
                )}
            </div>
        </div>
    )
}

export default EmptyState