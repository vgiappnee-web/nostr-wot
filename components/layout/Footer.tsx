"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LogoIcon, GitHubIcon, NostrIcon, XTwitterIcon } from "@/components/icons";

export default function Footer() {
  const t = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-gray-900 dark:text-white hover:no-underline mb-4">
              <LogoIcon />
              <span>Nostr WoT</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {t("footer.tagline")}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/nostr-wot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-5 h-5" />
              </a>
              <a
                href="https://njump.me/npub1elta7cneng3w8p9y4dw633qzdjr4kyvaparuyuttyrx6e8xp7xnq32cume"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-500 hover:text-nostr transition-colors"
                aria-label="Nostr"
              >
                <NostrIcon className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/AustinKels"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <XTwitterIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t("footer.product")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/download" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  WoT Extension
                </Link>
              </li>
              <li>
                <Link href="/oracle" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  WoT Oracle
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  {t("nav.features")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t("footer.resources")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  {t("nav.docs")}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/nostr-wot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/media-kit" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  {t("footer.mediaKit")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              {t("footer.copyright")}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              © {currentYear} Nostr WoT. {t("footer.allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
