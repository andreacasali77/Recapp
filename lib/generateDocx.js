/**
 * Generates a Weekly Recap .docx that exactly mirrors the
 * "Template Weekly Recap New.docx" structure and formatting.
 *
 * Key rules extracted from the template:
 *  - Font: Calibri 11pt throughout
 *  - NO bullet/list formatting — all items are plain paragraphs
 *  - Section headers = bold plain paragraphs (no heading style)
 *  - TOTAL lines = bold plain paragraphs
 *  - Empty paragraphs used as spacers between sections
 *  - Pipeline Review sub-headers: "{Country} - Pipeline Review" (bold)
 */

import { mapLabel } from "./labelMap";

// ── Number parser (mirrors parseLine in index.js) ─────────────────────────────

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(.*?)\s*[-–]?\s*([\d][,.\d]*)\s*$/);
  if (!match) return { label: trimmed, amount: null };
  const raw = match[2].replace(/\./g, "").replace(/,/g, "");
  const amount = parseInt(raw, 10);
  const label = match[1].trim().replace(/[-–\t]+$/, "").trim();
  return { label: label || trimmed, amount: isNaN(amount) ? null : amount };
}

function parseSmartField(text) {
  if (!text || !text.trim()) return { rows: [], total: 0 };

  const raw = text
    .split("\n")
    .map(parseLine)
    .filter(Boolean)
    .filter((r) => r.label || r.amount !== null);

  const map = new Map();
  for (const r of raw) {
    const mapped = mapLabel(r.label || "");
    const key = mapped.toUpperCase().replace(/\s+/g, " ").trim();
    if (!map.has(key)) {
      map.set(key, { label: mapped, amount: r.amount || 0, count: 1 });
    } else {
      const entry = map.get(key);
      entry.amount += r.amount || 0;
      entry.count += 1;
    }
  }

  const sorted = Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  const THRESHOLD = 10000;
  const main = [];
  let othersSum = 0;

  for (const e of sorted) {
    if (e.amount < THRESHOLD) {
      othersSum += e.amount;
    } else {
      main.push({ label: e.label, amount: e.amount });
    }
  }

  const rows = [...main];
  if (othersSum > 0) {
    rows.push({ label: "Others", amount: othersSum });
  }

  const total = rows.reduce((s, r) => s + r.amount, 0);
  return { rows, total };
}

function fmt(n) {
  return n.toLocaleString("en-US");
}

// ── Paragraph builders ────────────────────────────────────────────────────────
// All paragraphs use Calibri 11pt (size 22 = half-points), no list numbering.

function blank(docx) {
  return new docx.Paragraph({
    children: [new docx.TextRun({ text: "", font: "Calibri", size: 22 })],
  });
}

function normal(docx, text) {
  return new docx.Paragraph({
    children: [new docx.TextRun({ text, font: "Calibri", size: 22 })],
  });
}

function bold(docx, text) {
  return new docx.Paragraph({
    children: [new docx.TextRun({ text, bold: true, font: "Calibri", size: 22 })],
  });
}

// ── Smart numeric field → paragraphs ─────────────────────────────────────────
// Plain paragraph per row, bold TOTAL line — no bullets.

function smartFieldToParagraphs(docx, text) {
  const { rows, total } = parseSmartField(text);

  if (!rows.length) return [];

  const paras = rows.map((r) => {
    const amtStr = r.amount !== null ? fmt(r.amount) : "";
    const line = r.label && amtStr
      ? `${r.label}: ${amtStr}`
      : r.label || amtStr || "";
    return normal(docx, line);
  });

  if (total > 0) {
    paras.push(bold(docx, `TOTAL: ${fmt(total)}`));
  }

  return paras;
}

// ── Free-text textarea → paragraphs ──────────────────────────────────────────
// Plain paragraph per non-empty line; **text** → bold sub-header.
// No bullet formatting applied.

function parseContent(docx, text) {
  if (!text || !text.trim()) return [];

  const paras = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      paras.push(blank(docx));
      continue;
    }
    // **text** → bold paragraph
    const boldMatch = trimmed.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      paras.push(bold(docx, boldMatch[1]));
      continue;
    }
    // Strip any leading bullet char the user may have typed
    const cleaned = trimmed.replace(/^[-•]\s+/, "");
    paras.push(normal(docx, cleaned));
  }
  return paras;
}

