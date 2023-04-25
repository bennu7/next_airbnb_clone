import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navbar/Navbar'

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <div className='text-3xl'>HomePage</div>
    </main>
  )
}
