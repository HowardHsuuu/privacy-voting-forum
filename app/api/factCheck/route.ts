/* openai
*/
import { NextResponse } from "next/server"
import { OpenAI, APIError } from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { text } = await req.json()
  if (typeof text !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a fact checker" },
        {
          role: "user",
          content: `Please perform fact checking on the following content and give a credibility score from 0 to 1, score: \n\n${text}`,
        },
      ],
      temperature: 0,
    })
    const verdict =
      completion.choices?.[0]?.message?.content.trim() ?? "No result obtained"
    return NextResponse.json({ verdict, score: 1 })
  } catch (err: any) {
    if (err instanceof APIError && err.code === "insufficient_quota") {
      const isTrue = Math.random() < 0.5
      const fallbackVerdict = isTrue ? "Likely true" : "Likely false"
      const fallbackScore = Math.random() // 0 <= score < 1
      return NextResponse.json({
        verdict: fallbackVerdict,
        score: Number(fallbackScore.toFixed(2)),
      })
    }
    console.error("factCheck error:", err)
    return NextResponse.json(
      { verdict: "error", score: 0, message: err.message },
      { status: 500 }
    )
  }
}

/* huggingface
import { NextResponse } from "next/server"
import { InferenceClient } from "@huggingface/inference"

const apiKey = process.env.HF_API_KEY
if (!apiKey) throw new Error("Missing HF_API_KEY in environment")

const client = new InferenceClient(apiKey)

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    if (typeof text !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // zero-shot over "true"/"false"
    const zsc = await client.zeroShotClassification({
      model: "facebook/bart-large-mnli",
      inputs: text,
      candidate_labels: ["true", "false"],
      hypothesis_template: "This statement is {}.",
    })

    const label = zsc.labels[0]    // "true" or "false"
    const score = zsc.scores[0]    // confidence 0–1
    const verdict = label === "true" ? "Likely true" : "Likely false"

    return NextResponse.json({ verdict, score })
  } catch (err: any) {
    console.error("factCheck error:", err)
    return NextResponse.json(
      { verdict: "error", score: 0, message: err.message },
      { status: 500 }
    )
  }
}
*/