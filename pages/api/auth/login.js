export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  const validEmail    = process.env.AUTH_EMAIL;
  const validPassword = process.env.AUTH_PASSWORD;
  const secret        = process.env.AUTH_SECRET;

  if (
    email?.toLowerCase().trim() === validEmail?.toLowerCase() &&
    password === validPassword
  ) {
    // Set secure HTTP-only cookie valid for 7 days
    res.setHeader(
      "Set-Cookie",
      `recaphq-auth=${secret}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: "Email o password non corretti." });
}
