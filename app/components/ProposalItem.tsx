"use client"
import { Proposal, useVoteOnProposal } from "../hooks/useProposalContract"
import Comments from "./Comments"

export default function ProposalItem({ proposal }: { proposal: Proposal }) {
  const { write: vote, loading } = useVoteOnProposal()
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{proposal.title}</h3>
      <p>{proposal.description}</p>
      <p>Votes: {proposal.voteCount}</p>
      <button
        disabled={loading}
        onClick={() => vote(proposal.id, true)}
        className="btn-sm"
      >
        👍
      </button>
      <button
        disabled={loading}
        onClick={() => vote(proposal.id, false)}
        className="btn-sm"
      >
        👎
      </button>
      <Comments />
    </div>
  )
}
