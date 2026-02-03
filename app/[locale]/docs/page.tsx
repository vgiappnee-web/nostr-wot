import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { LinkButton, CodeBlock, InlineCode, TerminalBlock, Section, SectionHeader } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("docs.meta");
  return { title: t("title"), description: t("description") };
}

interface SidebarLink {
  href: string;
  label?: string;
  labelKey?: string;
  isInternal?: boolean;
}

interface SidebarSection {
  key: string;
  links: SidebarLink[];
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    key: "gettingStarted",
    links: [
      { href: "#overview", labelKey: "overview" },
      { href: "#quick-start", labelKey: "quickStart" },
    ],
  },
  {
    key: "extensionApi",
    links: [
      { href: "#ext-setup", labelKey: "setup" },
      { href: "#ext-getdistance", label: "getDistance" },
      { href: "#ext-isinmywot", label: "isInMyWoT" },
      { href: "#ext-getdistancebetween", label: "getDistanceBetween" },
    ],
  },
  {
    key: "oracleApi",
    links: [
      { href: "#oracle-distance", label: "GET /distance" },
      { href: "#oracle-batch", label: "POST /distance/batch" },
      { href: "#oracle-stats", label: "GET /stats" },
      { href: "#oracle-health", label: "GET /health" },
    ],
  },
  {
    key: "resources",
    links: [
      { href: "/download", labelKey: "extensionGuide", isInternal: true },
      { href: "/oracle", labelKey: "oracleGuide", isInternal: true },
    ],
  },
];

interface TableRow {
  name: string;
  type: string;
  default?: string;
  required?: string;
  description: string;
}

