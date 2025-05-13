"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { metaMask } from "@wagmi/connectors"

export function useWalletAuth() {
  const { address, isConnected } = useAccount()

  const { connect, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()

  const connectWallet = () => {
    connect({ connector: metaMask() })
  }

  return {
    address,
    isConnected,
    isConnecting: isPending,
    connectWallet,
    disconnect: () => disconnect(),
    connectError,
  }
}
