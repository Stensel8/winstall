export const getRuntimeConfig = async () => {
  if (typeof window === 'undefined') {
    // Server-side: use env directly
    return {
      apiBase: process.env.WINSTALL_API_BASE || '',
      apiKey: process.env.WINSTALL_API_KEY || '',
      apiSecret: process.env.WINSTALL_API_SECRET || '',
    };
  }

  // Client-side: use universal proxy (no credentials needed)
  return {
    apiBase: '/api/winstall',
    apiKey: '',
    apiSecret: '',
  };
};
