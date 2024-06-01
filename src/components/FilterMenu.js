import Image from 'next/image'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import FilterModal from './Listings/Filter'
import { useAppContext } from '../context/context';
import useMessages from '../hooks/useMessages';

function FilterMenu() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setFilters } = useAppContext()

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const messages = useMessages()

    const menus = [
        {
            title: messages.beach,
            icon: 'https://a0.muscache.com/pictures/10ce1091-c854-40f3-a2fb-defc2995bcaf.jpg',
        },
        {
            title: messages.amazingPools,
            icon: 'https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg',
        },
        {
            title: messages.tinyHomes,
            icon: 'https://a0.muscache.com/pictures/35919456-df89-4024-ad50-5fcb7a472df9.jpg',
        },
        {
            title: messages.islands,
            icon: 'https://a0.muscache.com/pictures/8e507f16-4943-4be9-b707-59bd38d56309.jpg',
        },
        {
            title: messages.nationalParks,
            icon: 'https://a0.muscache.com/pictures/c0a24c04-ce1f-490c-833f-987613930eca.jpg',
        },
        {
            title: messages.design,
            icon: 'https://a0.muscache.com/pictures/50861fca-582c-4bcc-89d3-857fb7ca6528.jpg',
        },
        {
            title: messages.arctic,
            icon: 'https://a0.muscache.com/pictures/8b44f770-7156-4c7b-b4d3-d92549c8652f.jpg',
        },
        {
            title: messages.amazingViews,
            icon: 'https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg',
        },
        {
            title: messages.lakefront,
            icon: 'https://a0.muscache.com/pictures/677a041d-7264-4c45-bb72-52bff21eb6e8.jpg',
        },
        {
            title: messages.surfing,
            icon: 'https://a0.muscache.com/pictures/957f8022-dfd7-426c-99fd-77ed792f6d7a.jpg',
        },
        {
            title: messages.cabins,
            icon: 'https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg',
        },
    ]

    return (
        <div className="px-20 pb-10 flex justify-between items-center">
            <div className="flex items-center space-x-10">
                {menus.map((menu, index) => (
                    <div key={index} className="flex flex-col justify-center items-center space-y-2">
                        <div className="relative h-6 w-6">
                            <Image objectFit="contain" layout="fill" src={menu.icon} />
                        </div>

                        <p className="text-xs font-light">{menu.title}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleOpenModal} className="border rounded-lg p-4 text-xs font-medium flex space-x-2">
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <FilterModal isOpen={isModalOpen} onClose={handleCloseModal} onApply={handleApplyFilters} />
                <span>{messages.filters}</span>
            </button>
        </div>
    )
}

export default FilterMenu
