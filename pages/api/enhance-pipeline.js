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

Your job: take raw pipeline review notes and rewrite them as a structured list of concise professional updates.

STRICT OUTPUT FORMAT — follow exactly:
- Each deal or topic MUST be written on its own separate line, separated by a newline character
- NEVER combine multiple topics into one paragraph — one line per topic, always
- Each line format: Account Name: current status, key next step, amount if mentioned
- Maximum 2 sentences per line
- No bullet points, no dashes, no asterisks, no numbering, no markdown
- No intro, no outro, no section headers
- Do NOT invent facts, numbers, or deals not in the input

CORRECT example output:
Galaxia SM Inc: proposal for 150K Sell In submitted, awaiting client response by end of week.
Anytime Fitness Seoul: quotation sent with 30% discount, follow-up call scheduled for Monday.
One Bangkok: closing delayed to June due to joint venture contract finalisation, projected value 25-30M THB.

WRONG example output (do not do this):
The facility uses a CRM for membership management. The Hip Thrust machine is a competitive advantage. A suggestion was made to propose standing abductor.`,
        },
        {
          role: "user",
          content: `Summarise these pipeline review notes for ${country || "this market"} (W${weekNumber}). Output each topic on a separate line:\n\n${pipelineNotes}`,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? pipelineNotes;

    // Safety net: if AI returned a single block paragraph, split by sentence boundaries
    const lines = raw.split("\n").filter(l => l.trim());
    let enhanced;
    if (lines.length <= 1) {
      // Split by ". " followed by a capital letter
      enhanced = raw
        .replace(/\.\s+([A-Z])/g, ".\n$1")
        .trim();
    } else {
      enhanced = lines.join("\n");
    }

    return res.status(200).json({ enhanced });
  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: err.message ?? "API error" });
  }
}
