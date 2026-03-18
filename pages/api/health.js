// Health check endpoint for Docker containers
export default function handler(req, res) {
  // Simple health check - returns 200 if the server is running
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
}
