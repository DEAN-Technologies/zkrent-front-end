import Image from 'next/image'
import { useState, Fragment } from 'react'
import Web3 from 'web3'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, TrashIcon, BackspaceIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'
import { useAppContext } from '../../context/context'
import { Dialog, Transition } from '@headlessui/react'
import { useZkRent } from '../../hooks/useZkRent'
import StatusModal from './StatusModal'
import { pollTransactionStatus } from '../../hooks/pollTransactionStatus'
import useMessages from '../../hooks/useMessages'
import KycNotPassedModal from './KycNotPassedModal'

// Import PNG icons
import DmailIcon from '../../public/images/dmail.png'
import ZkBridgeIcon from '../../public/images/zkbridge.png'

const ListingItem = ({ item, setShowReserveListingModal }) => {
  const [priceInEth] = useState(Web3.utils.fromWei(item.pricePerDay))
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showUnbookConfirmation, setShowUnbookConfirmation] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showKycNotPassedModal, setShowKycNotPassedModal] = useState(false)
  const [status, setStatus] = useState('processing')
  const [txHash, setTxHash] = useState(null)
  const [popupMessage, setPopupMessage] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const { address } = useAccount()
  const { setSelectedPropertyId, setSelectedPropertyDesc, kycPassed } = useAppContext()
  const messages = useMessages()

  const { unbookPropertyByGuest, unbookPropertyByOwner, unlistProperty, getProperties } = useZkRent()

  const openDeleteConfirmation = (event) => {
    event.stopPropagation()
    setSelectedPropertyId(item.id)
    setShowDeleteConfirmation(true)
  }

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false)
  }

  const handleDelete = async () => {
    setShowDeleteConfirmation(false)
    setShowStatusModal(true)
    setTxHash(null)
    try {
      const txHash = await unlistProperty(item.id)
      setTxHash(txHash)
      const txStatus = await pollTransactionStatus(txHash)
      setStatus(txStatus ? 'success' : 'failed')
      await getProperties()
    } catch (error) {
      setStatus('failed')
    }
  }

  const openUnbookConfirmation = (event) => {
    event.stopPropagation()
    setSelectedPropertyId(item.id)
    setShowUnbookConfirmation(true)
  }

  const closeUnbookConfirmation = () => {
    setShowUnbookConfirmation(false)
  }

  const handleUnbook = async () => {
    if (!address) return
    setShowUnbookConfirmation(false)
    setShowStatusModal(true)
    setTxHash(null)
    try {
      let txHash
      if (item.guest === address) {
        txHash = await unbookPropertyByGuest(item.id)
      } else if (item.owner === address) {
        txHash = await unbookPropertyByOwner(item.id)
      }
      setTxHash(txHash)
      const txStatus = await pollTransactionStatus(txHash)
      setStatus(txStatus ? 'success' : 'failed')
      await getProperties()
    } catch (error) {
      setStatus('failed')
    }
  }

  const handleReserveClick = (event) => {
    event.preventDefault()
    if (item.isBooked) return

    if (!kycPassed) {
      setShowKycNotPassedModal(true)
      return
    }

    setShowReserveListingModal(true)
    setSelectedPropertyId(item.id)
    setSelectedPropertyDesc(item.description)
  }

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const copyToClipboard = (text, event) => {
    event.stopPropagation()
    navigator.clipboard.writeText(text).then(() => {
      setPopupMessage('Address copied to clipboard')
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
      }, 3000)
    })
  }

  const handleIconClick = (event, url) => {
    event.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div
        className='flex flex-col space-y-3 cursor-pointer max-w-[20rem] rounded-lg transition-all duration-300'
        onClick={handleReserveClick}
      >
        <div className='relative h-[22rem] w-auto max-w-[20rem] rounded-lg overflow-hidden group'>
          <div className='relative h-[20rem] w-[20rem] rounded-lg overflow-hidden'>
            <div className={`${item.isBooked && ''}`}>
              <Image
                className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                src={item.imgUrl}
                layout='fill'
                alt={`Image of ${item.name}`}
              />
            </div>
          </div>

          {address && (
            <div className='transition-all duration-150 absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100'>
              {item.isActive && item.guest === address && (
                <HeartIcon
                  className={`w-6 h-6 text-white ${item.isBooked ? 'fill-red-500' : 'opacity-80'}`}
                />
              )}
              {!item.isBooked && item.isActive && item.owner === address && (
                <TrashIcon
                  onClick={openDeleteConfirmation}
                  className='w-6 h-6 text-white cursor-pointer hover:opacity-80'
                />
              )}
              {(item.isBooked && item.owner === address || item.guest === address) && (
                <BackspaceIcon
                  onClick={openUnbookConfirmation}
                  className='w-6 h-6 text-white cursor-pointer hover:opacity-80'
                />
              )}
            </div>
          )}
        </div>

        <div className='space-y-1 px-3'>
          <div className='flex justify-between items-center'>
            <h3 className='font-medium'>{item.name}</h3>
            <div className='flex items-center space-x-1'>
              <StarIcon className='h-3 w-3 text-yellow-500' />
              <p className='text-sm text-gray-800'>{item.rating}</p>
            </div>
          </div>

          <p className='text-sm font-light text-gray-600'>{item.distance} {messages.distance}</p>
          <p className='text-sm font-light text-gray-600'>{item.address}</p>

          <div className='flex space-x-4 mt-2'>
            <div className='flex items-center space-x-1'>
              <span className='text-sm font-medium text-gray-700'>{messages.area}</span>
              <span className='text-sm text-gray-600'>{item.area}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <span className='text-sm font-medium text-gray-700'>{messages.numberOfRooms}</span>
              <span className='text-sm text-gray-600'>{item.numberOfRooms}</span>
            </div>
          </div>

          <div className='flex space-x-2 items-center mt-2'>
            <span className='text-sm font-medium text-gray-700'>{messages.owner}:</span>
            <span className='text-sm text-gray-600'>{truncateAddress(item.owner)}</span>
            <ClipboardIcon
              onClick={(event) => copyToClipboard(item.owner, event)}
              className='w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800'
            />
            <img
              src={DmailIcon.src}
              alt="Dmail"
              className="w-5 h-5 cursor-pointer hover:opacity-80"
              onClick={(event) => handleIconClick(event, 'https://mail.dmail.ai/compose')}
            />
            <img
              src={ZkBridgeIcon.src}
              alt="zkBridge"
              className="w-5 h-5 cursor-pointer hover:opacity-80"
              onClick={(event) => handleIconClick(event, 'https://www.zkbridge.com/zkmessenger')}
            />
          </div>

          {!item.isActive ? (
            <div className='text-gray-500 text-sm font-medium mt-2'>{messages.propertyInactive}</div>
          ) : item.isBooked ? (
            <div className='text-red-500 text-sm font-medium mt-2'>{messages.propertyBooked}</div>
          ) : (
            <p className='text-sm font-light text-gray-800 mt-2'>
              <span className='text-base font-medium'>ETH {priceInEth.toLocaleString('en-US')}</span>
              &nbsp;/ {messages.night}
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={showDeleteConfirmation} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={closeDeleteConfirmation}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    {messages.confirmUnlisting}
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-600'>
                      {messages.confirmUnlistingMessage}
                    </p>
                  </div>
                  <div className='mt-4 flex justify-end space-x-2'>
                    <button
                      onClick={closeDeleteConfirmation}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium'
                    >
                      {messages.cancel}
                    </button>
                    <button
                      onClick={handleDelete}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium bg-red-500 text-white'
                    >
                      {messages.unlist}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Unbook Confirmation Modal */}
      <Transition appear show={showUnbookConfirmation} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={closeUnbookConfirmation}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    {messages.confirmUnbooking}
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-600'>
                      {messages.confirmUnbookingMessage}
                    </p>
                  </div>
                  <div className='mt-4 flex justify-end space-x-2'>
                    <button
                      onClick={closeUnbookConfirmation}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium'
                    >
                      {messages.cancel}
                    </button>
                    <button
                      onClick={handleUnbook}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium bg-red-500 text-white'
                    >
                      {messages.unbook}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <StatusModal
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        status={status}
        txHash={txHash}
      />

      <KycNotPassedModal
        isOpen={showKycNotPassedModal}
        onClose={() => setShowKycNotPassedModal(false)}
        address={address}
      />

      {showPopup && (
        <div className='fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-300 text-white px-4 py-2 rounded shadow-lg z-50'>
          {popupMessage}
        </div>
      )}
    </>
  )
}

export default ListingItem
