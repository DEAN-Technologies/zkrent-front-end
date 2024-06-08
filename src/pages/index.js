import Head from 'next/head'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterMenu from '../components/FilterMenu'
import Listings from '../components/Listings/Listings'
import NewListingModal from '../components/Listings/NewListingModal'
import BookingModal from '../components/Listings/BookingModal'
import { useZkRent } from '../hooks/useZkRent'
import { useAppContext } from '../context/context'
import useMessages from '../hooks/useMessages'
import KycNotPassedModal from '../components/Listings/KycNotPassedModal' // Assuming the location is appropriate
import Dashboard from '../components/Listings/Dashboard'

export default function Home() {
  const [showNewListingModal, setShowNewListingModal] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showReserveListingModal, setShowReserveListingModal] = useState(false)
  const [showKycNotPassedModal, setShowKycNotPassedModal] = useState(false)

  const { userAddress } = useZkRent()
  const { kycPassed, address } = useAppContext()
  const messages = useMessages()

  const handleNewListingClick = () => {
    if (!kycPassed) {
      setShowKycNotPassedModal(true)
      return
    }
    setShowNewListingModal(true)
  }

  const handleDashboardClick = () => {
    if (!kycPassed) {
      setShowKycNotPassedModal(true)
      return
    }
    setShowDashboard(true)
  }

  return (
    <div>
      <Head>
        <title>ZkRent</title>
      </Head>

      <Header />

      <main className='pt-10 pb-20'>
        <FilterMenu />
        <div className="flex justify-end items-center px-20 pb-10 space-x-4">
          {userAddress && (
            <button
              onClick={handleNewListingClick}
              className='border rounded-lg p-4 text-xs font-medium text-black hover:bg-gray-100'
            >
              {messages.addListing}
            </button>
          )}
          {userAddress && (
            <button
              onClick={handleDashboardClick}
              className='border rounded-lg p-4 text-xs font-medium bg-blue-500 text-white hover:bg-blue-600'
            >
              {messages.dashboard}
            </button>
          )}
        </div>

        <Listings setShowReserveListingModal={setShowReserveListingModal} />

        <NewListingModal
          showNewListingModal={showNewListingModal}
          setShowNewListingModal={setShowNewListingModal}
        />

        <Dashboard
          showDashboard={showDashboard}
          setShowDashboard={setShowDashboard}
        />

        <BookingModal
          showReserveListingModal={showReserveListingModal}
          setShowReserveListingModal={setShowReserveListingModal}
        />
      </main>

      <Footer />

      <KycNotPassedModal
        isOpen={showKycNotPassedModal}
        onClose={() => setShowKycNotPassedModal(false)}
        address={address}
      />
    </div>
  )
}
