import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterMenu from '../components/FilterMenu'
import Listings from '../components/Listings/Listings'
import NewListingModal from '../components/Listings/NewListingModal'
import BookingModal from '../components/Listings/BookingModal'
import { useZkRent } from '../hooks/useZkRent'

export default function Home() {
  const [showReservedListing, setShowReservedListing] = useState(false)
  const [showNewListingModal, setShowNewListingModal] = useState(false)
  const [showReserveListingModal, setShowReserveListingModal] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    price: '',
    area: '',
    isAvailable: false,
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const { userAddress } = useZkRent()

  return (
    <div>
      <Head>
        <title>ZkRent</title>
      </Head>

      <Header />

      <main className='pt-10 pb-20'>
        <FilterMenu />
        {userAddress && (
          <div className='px-20 pb-10 flex justify-end space-x-4'>
            <button
              onClick={() => setShowNewListingModal(true)}
              className='border rounded-lg p-4 text-xs font-medium'
            >
              Add Listing
            </button>
          </div>
        )}

        <Listings setShowReserveListingModal={setShowReserveListingModal} />

        <NewListingModal
          showNewListingModal={showNewListingModal}
          setShowNewListingModal={setShowNewListingModal}
        />

        <BookingModal
          showReserveListingModal={showReserveListingModal}
          setShowReserveListingModal={setShowReserveListingModal}
        />
      </main>

      <Footer />
    </div>
  )
}