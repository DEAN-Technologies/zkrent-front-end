import ContractABI from './abi.json'
import Web3 from 'web3'

export const address = '0x83005a7a98d2dFD75031c07A208DD4b0fF1Ac06A'

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
