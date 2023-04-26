"use client"
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Logo = () => {
    // const router = useRouter()

    return (
        <Image
            alt='logo'
            className='hidden cursor-pointer md:block'
            height={100}
            width={100}
            src={"/images/logo.png"}
            priority={true}
        />
    )
}

export default Logo