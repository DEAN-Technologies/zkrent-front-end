import { createContext, useContext, useState } from 'react'

export const appContext = createContext()

export const Provider = ({ children }) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)
  const [selectedPropertyDesc, setSelectedPropertyDesc] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState({
    priceFrom: '',
    priceTo: '',
    areaMin: '',
    numberOfRooms: '',
    isActive: true,
    isBooked: false,
    isBookedByMe: false,
    maxDistance: '',
  });
  const [language, setLanguage] = useState('en')

  return (
    <appContext.Provider value={{ selectedPropertyId, setSelectedPropertyId, selectedPropertyDesc, setSelectedPropertyDesc, searchText, setSearchText, filters, setFilters, language, setLanguage }}>
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => useContext(appContext)