// ── Section builder helper ────────────────────────────────────────────────────

function section(docx, headerText, contentParas) {
  return [
    bold(docx, headerText),
    ...contentParas,
    blank(docx),
  ];
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function generateWordDoc(form) {
  const docx = await import("docx");
  const { Document, Packer } = docx;

  const children = [];

  // Opening
  children.push(normal(docx, "Ciao a tutti."));
  children.push(normal(docx, `Quick recap for this week (W${form.weekNumber}):`));
  children.push(blank(docx));

  // ── Orders Received ─────────────────────────────────────────────────────────
  const ordersParas = smartFieldToParagraphs(docx, form.ordersReceived);
  if (ordersParas.length) {
    children.push(...section(docx, "Orders Received this week (updated to yesterday)", ordersParas));
  }

  // ── Orders Subsidiaries ─────────────────────────────────────────────────────
  const subsOrdersParas = smartFieldToParagraphs(docx, form.ordersSubsidiaries);
  if (subsOrdersParas.length) {
    children.push(...section(docx, "Subsidiaries", subsOrdersParas));
  }

  // ── Sales of the Week ───────────────────────────────────────────────────────
  const salesParas = smartFieldToParagraphs(docx, form.salesOfWeek);
  if (salesParas.length) {
    children.push(...section(docx, "Sales of the Week (updated to yesterday)", salesParas));
  }

  // ── Sales Subsidiaries ──────────────────────────────────────────────────────
  const subsSalesParas = smartFieldToParagraphs(docx, form.salesSubsidiaries);
  if (subsSalesParas.length) {
    children.push(...section(docx, "Sales Subsidiaries", subsSalesParas));
  }

  // ── Main Opportunities WON ──────────────────────────────────────────────────
  const wonParas = parseContent(docx, form.opportunitiesWon);
  if (wonParas.length) {
    children.push(...section(docx, "Main Opportunities WON this week", wonParas));
  }

  // ── Orders Under Discussion ─────────────────────────────────────────────────
  const discussionParas = parseContent(docx, form.ordersUnderDiscussion);
  if (discussionParas.length) {
    children.push(...section(docx, "Orders Under Discussion", discussionParas));
  }

  // ── Sales + Backlog ─────────────────────────────────────────────────────────
  const backlogParas = parseContent(docx, form.salesBacklog);
  if (backlogParas.length) {
    children.push(bold(docx, `Sales + Backlog (APAC including India) Updated to W${form.weekNumber}`));
    children.push(...backlogParas);
    // Template has 6 empty lines after this section
    for (let i = 0; i < 6; i++) children.push(blank(docx));
  }

  // ── Pipeline Reviews & Market Updates ──────────────────────────────────────
  const filledPipelines = (form.pipelineReviews || []).filter(
    (r) => r.content && r.content.trim()
  );

  if (filledPipelines.length > 0) {
    children.push(bold(docx, "Pipeline Reviews & Market Updates"));
    children.push(blank(docx));

    for (const review of filledPipelines) {
      // Header: "Singapore - Pipeline Review" (bold)
      const header = review.country
        ? `${review.country} - Pipeline Review`
        : "Pipeline Review";
      children.push(bold(docx, header));

      const contentParas = parseContent(docx, review.content);
      children.push(...contentParas);
      children.push(blank(docx));
    }
  }

  // ── Extra sections (Meeting Notes, etc.) ───────────────────────────────────
  for (const sec of form.extraSections || []) {
    if (!sec.title.trim() && !sec.content.trim()) continue;
    if (sec.title.trim()) children.push(bold(docx, sec.title.trim()));
    const contentParas = parseContent(docx, sec.content);
    children.push(...contentParas);
    children.push(blank(docx));
  }

  // ── Build document ─────────────────────────────────────────────────────────
  // No numbering config needed — zero bullet lists in this template.
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Weekly_Recap_W${form.weekNumber}_${form.date}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
