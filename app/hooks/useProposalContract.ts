"use client"
import { useState, useEffect } from "react"

export interface Proposal {
  id: number
  title: string
  description: string
  voteCount: number
}

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setProposals([
        { id: 1, title: "Proposal one", description: "description 1", voteCount: 3 },
        { id: 2, title: "Proposal two", description: "description 2", voteCount: 5 },
      ])
      setLoading(false)
    }, 500)
  }, [])

  return { proposals, loading }
}

export function useCreateProposal() {
  const [loading, setLoading] = useState(false)
  const write = async (title: string, desc: string) => {
    setLoading(true)
    console.log("[MOCK] createProposal", { title, desc })
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
  }
  return { write, loading }
}

export function useVoteOnProposal() {
  const [loading, setLoading] = useState(false)
  const write = async (id: number, support: boolean) => {
    setLoading(true)
    console.log("[MOCK] vote", { id, support })
    await new Promise((r) => setTimeout(r, 500))
    setLoading(false)
  }
  return { write, loading }
}
