export const DEFAULT_INSTALL_FILTERS = {
  "--scope": "",
  "--interactive": false,
  "--silent": true,
  "--force": false,
};

export async function loadDefaultInstallFilters() {
  if (typeof window === "undefined") {
    return { ...DEFAULT_INSTALL_FILTERS };
  }

  try {
    const stored = await localStorage.getItem("winstall-default-options");
    if (stored) {
      return { ...DEFAULT_INSTALL_FILTERS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore invalid localStorage data
  }

  return { ...DEFAULT_INSTALL_FILTERS };
}
