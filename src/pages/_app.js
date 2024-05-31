import '../styles/globals.css'
import { Provider } from '../context/context'
import '@rainbow-me/rainbowkit/styles.css'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import Modal from 'react-modal'

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

import { infuraProvider } from 'wagmi/providers/infura'

Modal.setAppElement('#__next')

const { chains, provider } = configureChains(
  [chain.sepolia, chain.mainnet, chain.optimism, chain.arbitrum],
  [
    infuraProvider({ apiKey: process.env.INFURA_API_KEY, priority: 1 }),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'zkRent',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} coolMode>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  )
}

export default MyApp
