import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pipelineNotes, country, weekNumber } = req.body;

  if (!pipelineNotes?.trim()) {
    return res.status(400).json({ error: "No pipeline notes provided" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set. Add it to .env.local" });
  }

  try {
    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are a professional APAC sales business writer producing weekly executive recap emails for Technogym.

Your job: take raw pipeline review notes for a specific market and rewrite them into a clean, professional business summary.

STRICT OUTPUT FORMAT:
- Write one plain-text line per deal or topic — no bullet points, no dashes, no asterisks, no markdown
- Each line: account name + current status + key next step + amount if mentioned
- Keep each line concise and factual (1-2 sentences max)
- Use direct business English — no filler words, no intro, no outro
- Do NOT invent facts, numbers, or deals not present in the input
- Do NOT include any country or market header — only the content lines
- Output ONLY the plain text lines, nothing else`,
        },
        {
          role: "user",
          content: `Summarise these pipeline review notes for ${country || "this market"} (W${weekNumber}) into plain professional lines:\n\n${pipelineNotes}`,
        },
      ],
    });

    const enhanced = response.choices[0]?.message?.content ?? pipelineNotes;
    return res.status(200).json({ enhanced });
  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: err.message ?? "API error" });
  }
}
