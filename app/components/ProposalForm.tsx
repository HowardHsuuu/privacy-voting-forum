"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWalletAuth } from "../hooks/useWalletAuth"
import { useCreateProposal } from "../hooks/useProposalContract"
import { useFactCheck } from "../hooks/useFactCheck"

export default function ProposalForm() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const router = useRouter()

  const {
    isConnected,
    isConnecting,
    connectWallet,
    disconnect,
    connectError,
    address,
  } = useWalletAuth()

  const { write: createProposal, loading: isSubmitting } =
    useCreateProposal()

  const { check, loading: isFactChecking, result } = useFactCheck()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  if (!mounted) {
    return <div className="p-4 border rounded" />
  }

  if (!isConnected) {
    return (
      <div className="p-4 border rounded space-y-4">
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="btn"
        >
          {isConnecting ? "Connecting…" : "Connect Wallet"}
        </button>
        {connectError && (
          <p className="text-red-500">{connectError.message}</p>
        )}
      </div>
    )
  }

  const handleSubmit = async () => {
    await createProposal(title, description)
    router.refresh()
  }

  return (
    <div className="p-4 border rounded space-y-4">
      <p className="font-mono text-sm text-gray-600">
        Connected: {address}
      </p>
      <button onClick={disconnect} className="btn-outline">
        Disconnect
      </button>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Proposal Title"
        className="input w-full"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => description && check(description)}
        placeholder="Proposal Description"
        className="input w-full h-24"
      />

      {isFactChecking && <p>Fact‐checking…</p>}
      {result && (
        <p className="italic text-sm">
          Fact‐check: {result.verdict} ({result.score.toFixed(2)})
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !title || !description}
        className="btn w-full"
      >
        {isSubmitting ? "Submitting…" : "Submit Proposal"}
      </button>
    </div>
  )
}
