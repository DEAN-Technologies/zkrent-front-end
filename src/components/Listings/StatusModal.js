import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'

const StatusModal = ({ show, onClose, status, txHash }) => {
    const getStatusMessage = () => {
        if (status === 'success') {
            return (
                <>
                    <p>Transaction Succeeded</p>
                    {txHash && (
                        <p className='mt-2'>
                            View on <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className='text-blue-600 underline'>Etherscan</a>
                        </p>
                    )}
                </>
            )
        }
        if (status === 'failed') return 'Transaction Failed'
        return 'Processing Transaction...'
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={onClose}>
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
                                    {getStatusMessage()}
                                </Dialog.Title>
                                {status === 'processing' && (
                                    <div className='mt-4 flex justify-center'>
                                        <ClipLoader size={50} />
                                    </div>
                                )}
                                <div className='mt-4 flex justify-end'>
                                    <button
                                        onClick={onClose}
                                        type='button'
                                        className='border rounded-lg px-4 py-2 text-sm font-medium'
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default StatusModal
