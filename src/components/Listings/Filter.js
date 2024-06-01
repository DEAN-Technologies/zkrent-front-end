import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useAppContext } from '../../context/context';
import { TrashIcon } from '@heroicons/react/24/outline';

const FilterModal = ({ isOpen, onClose, onApply }) => {
    const { filters } = useAppContext();

    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [areaMin, setAreaMin] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [isBookedByMe, setIsBookedByMe] = useState(false);
    const [maxDistance, setMaxDistance] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (filters) {
            setPriceFrom(filters.priceFrom || '');
            setPriceTo(filters.priceTo || '');
            setAreaMin(filters.areaMin || '');
            setNumberOfRooms(filters.numberOfRooms || '');
            setIsActive(filters.isActive || false);
            setIsBooked(filters.isBooked || false);
            setIsBookedByMe(filters.isBookedByMe || false);
            setMaxDistance(filters.maxDistance || '');
        }
    }, [filters]);

    const handleApply = () => {
        const validationErrors = {};

        if (priceFrom && isNaN(priceFrom)) validationErrors.priceFrom = "Price must be a number";
        if (priceTo && isNaN(priceTo)) validationErrors.priceTo = "Price must be a number";
        if (areaMin && isNaN(areaMin)) validationErrors.areaMin = "Area must be a number";
        if (numberOfRooms && isNaN(numberOfRooms)) validationErrors.numberOfRooms = "Number of rooms must be a number";
        if (maxDistance && isNaN(maxDistance)) validationErrors.maxDistance = "Distance must be a number";
        if (priceFrom < 0) validationErrors.priceFromNegative = "Price cannot be negative";
        if (priceTo < 0) validationErrors.priceToNegative = "Price cannot be negative";
        if (areaMin < 0) validationErrors.areaMinNegative = "Area cannot be negative";
        if (numberOfRooms < 0) validationErrors.numberOfRoomsNegative = "Number of rooms cannot be negative";
        if (maxDistance < 0) validationErrors.maxDistanceNegative = "Distance cannot be negative";
        if (priceFrom > priceTo) validationErrors.priceMismatch = "Price lower bound can't exceed the upper bound";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onApply({ priceFrom, priceTo, areaMin, numberOfRooms, isActive, isBooked, isBookedByMe, maxDistance });
        onClose();
    };

    const handleRoomSelection = (rooms) => {
        setNumberOfRooms(rooms);
    };

    const handleReset = () => {
        setPriceFrom('');
        setPriceTo('');
        setAreaMin('');
        setNumberOfRooms('');
        setIsActive(true);
        setIsBooked(false);
        setIsBookedByMe(false);
        setMaxDistance('');
        setErrors({});
    };

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
                                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                    Filter Options
                                </Dialog.Title>
                                <div className='mt-2'>
                                    <div className='space-y-4'>
                                        <div className='flex space-x-4'>
                                            <div className='flex-1'>
                                                <label className='block text-gray-700 mb-1'>Price From:</label>
                                                <input
                                                    type='number'
                                                    placeholder='e.g. 100'
                                                    value={priceFrom}
                                                    onChange={(e) => setPriceFrom(e.target.value)}
                                                    className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                />
                                                {errors.priceFrom && <p className="text-red-500 text-xs">{errors.priceFrom}</p>}
                                                {errors.priceFromNegative && <p className="text-red-500 text-xs">{errors.priceFromNegative}</p>}
                                            </div>
                                            <div className='flex-1'>
                                                <label className='block text-gray-700 mb-1'>Price To:</label>
                                                <input
                                                    type='number'
                                                    min="0"
                                                    placeholder='e.g. 500'
                                                    value={priceTo}
                                                    onChange={(e) => setPriceTo(e.target.value)}
                                                    className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                />
                                                {errors.priceTo && <p className="text-red-500 text-xs">{errors.priceTo}</p>}
                                                {errors.priceToNegative && <p className="text-red-500 text-xs">{errors.priceToNegative}</p>}
                                            </div>
                                        </div>
                                        {errors.priceMismatch && <p className="text-red-500 text-xs">{errors.priceMismatch}</p>}
                                        <div>
                                            <label className='block text-gray-700 mb-1'>Minimum Area:</label>
                                            <input
                                                type='number'
                                                min="0"
                                                placeholder='e.g. 50'
                                                value={areaMin}
                                                onChange={(e) => setAreaMin(e.target.value)}
                                                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            />
                                            {errors.areaMin && <p className="text-red-500 text-xs">{errors.areaMin}</p>}
                                            {errors.areaMinNegative && <p className="text-red-500 text-xs">{errors.areaMinNegative}</p>}
                                        </div>
                                        <div>
                                            <label className='block text-gray-700 mb-1'>Number of Rooms:</label>
                                            <div className='flex justify-between'>
                                                {[1, 2, 3, 4, 5].map((room) => (
                                                    <div
                                                        key={room}
                                                        onClick={() => handleRoomSelection(room)}
                                                        className={`cursor-pointer border rounded-lg px-3 py-2 text-sm ${numberOfRooms === room ? 'bg-blue-500 text-white' : ''}`}
                                                    >
                                                        {room}{room === 5 ? '+' : ''}
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.numberOfRooms && <p className="text-red-500 text-xs">{errors.numberOfRooms}</p>}
                                            {errors.numberOfRoomsNegative && <p className="text-red-500 text-xs">{errors.numberOfRoomsNegative}</p>}
                                        </div>
                                        <div className='flex items-center space-x-4'>
                                            <div className='flex items-center'>
                                                <input
                                                    type='checkbox'
                                                    checked={isActive}
                                                    onChange={(e) => setIsActive(e.target.checked)}
                                                    className='mr-2'
                                                />
                                                <label className='text-gray-700'>Is Active</label>
                                            </div>
                                            <div className='flex items-center'>
                                                <input
                                                    type='checkbox'
                                                    checked={isBooked}
                                                    onChange={(e) => setIsBooked(e.target.checked)}
                                                    className='mr-2'
                                                />
                                                <label className='text-gray-700'>Is Booked</label>
                                            </div>
                                            <div className='flex items-center'>
                                                <input
                                                    type='checkbox'
                                                    checked={isBookedByMe}
                                                    onChange={(e) => setIsBookedByMe(e.target.checked)}
                                                    className='mr-2'
                                                />
                                                <label className='text-gray-700'>My rentals</label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className='block text-gray-700 mb-1'>Maximum Distance:</label>
                                            <input
                                                type='number'
                                                min="0"
                                                placeholder='e.g. 10'
                                                value={maxDistance}
                                                onChange={(e) => setMaxDistance(e.target.value)}
                                                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            />
                                            {errors.maxDistance && <p className="text-red-500 text-xs">{errors.maxDistance}</p>}
                                            {errors.maxDistanceNegative && <p className="text-red-500 text-xs">{errors.maxDistanceNegative}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4 flex justify-between'>
                                    <button
                                        onClick={handleReset}
                                        className='inline-flex items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                                    >
                                        <TrashIcon className='h-5 w-5 mr-2' />
                                        Reset Filters
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className='inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                                    >
                                        Apply Filters
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

export default FilterModal;
