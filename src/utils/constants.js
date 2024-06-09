import ContractABI from './abi.json'
import Web3 from 'web3'

export const address = '0xD6ea3169b54224c3955D097562c9Eec326898274'

export const createContract = () => {
  const { ethereum } = window
  if (ethereum) {
    const web3 = new Web3(ethereum)
    return new web3.eth.Contract(ContractABI.abi, address)
  }
}

export const modalStyles = {
  content: {
    height: '300px',
    width: '400px',
    margin: 'auto',
    marginTop: '150px',
    display: 'flex',
  },
  overlay: {
    backgroundColor: 'rgb(0 0 0 / 74%)',
  },
}
