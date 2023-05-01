"use client";

import React, { useCallback } from 'react'
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { TbPhotoPlus } from 'react-icons/tb';

declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange
}) => {
    const handleUpload = useCallback((result: any) => {
        console.log("result cdn upload => ", result);
        onChange(result.info.secure_url);
    }, [onChange]);

    return (
        <CldUploadWidget
            onUpload={handleUpload}
            uploadPreset='tfjsm3fr' //? This is the upload preset name from Cloudinary, set as unsigned mode from cloudinary dashboard
            options={{
                maxFiles: 1,
            }}
        >
            {({ open }) => {
                function handleOnClick(e: any) { //? we can use this function if using <button> tag
                    e.preventDefault();
                    open()
                }

                return (
                    <div
                        onClick={() => open?.()} //? open?.() is the same as open && open(), safe to use. auto upload when click on the div
                        className='relative flex flex-col items-center justify-center gap-4 p-20 transition-none border-2 border-dashed cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-600'
                    >
                        {
                            !value ? (
                                <div>
                                    <TbPhotoPlus size={50} />
                                    <div className='text-lg font-semibold'>
                                        Click to upload
                                    </div>
                                </div>
                            ) : (
                                <div className='p-4'>
                                    <Image
                                        alt='Uploaded'
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        src={value}
                                    />
                                </div>
                            )
                        }
                    </div>
                )
            }}
        </CldUploadWidget>
    )
}

export default ImageUpload