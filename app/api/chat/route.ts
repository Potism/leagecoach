import { OpenAI } from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json({ response: response.choices[0].message })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return NextResponse.json({ error: "Failed to get coaching advice" }, { status: 500 })
  }
}