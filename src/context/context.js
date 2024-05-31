import { createContext, useContext, useState } from 'react'

export const appContext = createContext()

export const Provider = ({ children }) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)
  const [selectedPropertyDesc, setSelectedPropertyDesc] = useState(null)

  return (
    <appContext.Provider value={{ selectedPropertyId, setSelectedPropertyId, selectedPropertyDesc, setSelectedPropertyDesc }}>
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => useContext(appContext)
