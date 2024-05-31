import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

import { createContract } from '../utils/constants'

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
        console.log("No of props: ", noOfProps);

        setProperties([])

        for (let index = 0; index < noOfProps; index++) {
          const property = await contract.methods.properties(index).call()

          console.log("Property:", property);

          const formattedProperty = {
            id: index,
            name: property['name'],
            lat: property['lat'],
            long: property['long'],
            description: property['description'],
            imgUrl: property['imgUrl'],
            pricePerDay: property['pricePerDay'],
            isBooked: property['guest'] !== "0x0000000000000000000000000000000000000000",
            isActive: property['isActive'],
            guest: property['guest'],
            address: property['propertyAddress'],
            area: property['area'],
            numberOfRooms: property['numberOfRooms'],
            owner: property['owner'],
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
        console.log("\n\n\nBOOOKING", id, startAt, endAt)
        const duePrice = await contract.methods
          .getDuePrice(id, startAt, endAt)
          .call()
          ;

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

  return {
    addListing,
    userAddress,
    getProperties,
    properties,
    bookProperty,
  }
}
