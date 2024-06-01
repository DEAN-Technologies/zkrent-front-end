# ZkRent 🏠

![zkRent logo](https://github.com/DEAN-Technologies/zkrent-front-end/assets/72448226/4c43499e-63e8-4e56-afe4-78cdb153bc1f)

zkRent is a decentralized rental platform built on the blockchain. It leverages Zero-Knowledge (ZK) proofs to provide secure and private Know Your Customer (KYC) verification. Whether you're looking to rent out your property or find a place to stay, zkRent ensures a seamless, trustless, and private experience.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Listing a Property](#listing-a-property)
  - [Booking a Property](#booking-a-property)
- [License](#license)

## Features ✨

- **Decentralized Platform**: Built on the blockchain for transparency and security.
- **Zero-Knowledge Proofs**: Secure and private KYC verification.
- **Smart Contracts**: Automated and trustless transactions.
- **User-Friendly Interface**: Seamless experience for property owners and renters.

## Technology Stack 🛠️

- **Frontend**: Next.js, Tailwind CSS
- **Blockchain**: Ethereum, Web3.js
- **KYC Verification**: Zero-Knowledge Proofs
- **Icons**: Heroicons
- **State Management**: Context API
- **UI Components**: Headless UI

## Getting Started 🚀

### Prerequisites 📋

- Node.js (v14 or later)
- npm or yarn
- MetaMask or any Ethereum wallet

### Installation 🔧

1. Clone the repository:

    ```bash
    git clone https://github.com/DEAN-Technologies/zkrent-front-end.git
    cd zkrent-front-end/src
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

### Running the Application ▶️

1. Start the development server:

    ```bash
    npm run dev
    ```

    or

    ```bash
    yarn dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage 📖

### Listing a Property 🏡

1. Connect your Ethereum wallet.
2. Navigate to the "List Property" section.
3. Fill in the property details including name, address, area, number of rooms, and price.
4. Upload property images.
5. Submit the listing. The property will be added to the blockchain.

### Booking a Property 🗝️

1. Complete KYC verification using Zero-Knowledge Proofs.
2. Browse available properties.
3. Select a property to view details.
4. Click "Reserve" to start the booking process.
5. Confirm the booking. The transaction will be processed on the blockchain.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## No KYC version

The main branch contains the KYC version that requires its users to scan their biometric passports to generate ZK proofs.
If you are interested in testing the website with the KYC disabled, switch to the `no-kyc-version` branch or visit https://zkrent-front-end-git-no-kyc-version-zkrent.vercel.app/

---

Thank you for using zkRent! We hope you have a seamless rental experience.

---
