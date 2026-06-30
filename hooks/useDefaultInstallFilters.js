import { useState, useEffect } from "react";

export const DEFAULT_INSTALL_FILTERS = {
  "--scope": "",
  "--interactive": false,
  "--silent": true,
  "--force": false,
};

export async function loadDefaultInstallFilters() {
  try {
    const raw = localStorage.getItem("winstall-default-options");
    if (raw) {
      return { ...DEFAULT_INSTALL_FILTERS, ...JSON.parse(raw) };
    }
  } catch {
    localStorage.removeItem("winstall-default-options");
  }

  return { ...DEFAULT_INSTALL_FILTERS };
}

export default function useDefaultInstallFilters(reloadWhen) {
  const [defaultFilters, setDefaultFilters] = useState(DEFAULT_INSTALL_FILTERS);

  useEffect(() => {
    loadDefaultInstallFilters().then(setDefaultFilters);
  }, [reloadWhen]);

  return defaultFilters;
}
