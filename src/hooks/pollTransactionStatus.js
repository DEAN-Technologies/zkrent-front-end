import Web3 from 'web3';

export const pollTransactionStatus = async (txHash) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')

    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            try {
                const receipt = await web3.eth.getTransactionReceipt(txHash)

                if (receipt) {
                    clearInterval(interval)
                    resolve(receipt.status)
                }
            } catch (error) {
                clearInterval(interval)
                reject(error)
            }
        }, 1000) // Poll every 1 second
    })
}
