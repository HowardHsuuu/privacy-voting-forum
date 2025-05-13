// app/hooks/useFactCheck.ts
"use client"

import { useState } from "react"

export interface FactCheckResult {
  verdict: string
  score: number
}

export function useFactCheck() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FactCheckResult | null>(null)

  const check = async (text: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/factCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json() as FactCheckResult
      setResult(json)
    } catch (err) {
      console.error("FactCheck error", err)
      setResult({ verdict: "Error", score: 0 })
    } finally {
      setLoading(false)
    }
  }

  return { check, loading, result }
}
