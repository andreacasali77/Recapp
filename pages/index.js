import { useState } from "react";
import Head from "next/head";
import { generateWordDoc } from "../lib/generateDocx";
import { mapLabel } from "../lib/labelMap";

// ── Helpers ──────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function currentWeekNumber() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diff = now - startOfYear + (startOfYear.getDay() + 6) % 7 * 86400000;
  return Math.ceil(diff / (7 * 86400000)).toString();
}

export function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(.*?)\s*[-–]?\s*([\d][,.\d]*)\s*$/);
  if (!match) return { label: trimmed, amount: null };
  const raw = match[2].replace(/\./g, "").replace(/,/g, "");
  const amount = parseInt(raw, 10);
  const label = match[1].trim().replace(/[-–\t]+$/, "").trim();
  return { label: label || trimmed, amount: isNaN(amount) ? null : amount };
}

export function parseSmartField(text) {
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
      main.push({ label: e.label, amount: e.amount, isSubtotal: e.count > 1 });
    }
  }

  const rows = [...main];
  if (othersSum > 0) {
    rows.push({ label: "Others", amount: othersSum, isSubtotal: false, isOthers: true });
  }

  const total = rows.reduce((s, r) => s + r.amount, 0);
  return { rows, total };
}

function formatNumber(n) {
  return n.toLocaleString("en-US");
}

// ── Countries list — APAC, Oceania, Indian Subcontinent ──────────────────────

const COUNTRIES = [
  // Indian Subcontinent
  "Bangladesh",
  "Bhutan",
  "India",
  "Maldives",
  "Nepal",
  "Pakistan",
  "Sri Lanka",
  // Southeast Asia
  "Brunei",
  "Cambodia",
  "Evolution Wellness Malaysia",
  "Evolution Wellness Philippines",
  "Evolution Wellness Singapore",
  "Evolution Wellness Thailand",
  "Indonesia",
  "Laos",
  "Malaysia",
  "Myanmar",
  "Philippines",
  "Singapore",
  "Thailand",
  "Timor-Leste",
  "Vietnam",
  // East Asia
  "China",
  "Hong Kong",
  "Japan",
  "Korea",
  "Macau",
  "Mongolia",
  "Taiwan",
  // Oceania
  "Australia",
  "Fiji",
  "New Zealand",
  "Papua New Guinea",
  "Samoa",
  "Solomon Islands",
  "Tonga",
  "Vanuatu",
  // Brand groups
  "Virgin Active Singapore",
  "Virgin Active Thailand",
];

const NUM_PIPELINE_REVIEWS = 7;

function makePipeline() {
  return { country: "", content: "" };
}

// ── SmartNumericField ─────────────────────────────────────────────────────────

function SmartNumericField({ value, onChange, error, placeholder }) {
  const { rows, total } = parseSmartField(value);
  const hasData = rows.some((r) => r.label || r.amount !== null);

  return (
    <div className={`smart-field${error ? " has-error" : ""}`}>
      <div className="field-textarea-wrap">
        <textarea
          className={`field-textarea smart-textarea${error ? " has-error" : ""}`}
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
        {value && (
          <button className="btn-clear-field" onClick={() => onChange("")} title="Clear field">✕</button>
        )}
      </div>

      {hasData && (
        <div className="smart-preview">
          <div className="smart-rows">
            {rows.map((r, i) => (
              <div key={i} className={`smart-row${r.isSubtotal ? " smart-row--subtotal" : ""}${r.isOthers ? " smart-row--others" : ""}`}>
                <span className="smart-label">{r.label || "—"}</span>
                {r.isSubtotal && <span className="smart-subtotal-badge">subtotal</span>}
                <span className="smart-amount">
                  {r.amount !== null ? formatNumber(r.amount) : ""}
                </span>
              </div>
            ))}
          </div>
          <div className="smart-total">
            <span className="smart-total-label">TOTAL</span>
            <span className="smart-total-value">{formatNumber(total)}</span>
          </div>
        </div>
      )}

      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}

// ── PipelineReviewField ───────────────────────────────────────────────────────

function PipelineReviewField({ index, value, onChange }) {
  const label = index === 0 ? "Pipeline Review" : `Pipeline Review ${index + 1}`;

  return (
    <div className="pipeline-block">
      <div className="pipeline-block-header">
        <span className="pipeline-block-label">{label}</span>
        <select
          className="pipeline-country-select"
          value={value.country}
          onChange={(e) => onChange({ ...value, country: e.target.value })}
        >
          <option value="">— Select country / market —</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="field-textarea-wrap">
        <textarea
          className="field-textarea pipeline-textarea"
          rows={5}
          placeholder={"Paste raw notes per questo mercato…\n\nEs: 24h fitness proposal 200K in attesa. Konami 150K trattativa in corso."}
          value={value.content}
          onChange={(e) => onChange({ ...value, content: e.target.value })}
        />
        {value.content && (
          <button className="btn-clear-field" onClick={() => onChange({ ...value, content: "" })} title="Clear field">✕</button>
        )}
      </div>
    </div>
  );
}

// ── Initial state ─────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  date: todayISO(),
  weekNumber: currentWeekNumber(),
  ordersReceived: "",
  ordersSubsidiaries: "",
  salesOfWeek: "",
  salesSubsidiaries: "",
  opportunitiesWon: "",
  ordersUnderDiscussion: "",
  salesBacklog: "",
  pipelineReviews: Array.from({ length: NUM_PIPELINE_REVIEWS }, makePipeline),
  extraSections: [],
};

