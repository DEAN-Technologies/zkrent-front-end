import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { createContract } from '../utils/constants'
import { useAppContext } from '../context/context'
import MockedProperties from '../utils/mocked_data.json'
import Web3 from 'web3'

const zeroAddress = "0x0000000000000000000000000000000000000000"
const seed = 777
const mod = 937

export const useZkRent = () => {
  const [contract, setContract] = useState(null)
  const [userAddress, setUserAddress] = useState('')
  const { setProperties, setKycPassed } = useAppContext()

  const { address } = useAccount()

  useEffect(() => {
    address && setUserAddress(address)
    setContract(createContract())
  }, [address])

  useEffect(() => {
    if (contract) {
      if (address) {
        isWhitelisted(address)
      }
      getProperties()
    }
  }, [contract])

  const getProperties = async () => {
    if (contract) {
      try {
        const noOfProps = await contract.methods.counter().call()

        const updatedProperties = []

        for (let index = 0; index < noOfProps; index++) {
          const property = await contract.methods.properties(index).call()
          let baseRating = ((index ** 2 + seed) / 10) % 5;
          let rating = baseRating < 3 ? baseRating + 2 : baseRating;

          const formattedProperty = {
            id: index,
            name: property['name'],
            description: property['description'],
            imgUrl: property['imgUrl'],
            pricePerDay: property['pricePerDay'],
            isBooked: property['guest'] !== zeroAddress,
            isActive: property['isActive'],
            guest: property['guest'],
            address: property['propertyAddress'],
            area: property['area'],
            numberOfRooms: property['numberOfRooms'],
            owner: property['owner'],
            distance: ((index + 42) ** 2 + seed) % mod, // Don't ask what is going on here
            rating: rating.toFixed(2), // And here too
          }

          updatedProperties.push(formattedProperty)
        }

        setProperties(updatedProperties)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const addListing = async (
    name,
    propertyAddress,
    description,
    imgUrl,
    pricePerDay,
    numberOfRooms,
    area,
  ) => {
    if (contract) {
      try {
        const tx = await contract.methods
          .listProperty(name, propertyAddress, description, imgUrl, pricePerDay, numberOfRooms, area)
          .send({ from: address, gas: 3000000, gasLimit: null })

        await getProperties()
        return tx.transactionHash
      } catch (error) {
        console.error(error)
      }
    }
  }

  // We use this to populate the website with some listings when we redeploy the contract
  const addMockedListings = async () => {
    for (let i = 0; i < MockedProperties.length; i++) {
      const prop = MockedProperties[i];
      console.log(prop);
      try {
        await addListing(prop.name, prop.address, prop.description, prop.image, Web3.utils.toWei(prop.pricePerDayETH.toString(), 'ether'), prop.numberOfRooms, prop.areaSqFt)

        await getProperties()
      } catch (error) {
        console.error(error)
        break
      }
    }
  }

  const bookProperty = async (id, startAt, endAt) => {
    if (contract) {
      try {
        const duePrice = await contract.methods
          .getDuePrice(id, startAt, endAt)
          .call()

        const tx = await contract.methods.bookProperty(id, startAt, endAt).send({
          from: userAddress,
          value: duePrice,
          gas: 3000000,
          gasLimit: null,
        })

        await getProperties() // Update properties after booking a property
        return tx.transactionHash
      } catch (error) {
        console.error(error)
      }
    }
  }

  const unlistProperty = async (id) => {
    if (contract) {
      try {
        const tx = await contract.methods.unlistProperty(id).send({
          from: userAddress,
          gas: 3000000,
          gasLimit: null,
        })

        await getProperties() // Update properties after unlisting a property
        return tx.transactionHash
      } catch (error) {
        console.error(error)
      }
    }
  }

  const unbookPropertyByGuest = async (id) => {
    if (contract) {
      try {
        const tx = await contract.methods.unBookPropertyByGuest(id).send({
          from: userAddress,
          gas: 3000000,
          gasLimit: null,
        })

        await getProperties() // Update properties after unbooking by guest
        return tx.transactionHash
      } catch (error) {
        console.error(error)
      }
    }
  }

  const unbookPropertyByOwner = async (id) => {
    if (contract) {
      const refundPrice = await contract.methods
        .getPropertyRentPrice(id)
        .call()

      try {
        const tx = await contract.methods.unBookPropertyByOwner(id).send({
          from: userAddress,
          value: refundPrice,
          gas: 3000000,
          gasLimit: null,
        })

        await getProperties() // Update properties after unbooking by owner
        return tx.transactionHash
      } catch (error) {
        console.error(error)
      }
    }
  }

  const isWhitelisted = async (address) => {
    if (!contract) return;

    try {
      const isWhitelisted = await contract.methods.whitelist(address).call()

      console.log("WL:", isWhitelisted);

      setKycPassed(isWhitelisted)
    } catch (error) {
      console.error(error)
    }
  }


  return {
    addMockedListings,
    addListing,
    isWhitelisted,
    userAddress,
    getProperties,
    bookProperty,
    unbookPropertyByGuest,
    unbookPropertyByOwner,
    unlistProperty,
  }
}
