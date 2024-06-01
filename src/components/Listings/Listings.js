import ListingItem from './ListingItem';
import { useZkRent } from '../../hooks/useZkRent';
import { useAppContext } from '../../context/context';
import { useAccount } from 'wagmi'

const Listings = ({ setShowReserveListingModal }) => {
  const { properties } = useZkRent();
  const { searchText, filters } = useAppContext();
  const { address } = useAccount()

  const filteredProperties = properties.filter(item => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const matchesSearchText = searchText === '' ||
      item.name.toLowerCase().includes(lowerCaseSearchText) ||
      item.address.toLowerCase().includes(lowerCaseSearchText);

    const matchesPriceFrom = !filters.priceFrom || item.price >= filters.priceFrom;
    const matchesPriceTo = !filters.priceTo || item.price <= filters.priceTo;
    const matchesAreaMin = !filters.areaMin || item.area >= filters.areaMin;
    const matchesNumberOfRooms = !filters.numberOfRooms || item.numberOfRooms === filters.numberOfRooms;
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
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
        {filteredProperties.map((item, index) => (
          <ListingItem
            key={index}
            item={item}
            setShowReserveListingModal={setShowReserveListingModal}
          />
        ))}
      </div>
    </div>
  );
}

export default Listings;