// ── Main component ────────────────────────────────────────────────────────────

export default function Home() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [generating, setGenerating] = useState(false);
  const [generateStatus, setGenerateStatus] = useState(""); // progress message
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
    setShowValidation(false);
  };

  const updatePipeline = (idx, value) => {
    setForm((prev) => {
      const reviews = [...prev.pipelineReviews];
      reviews[idx] = value;
      return { ...prev, pipelineReviews: reviews };
    });
  };

  const addSection = () =>
    setForm((prev) => ({
      ...prev,
      extraSections: [...prev.extraSections, { id: Date.now(), title: "", content: "" }],
    }));

  const removeSection = (id) =>
    setForm((prev) => ({
      ...prev,
      extraSections: prev.extraSections.filter((s) => s.id !== id),
    }));

  const updateSection = (id, field, value) =>
    setForm((prev) => ({
      ...prev,
      extraSections: prev.extraSections.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));

  const handleReset = () => {
    if (window.confirm("Reset all fields? This cannot be undone.")) {
      setForm(EMPTY_FORM);
      setErrors({});
      setShowValidation(false);
      setGenerateStatus("");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.weekNumber.trim()) newErrors.weekNumber = "Required";
    if (!form.ordersReceived.trim()) newErrors.ordersReceived = "Required";
    if (!form.salesOfWeek.trim()) newErrors.salesOfWeek = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) { setShowValidation(true); return; }
    setGenerating(true);
    setGenerateStatus("");

    try {
      // Enhance filled pipeline reviews with AI before generating the doc
      const reviews = form.pipelineReviews;
      const enhancedReviews = [...reviews];
      const toEnhance = reviews
        .map((r, i) => ({ ...r, idx: i }))
        .filter((r) => r.content.trim());

      for (let i = 0; i < toEnhance.length; i++) {
        const review = toEnhance[i];
        setGenerateStatus(
          `AI: elaboro Pipeline Review${review.country ? ` ${review.country}` : ` ${review.idx + 1}`} (${i + 1}/${toEnhance.length})…`
        );
        try {
          const res = await fetch("/api/enhance-pipeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pipelineNotes: review.content,
              country: review.country,
              weekNumber: form.weekNumber,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Enhancement failed");
          enhancedReviews[review.idx] = { country: review.country, content: data.enhanced };
        } catch (err) {
          console.warn(`Pipeline Review ${review.idx + 1} enhancement failed:`, err.message);
          // Keep original content on failure — don't block doc generation
        }
      }

      setGenerateStatus("Genero il documento Word…");
      await generateWordDoc({ ...form, pipelineReviews: enhancedReviews });
      setGenerateStatus("");
    } catch (err) {
      console.error("Document generation error:", err);
      alert("Errore nella generazione del documento. Vedi console per dettagli.");
      setGenerateStatus("");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>RecApp</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="header">
        <img src="/logo-recapp.png" alt="RecApp" className="header-logo" />
      </div>

      <main className="main">
        <div className="card">

          {showValidation && Object.keys(errors).length > 0 && (
            <div className="validation-banner">
              Please fill in the required fields before generating the report.
            </div>
          )}

          {/* ── Report details ── */}
          <p className="section-title">Report Details</p>

          <div className="field-row">
            <label className="field-label">Date</label>
            <div className="field-input-wrap">
              <input
                type="date"
                className="input-short"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
          </div>

          <div className="field-row">
            <label className="field-label">Week n.</label>
            <div className="field-input-wrap">
              <input
                type="text"
                className={`input-short${errors.weekNumber ? " has-error" : ""}`}
                placeholder="e.g. 16"
                value={form.weekNumber}
                onChange={(e) => updateField("weekNumber", e.target.value)}
              />
              {errors.weekNumber && <span className="error-msg">{errors.weekNumber}</span>}
              <span className="field-hint">
                Appears as "Quick recap for this week (W{form.weekNumber || "…"})"
              </span>
            </div>
          </div>

          <hr className="divider" />

          {/* ══ ORDERS ══════════════════════════════════════════════════════ */}
          <div className="section-header section-header--orders">ORDERS</div>
          <p className="section-desc">
            Paste directly from Excel — one entry per line, number at the end.&nbsp;
            <code>HOME GENE PLUS INTERNATIONAL&nbsp;&nbsp;79,536</code>
          </p>

          <div className="field-row">
            <label className="field-label">
              Orders Received this week <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <div className="field-input-wrap">
              <SmartNumericField
                value={form.ordersReceived}
                onChange={(v) => updateField("ordersReceived", v)}
                error={errors.ordersReceived}
                placeholder={"Paste from Excel:\nHOME GENE PLUS INTERNATIONAL\t79,536\nFOCUS GLOBAL, INC\t2,484\nCONCEPT FITNESS SYSTEMS LTD\t1,669"}
              />
            </div>
          </div>

          <div className="field-row">
            <label className="field-label">Orders Subsidiaries</label>
            <div className="field-input-wrap">
              <SmartNumericField
                value={form.ordersSubsidiaries}
                onChange={(v) => updateField("ordersSubsidiaries", v)}
                placeholder={"Paste from Excel:\nEVOLUTION WELLNESS SINGAPORE\t45,000\nVIRGIN ACTIVE THAILAND\t32,000"}
              />
            </div>
          </div>

          {/* ══ SALES ════════════════════════════════════════════════════════ */}
          <div className="section-header section-header--sales">SALES</div>

          <div className="field-row">
            <label className="field-label">
              Sales of the Week <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <div className="field-input-wrap">
              <SmartNumericField
                value={form.salesOfWeek}
                onChange={(v) => updateField("salesOfWeek", v)}
                error={errors.salesOfWeek}
                placeholder={"Paste from Excel:\nKOREA DISTRIBUTOR\t180,000\nJAPAN PARTNER\t95,000\nOthers\t12,450"}
              />
            </div>
          </div>

          <div className="field-row">
            <label className="field-label">Sales Subsidiaries</label>
            <div className="field-input-wrap">
              <SmartNumericField
                value={form.salesSubsidiaries}
                onChange={(v) => updateField("salesSubsidiaries", v)}
                placeholder={"Paste from Excel:\nEVOLUTION WELLNESS MALAYSIA\t28,000\nVIRGIN ACTIVE SINGAPORE\t19,500"}
              />
            </div>
          </div>

          {/* ══ WEEKLY DATA ══════════════════════════════════════════════════ */}
          <div className="section-header section-header--data">WEEKLY DATA</div>

          {[
            {
              key: "opportunitiesWon",
              label: "Main Opportunities Won",
              hint: "Deal A – Korea: 150K Sell Out\nDeal B – Japan: 80K Sell Out",
              rows: 4,
            },
            {
              key: "ordersUnderDiscussion",
              label: "Orders Under Discussion",
              hint: "Deal C: in Negotiation (200K Sell In)\nDeal D: pending PO signature (90K)",
              rows: 4,
            },
            {
              key: "salesBacklog",
              label: "Sales + Backlog",
              hint: "3,200,000 Euro (+5.2% vs PY)",
              rows: 2,
            },
          ].map((f) => (
            <div className="field-row" key={f.key}>
              <label className="field-label">{f.label}</label>
              <div className="field-input-wrap">
                <div className="field-textarea-wrap">
                  <textarea
                    className="field-textarea"
                    rows={f.rows}
                    placeholder={f.hint}
                    value={form[f.key]}
                    onChange={(e) => updateField(f.key, e.target.value)}
                  />
                  {form[f.key] && (
                    <button className="btn-clear-field" onClick={() => updateField(f.key, "")} title="Clear field">✕</button>
                  )}
                </div>
                <span className="field-hint">Each line → bullet point in the Word document</span>
              </div>
            </div>
          ))}

          {/* ══ PIPELINE REVIEWS ═════════════════════════════════════════════ */}
          <div className="section-header section-header--pipeline">PIPELINE REVIEWS</div>

          <p className="pipeline-ai-note">
            ✦ Le Pipeline Reviews verranno rielaborate automaticamente da Claude AI al momento della generazione del documento.
          </p>

          <div className="pipeline-reviews-list">
            {form.pipelineReviews.map((review, idx) => (
              <PipelineReviewField
                key={idx}
                index={idx}
                value={review}
                onChange={(v) => updatePipeline(idx, v)}
              />
            ))}
          </div>

          <hr className="divider" />

          {/* ── Additional Sections ── */}
          <p className="section-title">Additional Sections</p>

          {form.extraSections.length > 0 && (
            <div className="extra-sections">
              {form.extraSections.map((section) => (
                <div key={section.id} className="extra-section">
                  <div className="extra-section-header">
                    <input
                      type="text"
                      className="extra-title-input"
                      placeholder="Section Title"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, "title", e.target.value)}
                    />
                    <button className="btn-remove" onClick={() => removeSection(section.id)}>
                      Remove
                    </button>
                  </div>
                  <textarea
                    className="field-textarea"
                    rows={4}
                    placeholder="Section content…"
                    value={section.content}
                    onChange={(e) => updateSection(section.id, "content", e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <button className="btn-add" onClick={addSection}>+ Add Section</button>

          <hr className="divider" />

          {/* ── Actions ── */}
          <div className="actions">
            <div className="generate-wrap">
              <button
                className="btn-generate"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating
                  ? <><span className="generate-spinner" />{generateStatus || "Elaborazione…"}</>
                  : "⬇ Genera Word Report"}
              </button>
            </div>
            <button className="btn-reset" onClick={handleReset}>Reset Form</button>
          </div>

        </div>
      </main>
    </>
  );
}
