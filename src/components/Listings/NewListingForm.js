import { useState } from 'react'
import { useZkRent } from '../../hooks/useZkRent'
import Web3 from 'web3'
import * as Bytescale from "@bytescale/upload-widget"
import { pollTransactionStatus } from '../../hooks/pollTransactionStatus'
import ClipLoader from "react-spinners/ClipLoader"
import useMessages from '../../hooks/useMessages'

const NewListingForm = ({ setShowNewListingModal }) => {
  const [name, setName] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [description, setDescription] = useState('')
  const [imgURL, setImgURL] = useState('')
  const [pricePerDay, setPricePerDay] = useState('')
  const [numberOfRooms, setNumberOfRooms] = useState('')
  const [area, setArea] = useState('')

  const [isCreating, setIsCreating] = useState(false)
  const [txStatus, setTxStatus] = useState(null)
  const [txHash, setTxHash] = useState(null)

  const { addListing } = useZkRent()
  const messages = useMessages()

  const handleUploadPropertyImage = async () => {
    Bytescale.UploadWidget.open({
      apiKey: "free",
      maxFileCount: 1
    }).then(
      files => {
        const fileUrls = files.map(x => x.fileUrl).join("\n")
        if (fileUrls.length === 0) {
          alert('No files selected.')
        } else {
          setImgURL(files[0].fileUrl)
        }
      },
      error => {
        alert(error)
      }
    )
  }

  const onCreate = async event => {
    event.preventDefault()

    const priceInWei = Web3.utils.toWei(pricePerDay, 'ether')

    setIsCreating(true)
    setTxStatus(null)
    setTxHash(null)

    try {
      const txHash = await addListing(name, propertyAddress, description, imgURL, priceInWei, numberOfRooms, area)
      setTxHash(txHash)
      const status = await pollTransactionStatus(txHash)
      setTxStatus(status)
    } catch (error) {
      console.error(error)
      setTxStatus(false)
    } finally {
      setIsCreating(false)
    }
  }

  const etherscanLink = txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : '#'

  const styles = {
    wrapper: `mt-2`,
    formWrapper: `grid grid-cols-1 gap-3`,
    formInputContainer: `flex flex-col border rounded-lg px-3 py-2`,
    inputLabel: `text-xs font-light`,
    input: `outline-none bg-transparent text-sm pt-1`,
    roomSelectionContainer: `flex justify-between`,
    roomBox: `cursor-pointer border rounded-lg px-3 py-2 text-sm`,
    activeRoomBox: `bg-blue-500 text-white`,
    imagePreview: `mt-2 w-full h-64 bg-gray-100 flex items-center justify-center`,
    image: `max-h-full max-w-full`,
    uploadButton: `mt-2 border border-blue-500 bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium cursor-pointer hover:bg-blue-600 transition-all`,
    createButton: `border rounded-lg px-4 py-2 text-sm font-medium transition-all`,
    createButtonDisabled: `bg-gray-200 text-gray-500 cursor-not-allowed`,
    createButtonEnabled: `bg-green-500 text-white hover:bg-green-600`,
  }

  const handleRoomSelection = (rooms) => {
    setNumberOfRooms(rooms)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.formWrapper}>
        <label className={styles.formInputContainer}>
          <span className={styles.inputLabel}>{messages.name}</span>
          <input
            onChange={event => setName(event.target.value)}
            value={name}
            className={styles.input}
          />
        </label>

        <label className={styles.formInputContainer}>
          <span className={styles.inputLabel}>{messages.address}</span>
          <input
            onChange={event => setPropertyAddress(event.target.value)}
            value={propertyAddress}
            className={styles.input}
          />
        </label>

        <label className={styles.formInputContainer}>
          <span className={styles.inputLabel}>{messages.area}</span>
          <input
            onChange={event => setArea(event.target.value)}
            value={area}
            className={styles.input}
          />
        </label>

        <div className={styles.formInputContainer}>
          <span className={styles.inputLabel}>{messages.numberOfRooms}</span>
          <div className={styles.roomSelectionContainer}>
            {[1, 2, 3, 4, 5].map((room) => (
              <div
                key={room}
                onClick={() => handleRoomSelection(room)}
                className={`${styles.roomBox} ${numberOfRooms === room ? styles.activeRoomBox : ''}`}
              >
                {room}{room === 5 ? '+' : ''}
              </div>
            ))}
          </div>
        </div>

        <label className={styles.formInputContainer}>
          <span className={styles.inputLabel}>{messages.description}</span>
          <input
            onChange={event => setDescription(event.target.value)}
            value={description}
            className={styles.input}
          />
        </label>

        <div className='flex flex-col'>
          <button onClick={handleUploadPropertyImage} className={styles.uploadButton}>
            {messages.uploadImage}
          </button>
          {imgURL && (
            <div className={styles.imagePreview}>
              <img src={imgURL} alt="Uploaded property" className={styles.image} />
            </div>
          )}
        </div>

        <label className={styles.formInputContainer}>
          <span className={styles.inputLabel}>{messages.pricePerDay}</span>
          <input
            onChange={event => setPricePerDay(event.target.value)}
            value={pricePerDay}
            className={styles.input}
          />
        </label>
      </div>

      <div className='mt-4 flex justify-end'>
        <button
          onClick={onCreate}
          disabled={
            !name || !propertyAddress || !imgURL || !pricePerDay || !area || !numberOfRooms
          }
          type='button'
          className={`${styles.createButton} ${(!name || !propertyAddress || !imgURL || !pricePerDay || !area || !numberOfRooms) ? styles.createButtonDisabled : styles.createButtonEnabled}`}
        >
          {messages.create}
        </button>
      </div>

      <div className='mt-4 flex flex-col items-center'>
        <ClipLoader
          loading={isCreating}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        {txStatus === false && <p className='mt-4 text-red-600'>Transaction Failed</p>}
        {txStatus === true && (
          <p className='mt-4 text-green-600'>
            Transaction Succeeded. View on <a href={etherscanLink} target="_blank" rel="noopener noreferrer" className='text-blue-600 underline'>Etherscan</a>
          </p>
        )}
      </div>
    </div>
  )
}

export default NewListingForm
