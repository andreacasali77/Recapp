/**
 * Maps raw company/client names (normalised: uppercase, collapsed whitespace)
 * to their display label used in both the form preview and the Word document.
 *
 * Keys   → uppercase + trimmed version of whatever is pasted
 * Values → the label that replaces it (triggering auto-grouping when shared)
 */
export const LABEL_MAP = {
  "AUTO MUSEUM LTD.":                                    "BANGLADESH",
  "M.W. METROPOLITAN INTERNATIONAL BRANDS CO. LTD.":    "CAMBODIA",
  "EXERTAINMENT MALAYSIA SDN BHD":                       "EVOLUTION WELLNESS MALAYSIA",
  "SPORTATHLON MALAYSIA SDN BHD (550283-H)":             "EVOLUTION WELLNESS MALAYSIA",
  "FITNESS FIRST SINGAPORE PTE LTD":                    "EVOLUTION WELLNESS SINGAPORE",
  "FITNESS FIRST PARAGON":                               "EVOLUTION WELLNESS SINGAPORE",
  "EVOLUTION WELLNESS (THAILAND) LTD":                   "EVOLUTION WELLNESS THAILAND",
  "TRINITY HEALTH TECHNOLOGIES PVT.LTD":                 "INDIA",
  "TRINITY HEALTHTECH A DIV (T.H.T.P.L)":               "INDIA",
  "PT. PRASETIA QUBE WELLNESS":                          "INDONESIA",
  "GALAXIA SM INC":                                      "KOREA",
  "SE ACTIVE SDN. BHD.":                                "MALAYSIA",
  "TROPICAL FITNESS PVT LTD":                           "MALDIVES",
  "CONCEPT FITNESS SYSTEMS LTD":                         "NEW ZEALAND",
  "SYNERGY TECHNOLOGIES":                                "PAKISTAN",
  "EVOLUTION WELLNESS PHILIPPINES INC.":                 "EVOLUTION WELLNESS PHILIPPINES",
  "FOCUS GLOBAL, INC":                                   "PHILIPPINES",
  "SE ACTIVE PTE. LTD.":                                "SINGAPORE",
  "HARI FITNESS PVT LTD.":                              "SRI LANKA",
  "HOME GENE PLUS INTERNATIONAL":                        "TAIWAN",
  "EURO CREATIONS PUBLIC COMPANY LIMITED":               "THAILAND",
  "VIRGIN ACTIVE SINGAPORE - HOLLAND VILLAGE":           "VIRGIN ACTIVE SINGAPORE",
  "VIRGIN ACTIVE SINGAPORE - MARINA ONE":                "VIRGIN ACTIVE SINGAPORE",
  "VIRGIN ACTIVE SINGAPORE - PAYA LEBAR":                "VIRGIN ACTIVE SINGAPORE",
  "VIRGIN ACTIVE SINGAPORE - RAFFLES PLACE":             "VIRGIN ACTIVE SINGAPORE",
  "VIRGIN ACTIVE SINGAPORE PTE LTD LTD":                 "VIRGIN ACTIVE SINGAPORE",
  "VIRGIN ACTIVE (THAILAND) LIMITED -(THE HEAD OFFICE)": "VIRGIN ACTIVE THAILAND",
};

/**
 * Returns the mapped label for a raw name, or the original if no match.
 * Matching is case-insensitive and ignores extra whitespace.
 */
export function mapLabel(raw) {
  if (!raw) return raw;
  const key = raw.toUpperCase().replace(/\s+/g, " ").trim();
  return LABEL_MAP[key] ?? raw;
}
