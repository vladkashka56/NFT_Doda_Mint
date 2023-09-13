
// import Onboard from "bnc-onboard";
// import Web3 from "web3";
import { ethers } from 'ethers'
import { chainId, contractAddress } from '../constants/address'

// const wallets = [
//     { walletName: "metamask", preferred: true }
// ];

// let web3;
// let walletProvider;

// const onboard = Onboard({
//     networkId: chainId,     // dappId: "877e8915-22d9-450e-a9b8-799bfd51798e", // [String] The API key created by step one above// [Integer] The Ethereum network ID your Dapp uses.
//     hideBranding: true,
//     walletSelect: {
//         wallets: wallets
//     },
//     subscriptions: {
//         wallet: (wallet) => {
//             web3 = new Web3(wallet.provider);
//             walletProvider = wallet.provider;
//             console.log(`${wallet.name} is now connected`);
//         }
//     }
// });

// export const connectWallet =  async () => {
//     const currentState = onboard.getState();
//     if(currentState["address"] != null) {
//         return {
//             address: currentState["address"],
//             status: "👆🏽 Mint your DODA Now.",
//         }
//     }
//     const walletSelected = await onboard.walletSelect("MetaMask");
//     if (walletSelected !== false) {
//         const walletCheck = await onboard.walletCheck();
//         if (walletCheck === true) {
//             const currentState = onboard.getState();
//             return {
//                 address: currentState["address"],
//                 status: "👆🏽 Mint your DODA Now.",
//             }
//         } else {
//             return {
//                 address: "",
//                 status: "😥 Connect your wallet account to the site.",
//             }
//         }
//     }

// }

// export const disConnectWallet = () => {
//     // onboard.walletReset()
//     return {
//         address: "",
//         status: "😥 Connect your wallet account to the site.",
//     }
// }

// export const getCurrentWalletConnected = async () => {
//     const currentState = onboard.getState();
//     console.log("current state", currentState)
//     if(currentState["address"] != null) {
//         return {
//             address: currentState["address"],
//             status: "👆🏽 Mint your DODA Now.",
//         }
//     }
// }

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const chain = await window.ethereum.request({ method: 'eth_chainId' })
        if (parseInt(chain, 16) == chainId) {
          const addressArray = await window.ethereum.request({
            method: 'eth_requestAccounts',
          })
          if (addressArray.length > 0) {
            return {
              address: addressArray[0],
              status: "👆🏽 You can mint new pack now.",
            }
          } else {
            return {
              address: "",
              status: "😥 Connect your wallet account to the site.",
            }
          }
        } else {
          window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId:chainId }],
          })
          return {
            address: "",
            status: "😥 Connect your wallet account to the site.",
          }
        }
        
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        }
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              {/* <a target="_blank" href={`https://metamask.io/download.html`}> */}
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.(https://metamask.io/download.html)
              {/* </a> */}
            </p>
          </span>
        ),
      }
    }
  }
  
  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        })
        const chain = await window.ethereum.request({
          method: "eth_chainId",
        })
        if (addressArray.length > 0 && chain === chainId) {
          return {
            address: addressArray[0],
            status: "👆🏽 You can mint new pack now.",
          }
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask and choose the correct chain using the top right button.",
          }
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        }
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              {/* <a target="_blank" href={`https://metamask.io/download.html`}> */}
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.(https://metamask.io/download.html)
              {/* </a> */}
            </p>
          </span>
        ),
      }
    }
  }


export const getContract = (walletAddress) => {
    const contractABI = require("../constants/contract.json")
    let contract
    try {
        if(walletAddress === null || walletAddress === '' || walletAddress === undefined) {
            if(chainId == 4 ) {
                contract = new ethers.Contract(contractAddress, contractABI, ethers.getDefaultProvider('rinkeby'))
            }
            if(chainId == 1 ) { 
                contract = new ethers.Contract(contractAddress, contractABI, ethers.getDefaultProvider('mainnet'))
            }
          } else {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const provider = new ethers.providers.Web3Provider(walletProvider);
            const signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer)
          }
    } catch (error) {
        contract = null
    }
    return contract
}
