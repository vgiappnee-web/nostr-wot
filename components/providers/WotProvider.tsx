"use client";

import { WoTProvider as SDKWoTProvider } from "nostr-wot-sdk/react";
import { ReactNode, useMemo } from "react";

// Extension IDs
const DEV_EXTENSION_ID = "ehhdbbkphncmcpkpeobbbgjnpcfjeamc"; // Development/testing
const PROD_EXTENSION_ID = ""; // TODO: Add production extension ID when published

interface WotProviderProps {
  children: ReactNode;
}

/**
 * WoT SDK Provider wrapper.
 * This "use client" boundary is required for Next.js to use the SDK's React provider.
 * The SDK handles extension detection and connection automatically.
 */
export function WotProvider({ children }: WotProviderProps) {
  const options = useMemo(() => {
    // Use dev extension ID in localhost, production ID otherwise
    const isLocalhost = typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    const extensionId = isLocalhost ? DEV_EXTENSION_ID : PROD_EXTENSION_ID;

    return extensionId ? { extensionId } : undefined;
  }, []);

  return <SDKWoTProvider options={options}>{children}</SDKWoTProvider>;
}
