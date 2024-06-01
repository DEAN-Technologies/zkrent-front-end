import Image from 'next/image'
import ZkRentLogo from '../public/images/zkRent.png'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { GlobeAmericasIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useAccount } from 'wagmi'
import { useEffect, useState, Fragment } from 'react'
import QRCode from 'qrcode.react'
import Modal from 'react-modal'
import { Dialog, Transition } from '@headlessui/react'
import { useAppContext } from '../context/context'

const Header = () => {
  const [domLoaded, setDomLoaded] = useState(false)
  const [kycModalIsOpen, setKycModalIsOpen] = useState(false)
  const [languageModalIsOpen, setLanguageModalIsOpen] = useState(false)
  const { address } = useAccount()
  const { setSearchText, setLanguage, language } = useAppContext()

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  const openKycModal = () => setKycModalIsOpen(true)
  const closeKycModal = () => setKycModalIsOpen(false)

  const openLanguageModal = () => setLanguageModalIsOpen(true)
  const closeLanguageModal = () => setLanguageModalIsOpen(false)

  const changeLanguage = (lang) => {
    setLanguage(lang)
    closeLanguageModal()
  }

  return (
    <>
      <header className='sticky top-0 transition-all md:grid md:grid-cols-3 items-center px-10 xl:px-20 py-4 z-50 bg-white border-b'>
        <div>
          <svg className='xl:hidden w-8 h-8 transition-all duration-300 text-[#FF385C]' fill='currentcolor'></svg>
          <Image className='hidden xl:inline-flex h-8 transition-all duration-300 text-[#FF385C]' src={ZkRentLogo} width={80} height={28} />
        </div>

        <div className='flex-1 flex xl:justify-center px-6 transition-all duration-300'>
          <button className='flex-1 flex items-center justify-between border rounded-full p-2 w-[300px] shadow-sm hover:shadow-md transition-all'>
            <div className='flex items-center divide-x'>
              <p className='text-gray-800 bg-transparent text-sm font-medium px-4' type='text'>
                Anywhere
              </p>
              <p className='text-gray-800 bg-transparent text-sm font-medium px-4' type='text'>
                Any week
              </p>
              <input onChange={event => setSearchText(event.target.value)} className='text-gray-600 bg-transparent text-sm font-light px-4' placeholder='Search' />
            </div>
            <MagnifyingGlassIcon className='h-8 w-8 bg-[#CB6CE6] text-white stroke-[3.5px] p-2 rounded-full' />
          </button>
        </div>

        <div className='flex items-center justify-end relative'>
          <div className='border border-transparent cursor-pointer hover:bg-gray-100 rounded-full px-3 py-2'>
            {domLoaded && address && (
              <button
                className='text-sm font-medium transition-all duration-300 text-gray-800'
                onClick={openKycModal}
              >
                Pass the KYC
              </button>
            )}
          </div>

          <div className='border border-transparent cursor-pointer hover:bg-gray-100 rounded-full p-3' onClick={openLanguageModal}>
            <GlobeAmericasIcon className='h-5 w-5 transition-all duration-300 text-gray-800' />
          </div>

          {true && <ConnectButton />}
        </div>
      </header>

      {domLoaded && address && (
        <Modal
          isOpen={kycModalIsOpen}
          onRequestClose={closeKycModal}
          contentLabel='KYC Modal'
          className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'
        >
          <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center'>
            <h2 className='text-xl font-bold mb-4'>Scan this QR Code to Pass the KYC</h2>
            <QRCode value={address} size={256} />
            <button
              onClick={closeKycModal}
              className='mt-4 bg-[#CB6CE6] text-white px-4 py-2 rounded'
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      <Transition appear show={languageModalIsOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={closeLanguageModal}>
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
                <Dialog.Panel className='w-32 transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all'>
                  <div className='mt-2'>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`w-full mt-2 px-4 py-2 rounded ${language === 'en' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 border'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => changeLanguage('ua')}
                      className={`w-full mt-2 px-4 py-2 rounded ${language === 'ua' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 border'}`}
                    >
                      UA
                    </button>
                  </div>
                  <div className='mt-2 flex justify-end'>
                    <button
                      onClick={closeLanguageModal}
                      className='text-gray-800 px-2 py-1 rounded'
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
    </>
  )
}

export default Header;
