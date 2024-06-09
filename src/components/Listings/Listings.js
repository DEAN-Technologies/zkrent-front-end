import ListingItem from './ListingItem';
import { useAppContext } from '../../context/context';
import { useAccount } from 'wagmi';
import Web3 from 'web3';

const Listings = ({ setShowReserveListingModal }) => {

  const { properties, searchText, filters } = useAppContext();
  const { address } = useAccount();

  const filteredProperties = properties.filter(item => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const matchesSearchText = searchText === '' ||
      item.name.toLowerCase().includes(lowerCaseSearchText) ||
      item.address.toLowerCase().includes(lowerCaseSearchText);

    const itemPrice = Web3.utils.fromWei(item.pricePerDay);

    const matchesPriceFrom = !filters.priceFrom || itemPrice >= filters.priceFrom;
    const matchesPriceTo = !filters.priceTo || itemPrice <= filters.priceTo;
    const matchesAreaMin = !filters.areaMin || item.area >= filters.areaMin;
    const matchesNumberOfRooms = !filters.numberOfRooms || item.numberOfRooms == filters.numberOfRooms;
    const matchesIsActive = !filters.isActive || item.isActive === filters.isActive;
    const matchesIsBooked = !filters.isBooked || item.isBooked === filters.isBooked;
    const matchesIsBookedByMe = !address || !filters.isBookedByMe || item.guest === address;
    const matchesMaxDistance = !filters.maxDistance || item.distance <= filters.maxDistance;

    return matchesSearchText && matchesPriceFrom && matchesPriceTo && matchesAreaMin &&
      matchesNumberOfRooms && matchesIsActive && matchesIsBooked &&
      matchesIsBookedByMe && matchesMaxDistance;
  });

  return (
    <div className='px-20'>
      {filteredProperties.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
          {filteredProperties.map((item, index) => (
            <ListingItem
              key={index}
              item={item}
              setShowReserveListingModal={setShowReserveListingModal}
            />
          ))}
        </div>
      ) : (
        <div className='text-center text-gray-500'>
          No listings match your filters. Please adjust your search criteria and try again.
        </div>
      )}
    </div>
  );
}

export default Listings;
