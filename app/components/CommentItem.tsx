"use client"
import { useFactCheck } from "../hooks/useFactCheck"

export default function CommentItem({ text }: { text: string }) {
  const { check, loading, result } = useFactCheck()
  return (
    <div className="pl-4 border-l">
      <p>{text}</p>
      <button onClick={() => check(text)} className="text-xs underline">
        Fact Check
      </button>
      {loading && <p className="text-xs">Checking…</p>}
      {result && (
        <p className="text-xs">
          {result.verdict} ({result.score.toFixed(2)})
        </p>
      )}
    </div>
  )
}
