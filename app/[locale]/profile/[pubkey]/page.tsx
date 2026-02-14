import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProfilePageContent from "./ProfilePageContent";
import { generateAlternates } from "@/lib/metadata";
import { type Locale } from "@/i18n/config";

interface ProfilePageProps {
  params: Promise<{
    locale: string;
    pubkey: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { pubkey, locale } = await params;
  const t = await getTranslations("profile");

  const shortPubkey = `${pubkey.slice(0, 8)}...${pubkey.slice(-8)}`;

  return {
    title: `${t("title")} - ${shortPubkey}`,
    description: t("description"),
    alternates: generateAlternates(`/profile/${pubkey}`, locale as Locale),
    openGraph: {
      title: `${t("title")} - ${shortPubkey}`,
      description: t("description"),
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${t("title")} - ${shortPubkey}`,
      description: t("description"),
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { pubkey } = await params;

  return <ProfilePageContent pubkey={pubkey} />;
}
