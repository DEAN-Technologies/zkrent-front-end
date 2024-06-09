import Head from 'next/head'
import { useState, Fragment } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterMenu from '../components/FilterMenu'
import Listings from '../components/Listings/Listings'
import NewListingModal from '../components/Listings/NewListingModal'
import BookingModal from '../components/Listings/BookingModal'
import { useZkRent } from '../hooks/useZkRent'
import { useAppContext } from '../context/context'
import useMessages from '../hooks/useMessages'
import KycNotPassedModal from '../components/Listings/KycNotPassedModal'
import Dashboard from '../components/Listings/Dashboard'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'

export default function Home() {
  const [showNewListingModal, setShowNewListingModal] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showReserveListingModal, setShowReserveListingModal] = useState(false)
  const [showKycNotPassedModal, setShowKycNotPassedModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false) // State for refresh button flashing
  const [showReloadMessage, setShowReloadMessage] = useState(false) // State for showing reload message
  const [iconClicked, setIconClicked] = useState(false) // State to indicate icon click

  const { userAddress, getProperties, isWhitelisted } = useZkRent()
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

  const handleRefreshClick = async () => {
    setIconClicked(true)
    setIsRefreshing(true)
    setTimeout(() => setIconClicked(false), 500) // Reset the icon click effect after 0.5 seconds
    await getProperties()
    if (address) {
      await isWhitelisted(address)
    }
    setIsRefreshing(false)
    setShowReloadMessage(true)
    setTimeout(() => setShowReloadMessage(false), 3000) // Show message for 3 seconds
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Head>
        <title>ZkRent</title>
      </Head>

      <Header />

      <main className='pt-10 pb-20 flex-grow'>
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
          {userAddress && (
            <div
              onClick={handleRefreshClick}
              className='text-gray-600 hover:text-gray-800 cursor-pointer flex items-center'
            >
              <ArrowPathIcon
                className={`h-6 w-6 transition-transform duration-150 ease-in-out ${iconClicked ? 'text-blue-500 transform scale-125' : ''}`}
              />
            </div>
          )}
        </div>

        <Transition
          show={showReloadMessage}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className='fixed bottom-20 right-10 bg-gray-100 text-black px-6 py-3 rounded-lg shadow-lg border border-gray-300 text-lg font-bold'>
            Data has been reloaded!
          </div>
        </Transition>

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
