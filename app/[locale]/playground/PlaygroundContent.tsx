"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Badge } from "@/components/ui";
import { useNostrAuth } from "@/contexts/NostrAuthContext";
import { LoginModal, ConnectModal } from "@/components/auth";
import { GraphPlayground } from "@/components/playground";

export default function PlaygroundContent() {
  const t = useTranslations("playground");
  const { user, logout } = useNostrAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [hasSeenConnectModal, setHasSeenConnectModal] = useState(false);

  // Show connect modal automatically if user is not logged in
  useEffect(() => {
    if (!user?.pubkey && !hasSeenConnectModal) {
      setIsConnectModalOpen(true);
    }
  }, [user?.pubkey, hasSeenConnectModal]);

  const handleOpenModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleCloseConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
    setHasSeenConnectModal(true);
  }, []);

  const handleConnectFromModal = useCallback(() => {
    setIsConnectModalOpen(false);
    setHasSeenConnectModal(true);
    setIsLoginModalOpen(true);
  }, []);

  const formatPubkey = (pk: string) => {
    return `${pk.slice(0, 8)}...${pk.slice(-8)}`;
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "extension":
        return "Extension";
      case "nsec":
        return "Private Key";
      case "npub":
        return "Public Key (Read-only)";
      case "bunker":
        return "Bunker";
      case "remote":
        return "Remote Signer";
      default:
        return method;
    }
  };

  return (
    <main className="min-h-screen">
      {/* Show graph when logged in, otherwise show hero */}
      {user?.pubkey ? (
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          {/* Logged in header */}
          <div className="max-w-7xl mx-auto mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge>{t("hero.badge")}</Badge>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("hero.title")}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-trust-green rounded-full animate-pulse" />
                  <span className="font-mono">{formatPubkey(user.pubkey)}</span>
                  <span className="text-gray-400">
                    via {getMethodLabel(user.method)}
                  </span>
                </div>
                <Button variant="secondary" size="sm" onClick={logout}>
                  {t("hero.logout")}
                </Button>
              </div>
            </div>
          </div>

          {/* Graph visualization */}
          <div className="max-w-7xl mx-auto">
            <GraphPlayground />
          </div>
        </div>
      ) : (
        <HeroSection
          user={user}
          onLogin={handleOpenModal}
          onLogout={logout}
          formatPubkey={formatPubkey}
          getMethodLabel={getMethodLabel}
          t={t}
        />
      )}

      {/* Connect Modal - shown automatically for non-logged in users */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={handleCloseConnectModal}
        onConnect={handleConnectFromModal}
      />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />
    </main>
  );
}

// ============================================================================
// Page Sections
// ============================================================================

interface User {
  pubkey: string;
  method: string;
  mode: string;
}

interface SectionProps {
  t: ReturnType<typeof useTranslations>;
}

/**
 * Hero section with login status
 */
function HeroSection({
  user,
  onLogin,
  onLogout,
  formatPubkey,
  getMethodLabel,
  t,
}: SectionProps & {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  formatPubkey: (pk: string) => string;
  getMethodLabel: (method: string) => string;
}) {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Badge className="mb-4">{t("hero.badge")}</Badge>
        <h1 className="text-4xl font-bold mb-4">{t("hero.title")}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          {t("hero.subtitle")}
        </p>

        {user?.pubkey ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 bg-trust-green/10 text-trust-green px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-trust-green rounded-full animate-pulse" />
              <span className="font-mono text-sm">
                {formatPubkey(user.pubkey)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              via {getMethodLabel(user.method)}{" "}
              {user.mode === "read" && "(read-only)"}
            </p>
            <Button variant="secondary" onClick={onLogout}>
              {t("hero.logout")}
            </Button>
          </div>
        ) : (
          <Button onClick={onLogin}>{t("hero.loginButton")}</Button>
        )}
      </div>
    </section>
  );
}
