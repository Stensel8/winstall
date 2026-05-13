export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const installBase = process.env.WINSTALL_INSTALLER_BASE;

  if (!installBase) {
    return res.status(500).json({ error: 'Installer service not configured' });
  }

  const url = `${installBase}/installer`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get('content-type');

    // If response is binary (installer file), stream it back
    if (contentType?.includes('application/octet-stream')) {
      const buffer = await response.arrayBuffer();

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', response.headers.get('content-disposition') || 'attachment; filename="installer.exe"');
      res.setHeader('Content-Length', buffer.byteLength);

      return res.status(200).send(Buffer.from(buffer));
    }

    // Otherwise, return as JSON (error message)
    const data = await response.text();
    try {
      const json = JSON.parse(data);
      return res.status(response.status).json(json);
    } catch {
      return res.status(response.status).json({ error: data || 'Installer service error' });
    }
  } catch (error) {
    console.error('[Installer API] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
