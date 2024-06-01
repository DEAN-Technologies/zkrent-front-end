import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { createContract } from '../utils/constants'

const zeroAddress = "0x0000000000000000000000000000000000000000"
const seed = 777
const mod = 937

export const useZkRent = () => {
  const [contract, setContract] = useState(null)
  const [userAddress, setUserAddress] = useState('')
  const [properties, setProperties] = useState([])

  const { address } = useAccount()

  useEffect(() => {
    address && setUserAddress(address)
    setContract(createContract())
  }, [address])

  useEffect(() => {
    getProperties()
  }, [contract])

  const getProperties = async () => {
    if (contract) {
      try {
        const noOfProps = await contract.methods.counter().call()

        setProperties([])

        for (let index = 0; index < noOfProps; index++) {
          const property = await contract.methods.properties(index).call()

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
          }

          setProperties(prevState => [...prevState, formattedProperty])
        }
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
        await contract.methods
          .listProperty(name, propertyAddress, description, imgUrl, pricePerDay, numberOfRooms, area)
          .send({ from: address, gas: 3000000, gasLimit: null })

        getProperties()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const bookProperty = async (id, startAt, endAt) => {
    if (contract) {
      try {
        const duePrice = await contract.methods
          .getDuePrice(id, startAt, endAt)
          .call();

        await contract.methods.bookProperty(id, startAt, endAt).send({
          from: userAddress,
          value: duePrice,
          gas: 3000000,
          gasLimit: null,
        })

        getProperties()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const unlistProperty = async (id) => {
    if (contract) {
      try {
        await contract.methods.unlistProperty(id).send({
          from: userAddress,
          gas: 3000000,
          gasLimit: null,
        })

        getProperties()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const unbookPropertyByGuest = async (id) => {
    if (contract) {
      try {
        await contract.methods.unBookPropertyByGuest(id).send({
          from: userAddress,
          gas: 3000000,
          gasLimit: null,
        })

        getProperties()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const unbookPropertyByOwner = async (id) => {
    if (contract) {
      const refundPrice = await contract.methods
        .getPropertyRentPrice(id)
        .call();

      try {
        await contract.methods.unBookPropertyByOwner(id).send({
          from: userAddress,
          value: refundPrice,
          gas: 3000000,
          gasLimit: null,
        })

        getProperties()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return {
    addListing,
    userAddress,
    getProperties,
    properties,
    bookProperty,
    unbookPropertyByGuest,
    unbookPropertyByOwner,
    unlistProperty,
  }
}
