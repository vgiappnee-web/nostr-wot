import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactContent from "./ContactContent";
import { generateAlternates } from "@/lib/metadata";
import { type Locale } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("contact.meta");
  return {
    title: t("title"),
    description: t("description"),
    alternates: generateAlternates("/contact", locale as Locale),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact.meta");

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": t("title"),
    "description": t("description"),
    "url": "https://nostr-wot.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Nostr Web of Trust",
      "url": "https://nostr-wot.com",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "url": "https://nostr-wot.com/contact",
        },
        {
          "@type": "ContactPoint",
          "contactType": "press",
          "url": "https://nostr-wot.com/contact",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent />
    </>
  );
}
