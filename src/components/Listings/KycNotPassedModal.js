import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import useMessages from '../../hooks/useMessages';

const KycNotPassedModal = ({ isOpen, onClose, address }) => {
    const messages = useMessages();

    return (
        <Transition appear show={isOpen} as={Fragment}>
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
                    <div className='fixed inset-0 bg-black bg-opacity-50' />
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
                                    className='text-lg font-medium leading-6 text-gray-900 mb-4'
                                >
                                    KYC verification not passed
                                </Dialog.Title>
                                <div className='mt-2'>
                                    <p className='text-gray-800'>
                                        To use the service, pass the KYC for the address: {address}
                                    </p>
                                </div>
                                <div className='mt-4 flex justify-end'>
                                    <button
                                        onClick={onClose}
                                        className='bg-[#CB6CE6] text-white px-4 py-2 rounded'
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
    );
};

export default KycNotPassedModal;
