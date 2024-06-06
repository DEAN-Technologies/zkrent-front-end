import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { useZkRent } from '../../hooks/useZkRent'
import { useAppContext } from '../../context/context'
import { pollTransactionStatus } from '../../hooks/pollTransactionStatus'
import ClipLoader from "react-spinners/ClipLoader";

const BookingModal = ({
  showReserveListingModal,
  setShowReserveListingModal,
}) => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isBooking, setIsBooking] = useState(false)
  const [txStatus, setTxStatus] = useState(null) // New state for transaction status

  const { bookProperty, getProperties } = useZkRent()
  const { selectedPropertyId, selectedPropertyDesc } = useAppContext()

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const selectionRange = {
    startDate,
    endDate,
    key: 'selection',
  }

  const handleSelect = ranges => {
    setStartDate(new Date(ranges.selection.startDate).getTime())
    setEndDate(new Date(ranges.selection.endDate).getTime())
  }

  const closeModal = () => {
    setShowReserveListingModal(false)
  }

  const onConfirm = async event => {
    event.preventDefault()
    setIsBooking(true)
    setTxStatus(null)

    try {
      const txHash = await bookProperty(selectedPropertyId, startDate, endDate)
      const status = await pollTransactionStatus(txHash)
      setTxStatus(status)
    } catch (error) {
      console.error(error)
      setTxStatus(false)
    } finally {
      setIsBooking(false)
      getProperties()
    }
  }

  return (
    <Transition appear show={showReserveListingModal} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={closeModal}>
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
              <Dialog.Panel className='w-full max-w-fit transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Reserve Listing
                </Dialog.Title>

                <div className='mt-2'>
                  <p className='text-sm text-gray-600'>
                    {selectedPropertyDesc || 'No description provided for this property.'}
                  </p>

                  <div className='mt-4'>
                    <DateRangePicker
                      minDate={new Date()}
                      rangeColors={['#FD5B61']}
                      ranges={[selectionRange]}
                      onChange={handleSelect}
                    />
                  </div>

                  <div className='mt-4 flex justify-end'>
                    <button
                      onClick={onConfirm}
                      type='button'
                      className='border rounded-lg px-4 py-2 text-sm font-medium'
                    >
                      Confirm
                    </button>
                  </div>

                  <div className='mt-4 flex flex-col items-center'>
                    <ClipLoader
                      loading={isBooking}
                      cssOverride={override}
                      size={50} // Adjusted size for the spinner
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                    {txStatus === false && <p className='mt-4 text-red-600'>Transaction Failed</p>}
                    {txStatus === true && <p className='mt-4 text-green-600'>Transaction Succeeded</p>}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default BookingModal
