"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProposals, useVoteOnProposal, Proposal } from "../hooks/useProposalContract"
import { useFactCheck } from "../hooks/useFactCheck"

export default function ProposalList() {
  const router = useRouter()

  const { proposals, loading } = useProposals()

  const { write: vote, loading: isVoting } = useVoteOnProposal()

  const [newComments, setNewComments] = useState<Record<number,string>>({})
  const [comments, setComments] = useState<Record<number,{ id: number; content: string }[]>>({})

  if (loading) {
    return <div>Loading proposals…</div>
  }

  return (
    <div className="space-y-6">
      {proposals.map((p: Proposal) => (
        <div key={p.id} className="border p-4 rounded space-y-4">
          <h3 className="font-semibold">{p.title}</h3>
          <p>{p.description}</p>

          {/* Up/Down vote */}
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await vote(p.id, true)
                router.refresh()
              }}
              disabled={isVoting}
              className="btn-sm"
            >
              👍 Upvote
            </button>
            <button
              onClick={async () => {
                await vote(p.id, false)
                router.refresh()
              }}
              disabled={isVoting}
              className="btn-sm"
            >
              👎 Downvote
            </button>
          </div>

          {/* New comment input */}
          <textarea
            value={newComments[p.id] ?? ""}
            onChange={(e) =>
              setNewComments((prev) => ({
                ...prev,
                [p.id]: e.target.value,
              }))
            }
            placeholder="Add a comment…"
            className="input w-full h-16"
          />
          <button
            onClick={() => {
              const text = (newComments[p.id] ?? "").trim()
              if (!text) return
              setComments((prev) => ({
                ...prev,
                [p.id]: [
                  ...(prev[p.id] ?? []),
                  { id: Date.now(), content: text },
                ],
              }))
              setNewComments((prev) => ({ ...prev, [p.id]: "" }))
            }}
            className="btn-sm"
          >
            Comment
          </button>

          {/* Render comments with fact-check */}
          <div className="mt-4 space-y-2">
            {(comments[p.id] ?? []).map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CommentItem({ comment }: { comment: { id: number; content: string } }) {
  const { check, loading, result } = useFactCheck()

  return (
    <div className="p-2 border rounded">
      <p>{comment.content}</p>
      <button
        onClick={() => check(comment.content)}
        disabled={loading}
        className="btn-xs mt-1"
      >
        {loading ? "Checking…" : "Fact Check"}
      </button>
      {result && (
        <p className="italic text-sm">
          {result.verdict} ({result.score.toFixed(2)})
        </p>
      )}
    </div>
  )
}
