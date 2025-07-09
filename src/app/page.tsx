'use client';

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Home() {
  const [responseA, setResponseA] = useState("")
  const [responseB, setResponseB] = useState("")
  const [comparisonResult, setComparisonResult] = useState("")
  const [loading, setLoading] = useState(false)

  const compareResponses = async () => {
    setLoading(true)
    setComparisonResult("")

    const res = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responseA, responseB }),
    })

    const data = await res.json()
    setComparisonResult(data.result)
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 AI Response Comparator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Response A */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-center">Response A</h2>
          <Textarea
            value={responseA}
            onChange={(e) => setResponseA(e.target.value)}
            placeholder="Paste AI response A here..."
            className="h-40"
          />
        </div>

        {/* Response B */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-center">Response B</h2>
          <Textarea
            value={responseB}
            onChange={(e) => setResponseB(e.target.value)}
            placeholder="Paste AI response B here..."
            className="h-40"
          />
        </div>
      </div>

      {/* Compare Button */}
      <div className="mt-6 flex gap-4">
        <Button onClick={compareResponses} disabled={loading}>
          {loading ? "Comparing..." : "Compare with AI"}
        </Button>
      </div>

      {/* Result */}
      {comparisonResult && (
        <div className="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-xl max-w-2xl text-center">
          {comparisonResult}
        </div>
      )}
    </main>
  )
}
