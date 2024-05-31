import Image from 'next/image'
import { useState, Fragment } from 'react'
import Web3 from 'web3'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline'
import { BackspaceIcon } from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'
import { useAppContext } from '../../context/context'
import { Dialog, Transition } from '@headlessui/react'
import { useZkRent } from '../../hooks/useZkRent'

const ListingItem = ({ item, setShowReserveListingModal }) => {
  const [priceInEth] = useState(Web3.utils.fromWei(item.pricePerDay))
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showUnbookConfirmation, setShowUnbookConfirmation] = useState(false)

  const { address } = useAccount()
  const { setSelectedPropertyId, setSelectedPropertyDesc } = useAppContext()

  const { unbookProperty, unlistProperty } = useZkRent()

  const openDeleteConfirmation = (event) => {
    event.stopPropagation()
    setSelectedPropertyId(item.id)
    setShowDeleteConfirmation(true)
  }

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false)
  }

  const handleDelete = () => {
    unlistProperty(item.id)
    closeDeleteConfirmation()
  }

  const openUnbookConfirmation = (event) => {
    event.stopPropagation()
    setSelectedPropertyId(item.id)
    setShowUnbookConfirmation(true)
  }

  const closeUnbookConfirmation = () => {
    setShowUnbookConfirmation(false)
  }

  const handleUnbook = () => {
    unbookProperty(item.id)
    closeUnbookConfirmation()
  }

  return (
    <>
      <div
        className='flex flex-col space-y-3 cursor-pointer max-w-[20rem]'
        onClick={event => {
          event.preventDefault()
          if (item.isBooked) return
          setShowReserveListingModal(true)
          setSelectedPropertyId(item.id)
          setSelectedPropertyDesc(item.description)
        }}
      >
        <div className='relative h-[22rem] w-auto max-w-[20rem] group'>
          <div className='relative h-[20rem] w-[20rem]'>
            <div className={`${item.isBooked && ''}`}>
              <Image
                className='h-full w-full rounded-xl object-cover'
                src={item.imgUrl}
                layout='fill'
                alt={`Image of ${item.name}`}
              />
            </div>
          </div>

          {address && (
            <div className='transition-all duration-150 absolute top-4 right-4 flex space-x-2'>
              <HeartIcon
                className={`w-6 h-6 text-white ${item.isBooked ? 'fill-red-500' : 'opacity-80'}`}
              />
              {item.owner === address && (
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

        <div className='space-y-1'>
          <div className='flex justify-between items-center'>
            <h3 className='font-medium'>{item.name}</h3>
            <div className='flex items-center space-x-1'>
              <StarIcon className='h-3 w-3 text-yellow-500' />
              <p className='text-sm text-gray-800'>4.8</p>
            </div>
          </div>

          <p className='text-sm font-light text-gray-600'>{788} miles away</p>
          <p className='text-sm font-light text-gray-600'>{item.address}</p>

          <div className='flex space-x-4 mt-2'>
            <div className='flex items-center space-x-1'>
              <span className='text-sm font-medium text-gray-700'>Area:</span>
              <span className='text-sm text-gray-600'>{item.area} sq ft</span>
            </div>
            <div className='flex items-center space-x-1'>
              <span className='text-sm font-medium text-gray-700'>Rooms:</span>
              <span className='text-sm text-gray-600'>{item.numberOfRooms}</span>
            </div>
          </div>

          {!item.isActive ? (
            <div className='text-gray-500 text-sm font-medium mt-2'>Property is inactive</div>
          ) : item.isBooked ? (
            <div className='text-red-500 text-sm font-medium mt-2'>Property is booked</div>
          ) : (
            <p className='text-sm font-light text-gray-800 mt-2'>
              <span className='text-base font-medium'>ETH {priceInEth.toLocaleString('en-US')}</span>
              &nbsp;/ night
            </p>
          )}
        </div>
      </div>

      {/* Bruh, refactor this please */}

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
                    Confirm Unlisting
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-600'>
                      Are you sure you want to unlist this property?
                    </p>
                  </div>
                  <div className='mt-4 flex justify-end space-x-2'>
                    <button
                      onClick={closeDeleteConfirmation}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium bg-red-500 text-white'
                    >
                      Unlist
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
                    Confirm Unbooking
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-600'>
                      Are you sure you want to unbook this property?
                    </p>
                  </div>
                  <div className='mt-4 flex justify-end space-x-2'>
                    <button
                      onClick={closeUnbookConfirmation}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUnbook}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium bg-red-500 text-white'
                    >
                      Unbook
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ListingItem
