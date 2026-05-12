export default function LogoPreview() {
  return (
    <div style={{ background: "#f0f2f6", minHeight: "100vh", padding: "48px 40px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <h2 style={{ color: "#8892a4", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 40 }}>RecapHQ — Logo Concepts</h2>

      {/* ── CONCEPT 1 — Wordmark ── */}
      <div style={{ background: "white", borderRadius: 16, padding: "40px 48px", marginBottom: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <p style={{ color: "#8892a4", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 28 }}>Concept A — Wordmark</p>
        <div style={{ display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
          {/* On white */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <svg width="220" height="52" viewBox="0 0 220 52" fill="none">
              <text x="0" y="38" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="36" fontWeight="800" letterSpacing="-1" fill="#1a2357">RECAP</text>
              <text x="148" y="38" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="36" fontWeight="800" letterSpacing="-1" fill="#f7c800">HQ</text>
              <rect x="0" y="45" width="195" height="3" rx="1.5" fill="#f7c800" opacity="0.4"/>
            </svg>
          </div>
          {/* On dark */}
          <div style={{ background: "#1a2357", borderRadius: 12, padding: "16px 28px", display: "flex", alignItems: "center" }}>
            <svg width="220" height="52" viewBox="0 0 220 52" fill="none">
              <text x="0" y="38" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="36" fontWeight="800" letterSpacing="-1" fill="white">RECAP</text>
              <text x="148" y="38" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="36" fontWeight="800" letterSpacing="-1" fill="#f7c800">HQ</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── CONCEPT 2 — Icon + Wordmark ── */}
      <div style={{ background: "white", borderRadius: 16, padding: "40px 48px", marginBottom: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <p style={{ color: "#8892a4", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 28 }}>Concept B — Icon + Wordmark</p>
        <div style={{ display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
          {/* On white */}
          <svg width="260" height="56" viewBox="0 0 260 56" fill="none">
            {/* Icon: document with lines */}
            <rect x="0" y="4" width="42" height="48" rx="6" fill="#1a2357"/>
            <rect x="8" y="16" width="26" height="3" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="8" y="24" width="20" height="3" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="8" y="32" width="23" height="3" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="8" y="40" width="16" height="3" rx="1.5" fill="#f7c800"/>
            {/* Text */}
            <text x="54" y="40" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="30" fontWeight="700" letterSpacing="-0.5" fill="#1a2357">Recap</text>
            <text x="172" y="40" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="30" fontWeight="800" fill="#f7c800">HQ</text>
          </svg>
          {/* On dark */}
          <div style={{ background: "#1a2357", borderRadius: 12, padding: "16px 28px" }}>
            <svg width="260" height="56" viewBox="0 0 260 56" fill="none">
              <rect x="0" y="4" width="42" height="48" rx="6" fill="white" opacity="0.1"/>
              <rect x="8" y="16" width="26" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="8" y="24" width="20" height="3" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="8" y="32" width="23" height="3" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="8" y="40" width="16" height="3" rx="1.5" fill="#f7c800"/>
              <text x="54" y="40" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="30" fontWeight="700" letterSpacing="-0.5" fill="white">Recap</text>
              <text x="172" y="40" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="30" fontWeight="800" fill="#f7c800">HQ</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── CONCEPT 3 — Badge ── */}
      <div style={{ background: "white", borderRadius: 16, padding: "40px 48px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <p style={{ color: "#8892a4", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 28 }}>Concept C — Badge + Wordmark</p>
        <div style={{ display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
          {/* On white */}
          <svg width="280" height="64" viewBox="0 0 280 64" fill="none">
            {/* Badge */}
            <rect x="0" y="0" width="64" height="64" rx="14" fill="#1a2357"/>
            <text x="10" y="42" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="28" fontWeight="900" fill="white">Re</text>
            <rect x="10" y="46" width="44" height="4" rx="2" fill="#f7c800"/>
            {/* Text */}
            <text x="80" y="30" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="13" fontWeight="600" letterSpacing="3" fill="#8892a4">WEEKLY</text>
            <text x="80" y="56" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="24" fontWeight="800" letterSpacing="-0.5" fill="#1a2357">RecapHQ</text>
          </svg>
          {/* On dark */}
          <div style={{ background: "#1a2357", borderRadius: 12, padding: "16px 28px" }}>
            <svg width="280" height="64" viewBox="0 0 280 64" fill="none">
              <rect x="0" y="0" width="64" height="64" rx="14" fill="#f7c800"/>
              <text x="10" y="42" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="28" fontWeight="900" fill="#1a2357">Re</text>
              <rect x="10" y="46" width="44" height="4" rx="2" fill="#1a2357" opacity="0.3"/>
              <text x="80" y="30" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="13" fontWeight="600" letterSpacing="3" fill="rgba(255,255,255,0.5)">WEEKLY</text>
              <text x="80" y="56" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="24" fontWeight="800" letterSpacing="-0.5" fill="white">RecapHQ</text>
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}
