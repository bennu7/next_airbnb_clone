"use client"
import React, { useEffect, useState } from 'react'

interface ClientOnlyProps {
    children: React.ReactNode
}

// ? This component is used to render components that are only available on the client side
// ? untuk render komponen yang hanya tersedia di sisi klien
const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) return null
    console.log("hasMounted => ", hasMounted);

    return (
        <div>
            {children}
        </div>
    )
}

export default ClientOnly