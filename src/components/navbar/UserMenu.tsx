"use client"
import React, { useCallback, useState } from 'react'
import { AiOutlineMenu } from "react-icons/ai"
import Avatar from '../Avatar'
import MenuItem from './MenuItem'
import useRegisterModal from '@/hooks/useRegisterModal'
import useLoginModal from '@/hooks/useLoginModel'
import { User } from '@prisma/client'
import { signOut } from 'next-auth/react'

interface UserMenuProps {
    currentUser?: User | null
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false)
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();

    const toggleOpen = useCallback(() => {
        setIsOpen(!isOpen)
        // setIsOpen((vallue) => !vallue) // alternative
    }, [isOpen]);


    return (
        <div className='relative'>
            <div className='flex flex-row items-center gap-3'>
                <div
                    onClick={() => { }}
                    className='hidden px-4 py-3 text-sm font-semibold transition rounded-full cursor-pointer md:block hover:bg-neutral-100'
                >
                    Airbnb your home
                </div>
                <div
                    onClick={toggleOpen}
                    className='
                    p-4
                    md:py-1
                    md:px-2
                    border-[1px]
                    border-neutral-100
                    flex flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition
                    '
                >
                    <AiOutlineMenu />
                    <div className='hidden md:block'>
                        <Avatar />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className='
                        absolute
                        rounded-xl
                        shadow-md
                        w-[40vw]
                        md:w-3/4
                        bg-white
                        overflow-hidden
                        right-0
                        top-12
                        text-sm
                        '
                >
                    <div className='flex flex-col cursor-pointer'>
                        {/* USER LOGIN */}
                        {currentUser ? (
                            <div>
                                <MenuItem onClick={() => { }} label='My trips' />
                                <MenuItem onClick={() => { }} label='My favorites' />
                                <MenuItem onClick={() => { }} label='My reservations' />
                                <MenuItem onClick={() => { }} label='My properties' />
                                <MenuItem onClick={() => { }} label='Airbnb my home' />
                                <MenuItem onClick={() => signOut()} label='Logout' />
                            </div>
                        ) : (
                            // GUEST LOGIN
                            <div>
                                <MenuItem onClick={() => loginModal.onOpen()} label='Login' />
                                <MenuItem onClick={() => registerModal.onOpen()} label='Sign Up' />
                            </div>
                        )}
                    </div>
                </div>
            )
            }

        </div >
    )
}

export default UserMenu