function ParamTable({ rows, hasDefault, hasRequired }: { rows: TableRow[]; hasDefault?: boolean; hasRequired?: boolean }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="text-left p-3 font-semibold">Name</th>
            <th className="text-left p-3 font-semibold">Type</th>
            {hasDefault && <th className="text-left p-3 font-semibold">Default</th>}
            {hasRequired && <th className="text-left p-3 font-semibold">Required</th>}
            <th className="text-left p-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="p-3 border-t border-gray-200 dark:border-gray-700"><InlineCode>{row.name}</InlineCode></td>
              <td className="p-3 border-t border-gray-200 dark:border-gray-700">{row.type}</td>
              {hasDefault && <td className="p-3 border-t border-gray-200 dark:border-gray-700">{row.default || "-"}</td>}
              {hasRequired && <td className="p-3 border-t border-gray-200 dark:border-gray-700">{row.required}</td>}
              <td className="p-3 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function DocsPage() {
  const t = await getTranslations("docs");

  return (
    <main>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">{t("hero.title")}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">{t("hero.subtitle")}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {SIDEBAR_SECTIONS.map((section) => (
                <div key={section.key}>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-500">
                    {t(`sidebar.${section.key}`)}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        {link.isInternal ? (
                          <Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary">
                            {link.labelKey ? t(`sidebar.${link.labelKey}`) : link.label}
                          </Link>
                        ) : (
                          <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary">
                            {link.labelKey ? t(`sidebar.${link.labelKey}`) : link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section id="overview" className="mb-16">
                <h2 className="text-2xl font-bold mb-4">{t("overview.title")}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("overview.description")}</p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>
                    <strong className="text-gray-900 dark:text-white">{t("overview.extension.title")}</strong> - {t("overview.extension.description")}{" "}
                    <InlineCode>{t("overview.extension.api")}</InlineCode> {t("overview.extension.forClientSide")}
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">{t("overview.oracle.title")}</strong> - {t("overview.oracle.description")}
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("overview.fundamentalQuestion")} <em>{t("overview.question")}</em>
                </p>
              </section>

              <section id="quick-start" className="mb-16">
                <h2 className="text-2xl font-bold mb-4">{t("quickStart.title")}</h2>
                <h3 className="text-lg font-semibold mb-3">{t("quickStart.browser")}</h3>
                <CodeBlock
                  language="javascript"
                  className="mb-6"
                  code={`// Check if extension is available
if (window.nostr?.wot) {
  // Get distance to a pubkey
  const distance = await window.nostr.wot.getDistance(
    "npub1targetpubkey..."
  );

  if (distance !== null && distance <= 2) {
    // Within web of trust
    console.log(\`Trusted: \${distance} hops away\`);
  } else {
    // Outside web of trust or not connected
    console.log("Not in your web of trust");
  }
}`}
                />
                <h3 className="text-lg font-semibold mb-3">{t("quickStart.server")}</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Using fetch
const response = await fetch(
  \`https://wot-oracle.nostr-wot.com/distance?\` +
  \`from=\${fromPubkey}&to=\${toPubkey}\`
);
const data = await response.json();

console.log(\`Distance: \${data.distance}\`);
console.log(\`Paths: \${data.paths}\`);
console.log(\`Mutual follow: \${data.mutual}\`);`}
                />
              </section>

              <section id="ext-setup" className="mb-16">
                <h2 className="text-2xl font-bold mb-4">{t("extensionSetup.title")}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t("extensionSetup.description")} <InlineCode>{t("extensionSetup.api")}</InlineCode> {t("extensionSetup.objectInto")}
                </p>
                <CodeBlock
                  language="javascript"
                  code={`// Feature detection
function hasWoT() {
  return typeof window !== "undefined" &&
         window.nostr?.wot !== undefined;
}

// Wait for extension to load
async function waitForWoT(timeout = 3000) {
  const start = Date.now();
  while (!hasWoT() && Date.now() - start < timeout) {
    await new Promise(r => setTimeout(r, 100));
  }
  return hasWoT();
}`}
                />
              </section>

              <section id="ext-getdistance" className="mb-16">
                <h2 className="text-2xl font-bold mb-4"><InlineCode>{t("getDistance.title")}</InlineCode></h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("getDistance.description")}</p>
                <h3 className="text-lg font-semibold mb-3">{t("getDistance.parameters")}</h3>
                <ParamTable
                  rows={[{ name: "targetPubkey", type: "string", description: "Hex or npub format pubkey" }]}
                />
                <h3 className="text-lg font-semibold mb-3">{t("getDistance.returns")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <InlineCode>Promise&lt;number | null&gt;</InlineCode> - {t("getDistance.returnsDescription")}{" "}
                  <InlineCode>{t("getDistance.null")}</InlineCode> {t("getDistance.ifNotConnected")}
                </p>
                <h3 className="text-lg font-semibold mb-3">{t("getDistance.example")}</h3>
                <CodeBlock
                  language="javascript"
                  code={`const distance = await window.nostr.wot.getDistance(
  "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d"
);

switch (distance) {
  case null:
    console.log("Not connected");
    break;
  case 0:
    console.log("This is you");
    break;
  case 1:
    console.log("Direct follow");
    break;
  default:
    console.log(\`\${distance} hops away\`);
}`}
                />
              </section>

              <section id="ext-isinmywot" className="mb-16">
                <h2 className="text-2xl font-bold mb-4"><InlineCode>{t("isInMyWot.title")}</InlineCode></h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("isInMyWot.description")}</p>
                <h3 className="text-lg font-semibold mb-3">{t("isInMyWot.parameters")}</h3>
                <ParamTable
                  hasDefault
                  rows={[
                    { name: "targetPubkey", type: "string", default: "-", description: "Hex or npub format pubkey" },
                    { name: "maxHops", type: "number", default: "3", description: 'Maximum hops to consider "trusted"' },
                  ]}
                />
                <h3 className="text-lg font-semibold mb-3">{t("isInMyWot.returns")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4"><InlineCode>Promise&lt;boolean&gt;</InlineCode></p>
                <h3 className="text-lg font-semibold mb-3">{t("isInMyWot.example")}</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Check with default threshold (3 hops)
const trusted = await window.nostr.wot.isInMyWoT(pubkey);

// Stricter check (2 hops)
const veryTrusted = await window.nostr.wot.isInMyWoT(pubkey, 2);

// Filter a list of pubkeys
const pubkeys = ["npub1...", "npub2...", "npub3..."];
const trusted = await Promise.all(
  pubkeys.map(p => window.nostr.wot.isInMyWoT(p, 2))
);
const trustedPubkeys = pubkeys.filter((_, i) => trusted[i]);`}
                />
              </section>

              <section id="ext-getdistancebetween" className="mb-16">
                <h2 className="text-2xl font-bold mb-4"><InlineCode>{t("getDistanceBetween.title")}</InlineCode></h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("getDistanceBetween.description")}</p>
                <h3 className="text-lg font-semibold mb-3">{t("getDistanceBetween.parameters")}</h3>
                <ParamTable
                  rows={[
                    { name: "fromPubkey", type: "string", description: "Source pubkey" },
                    { name: "toPubkey", type: "string", description: "Target pubkey" },
                  ]}
                />
                <h3 className="text-lg font-semibold mb-3">Returns</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4"><InlineCode>Promise&lt;number | null&gt;</InlineCode></p>
                <h3 className="text-lg font-semibold mb-3">Example</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Check how connected two other users are
const distance = await window.nostr.wot.getDistanceBetween(
  alicePubkey,
  bobPubkey
);

if (distance === 1) {
  console.log("Alice follows Bob directly");
}`}
                />
              </section>

              <section id="oracle-distance" className="mb-16">
                <h2 className="text-2xl font-bold mb-4"><InlineCode>{t("oracleDistance.title")}</InlineCode></h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("oracleDistance.description")}</p>
                <h3 className="text-lg font-semibold mb-3">{t("oracleDistance.queryParameters")}</h3>
                <ParamTable
                  hasRequired
                  rows={[
                    { name: "from", type: "string", required: "Yes", description: "Source pubkey (hex)" },
                    { name: "to", type: "string", required: "Yes", description: "Target pubkey (hex)" },
                  ]}
                />
                <h3 className="text-lg font-semibold mb-3">Response</h3>
                <CodeBlock
                  language="json"
                  className="mb-6"
                  code={`{
  "from": "3bf0c63f...",
  "to": "82341f88...",
  "distance": 2,
  "paths": 5,
  "mutual": false,
  "bridging_nodes": [
    "a1b2c3d4...",
    "e5f6g7h8..."
  ]
}`}
                />
                <h3 className="text-lg font-semibold mb-3">Example</h3>
                <TerminalBlock
                  commands={[
                    'curl "https://wot-oracle.nostr-wot.com/distance?from=3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d&to=82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2"'
                  ]}
                />
              </section>

              <section id="oracle-batch" className="mb-16">
                <h2 className="text-2xl font-bold mb-4"><InlineCode>{t("oracleBatch.title")}</InlineCode></h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("oracleBatch.description")}</p>
                <h3 className="text-lg font-semibold mb-3">{t("oracleBatch.requestBody")}</h3>
                <CodeBlock
                  language="json"
                  className="mb-6"
                  code={`{
  "from": "3bf0c63f...",
  "targets": [
    "82341f88...",
    "a1b2c3d4...",
    "e5f6g7h8..."
  ]
}`}
                />
                <h3 className="text-lg font-semibold mb-3">Response</h3>
                <CodeBlock
                  language="json"
                  className="mb-6"
                  code={`{
  "from": "3bf0c63f...",
  "results": [
    { "to": "82341f88...", "distance": 2 },
    { "to": "a1b2c3d4...", "distance": 1 },
    { "to": "e5f6g7h8...", "distance": null }
  ]
}`}
                />
                <h3 className="text-lg font-semibold mb-3">Example</h3>
                <TerminalBlock
                  commands={[
                    'curl -X POST "https://wot-oracle.nostr-wot.com/distance/batch" \\',
                    '  -H "Content-Type: application/json" \\',
                    '  -d \'{"from": "3bf0c63f...", "targets": ["82341f88...", "a1b2c3d4..."]}\''
                  ]}
                />
              </section>

              <section id="oracle-stats" className="mb-16">
                <h2 className="text-2xl font-bold mb-4"><InlineCode>{t("oracleStats.title")}</InlineCode></h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("oracleStats.description")}</p>
                <h3 className="text-lg font-semibold mb-3">{t("oracleStats.response")}</h3>
                <CodeBlock
                  language="json"
                  code={`{
  "total_pubkeys": 1250000,
  "total_follows": 8500000,
  "last_sync": "2024-01-15T10:30:00Z",
  "cache_hit_rate": 0.85,
  "relays_connected": 3
}`}
                />
              </section>

              <section id="oracle-health" className="mb-16">
                <h2 className="text-2xl font-bold mb-4"><InlineCode>{t("oracleHealth.title")}</InlineCode></h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("oracleHealth.description")}</p>
                <h3 className="text-lg font-semibold mb-3">{t("oracleHealth.response")}</h3>
                <CodeBlock
                  language="json"
                  code={`{
  "status": "healthy",
  "uptime": 864000,
  "version": "1.0.0"
}`}
                />
              </section>

              <section className="mb-16">
                <h2 className="text-2xl font-bold mb-4">{t("rateLimits.title")}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t("rateLimits.description")}{" "}
                  <InlineCode>{t("rateLimits.url")}</InlineCode> {t("rateLimits.hasLimits")}
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>{t("rateLimits.limits.requestsPerMinute")}</li>
                  <li>{t("rateLimits.limits.batchCount")}</li>
                  <li>{t("rateLimits.limits.headers")} <InlineCode>X-RateLimit-Remaining</InlineCode>, <InlineCode>X-RateLimit-Reset</InlineCode></li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("rateLimits.selfHost")} <Link href="/oracle" className="text-primary hover:underline">{t("rateLimits.selfHostLink")}</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t("errorHandling.title")}</h2>
                <CodeBlock
                  language="javascript"
                  code={`// Extension API
try {
  const distance = await window.nostr.wot.getDistance(pubkey);
} catch (error) {
  if (error.message.includes("timeout")) {
    // Query took too long
  } else if (error.message.includes("offline")) {
    // Local mode and no cached data
  }
}

// Oracle API - HTTP status codes
// 200 - Success
// 400 - Invalid pubkey format
// 429 - Rate limited
// 500 - Server error`}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
