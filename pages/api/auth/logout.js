export default function handler(req, res) {
  res.setHeader("Set-Cookie", [
    "recapp-auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
    "recapp-auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure",
  ]);
  res.status(200).json({ ok: true });
}
