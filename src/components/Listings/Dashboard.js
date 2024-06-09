import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ClipboardIcon, CurrencyDollarIcon, ShoppingCartIcon, HomeIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useAppContext } from '../../context/context'
import { useAccount } from 'wagmi'
import DmailIcon from '../../public/images/dmail.png'
import ZkBridgeIcon from '../../public/images/zkbridge.png'
import Web3 from 'web3'

const Dashboard = ({ showDashboard, setShowDashboard }) => {
    const { properties } = useAppContext()
    const { address } = useAccount()

    const myBookings = properties.filter(property => property.guest.toLowerCase() === address.toLowerCase());
    const myListings = properties.filter(property => property.owner.toLowerCase() === address.toLowerCase());

    // Hardcoded statistics data
    const totalEarned = "5.23"; // in ETH
    const totalSpent = "3.45"; // in ETH
    const timesBooked = myBookings.length;
    const timesRented = myListings.length;
    const daysBooked = 25; // Example value
    const daysRented = 40; // Example value

    const copyToClipboard = (text, event) => {
        event.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
            alert('Address copied to clipboard!');
        });
    };

    const handleIconClick = (event, url) => {
        event.stopPropagation();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const truncateAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <Transition appear show={showDashboard} as={Fragment}>
            <Dialog
                as='div'
                className='relative z-50'
                onClose={() => setShowDashboard(false)}
            >
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
                            <Dialog.Panel className='w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title
                                    as='h3'
                                    className='text-lg font-medium leading-6 text-gray-900'
                                >
                                    Dashboard
                                </Dialog.Title>
                                <div className='mt-4'>
                                    {/* Statistics Section */}
                                    <div className='grid grid-cols-2 gap-4 mb-6'>
                                        <div className='flex items-center space-x-2'>
                                            <CurrencyDollarIcon className='w-6 h-6 text-green-500' />
                                            <span className='text-sm font-medium'>Total Earned: <span className='text-green-500'>{totalEarned} ETH</span></span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CurrencyDollarIcon className='w-6 h-6 text-red-500' />
                                            <span className='text-sm font-medium'>Total Spent: <span className='text-red-500'>{totalSpent} ETH</span></span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <ShoppingCartIcon className='w-6 h-6 text-gray-700' />
                                            <span className='text-sm font-medium'>Times Booked: {timesBooked}</span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <HomeIcon className='w-6 h-6 text-gray-700' />
                                            <span className='text-sm font-medium'>Times Rented: {timesRented}</span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CalendarIcon className='w-6 h-6 text-gray-700' />
                                            <span className='text-sm font-medium'>Days Booked: {daysBooked}</span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CalendarIcon className='w-6 h-6 text-gray-700' />
                                            <span className='text-sm font-medium'>Days Rented: {daysRented}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4 flex gap-4'>
                                    <div className='w-1/2'>
                                        <h4 className='text-md font-semibold mb-2'>
                                            My Bookings <span className='text-gray-500'>({myBookings.length})</span>
                                        </h4>
                                        <ul className='space-y-2'>
                                            {myBookings.length > 0 ? (
                                                myBookings.map((property) => (
                                                    <li key={property.id} className='border rounded p-2 flex items-center'>
                                                        <img src={property.imgUrl} alt={property.name} className='w-16 h-16 object-cover rounded mr-4' />
                                                        <div>
                                                            <p className='font-medium'>{property.name}</p>
                                                            <p className='text-sm text-gray-600'>{property.address}</p>
                                                            <p className='text-sm text-gray-600'>Price: {Web3.utils.fromWei(property.pricePerDay, 'ether')} ETH/night</p>
                                                            <div className='mt-2'>
                                                                <p className='text-sm text-gray-600 mb-1'>Owner: {truncateAddress(property.owner)}</p>
                                                                <div className='flex items-center space-x-2'>
                                                                    <ClipboardIcon
                                                                        onClick={(event) => copyToClipboard(property.owner, event)}
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
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p>No bookings found.</p>
                                            )}
                                        </ul>
                                    </div>
                                    <div className='w-1/2'>
                                        <h4 className='text-md font-semibold mb-2'>
                                            My Listings <span className='text-gray-500'>({myListings.length})</span>
                                        </h4>
                                        <ul className='space-y-2'>
                                            {myListings.length > 0 ? (
                                                myListings.map((property) => (
                                                    <li key={property.id} className='border rounded p-2 flex items-center'>
                                                        <img src={property.imgUrl} alt={property.name} className='w-16 h-16 object-cover rounded mr-4' />
                                                        <div>
                                                            <p className='font-medium'>{property.name}</p>
                                                            <p className='text-sm text-gray-600'>{property.address}</p>
                                                            <p className='text-sm text-gray-600'>Price: {Web3.utils.fromWei(property.pricePerDay, 'ether')} ETH/night</p>
                                                            <p className='text-sm text-gray-600'>Status: {property.isBooked ? 'Booked' : 'Available'}</p>
                                                            {property.isBooked && (
                                                                <div className='mt-2'>
                                                                    <p className='text-sm text-gray-600 mb-1'>Guest: {truncateAddress(property.guest)}</p>
                                                                    <div className='flex items-center space-x-2'>
                                                                        <ClipboardIcon
                                                                            onClick={(event) => copyToClipboard(property.guest, event)}
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
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p>No listings found.</p>
                                            )}
                                        </ul>
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

export default Dashboard
