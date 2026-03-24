// Returns non-sensitive runtime config for client-side use
// Only returns API base URL for icon loading
export default async function handler(req, res) {
  const apiBase = process.env.WINSTALL_API_BASE || '';

  res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
  res.status(200).json({ apiBase });
}
