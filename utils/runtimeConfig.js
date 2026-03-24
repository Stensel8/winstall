export const getRuntimeConfig = async () => {
  if (typeof window === 'undefined') {
    // Server-side: getStaticProps and direct API access
    return {
      apiBase: process.env.WINSTALL_API_BASE || '',
      apiKey: process.env.WINSTALL_API_KEY || '',
      apiSecret: process.env.WINSTALL_API_SECRET || '',
    };
  }

  // Client-side: fetchWinstallAPI calls this but uses proxy, apiBase not used
  // Return empty for safety - icons pre-rendered, API calls go through proxy
  return {
    apiBase: '',
    apiKey: '',
    apiSecret: '',
  };
};
