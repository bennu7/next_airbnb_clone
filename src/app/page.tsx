import { Listing } from '@prisma/client';

import ClientOnly from '@/components/ClientOnly'
import Container from '@/components/Container'
import EmptyState from '@/components/EmptyState';
import ListingCard from '@/components/listings/ListingCard';

import getListings from '@/actions/getListings';
import getCurrentUser from '@/actions/getCurrentUser';

export default async function Home() {
  const listings = await getListings(); // ? get data listings from local api
  const currentUser = await getCurrentUser(); // ? get data user from local api

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          showReset
        />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <Container>
        <div className='grid grid-cols-1 gap-8 pt-24 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6'>
          {listings.map((listing: Listing) => {
            return (
              <ListingCard
                currentUser={currentUser}
                key={listing.id}
                data={listing}
              />
            )
          })}
        </div>
      </Container>
    </ClientOnly>
  )
}
