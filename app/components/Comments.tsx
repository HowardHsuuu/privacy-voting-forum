"use client"
import { useState } from "react"
import CommentItem from "./CommentItem"

export default function Comments() {
  const [comments, setComments] = useState<string[]>([])
  const [input, setInput] = useState("")

  const add = () => {
    if (!input.trim()) return
    setComments((c) => [...c, input.trim()])
    setInput("")
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write comment…"
          className="input flex-1"
        />
        <button onClick={add} className="btn-sm">
          Post
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {comments.map((text, i) => (
          <CommentItem key={i} text={text} />
        ))}
      </div>
    </div>
  )
}
