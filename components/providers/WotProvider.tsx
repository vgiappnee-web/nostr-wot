"use client";

import { WoTProvider as SDKWoTProvider } from "nostr-wot-sdk/react";
import { ReactNode } from "react";

interface WotProviderProps {
  children: ReactNode;
}

export function WotProvider({ children }: WotProviderProps) {
  return (
    <SDKWoTProvider>
      {children}
    </SDKWoTProvider>
  );
}
