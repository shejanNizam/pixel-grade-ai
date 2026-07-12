import { siteConfig } from "@/config/site";
import Link from "next/link";
import BackLink from "../../_components/settings/BackLink";

/* No Figma for this screen yet — deliberately minimal. */
const links = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Service", href: "/terms" },
  { label: "Contact support", href: "/contact" },
];

export default function About() {
  return (
    <div className="space-y-8">
      <BackLink title="About" />

      <div className="max-w-2xl space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#0d0d0f] p-6">
          <h3 className="text-lg font-medium text-white">{siteConfig.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            AI-powered trading card grading. Upload your card photos and get an
            instant inspection report with grade prediction, condition analysis,
            and market valuation.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/8 pt-5 text-sm">
            <div>
              <dt className="text-xs text-zinc-500">Version</dt>
              <dd className="mt-1 text-white tabular-nums">0.1.0</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">AI model</dt>
              <dd className="mt-1 text-white">PixelGrade AI</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0d0d0f] p-6">
          <h3 className="text-sm font-medium text-white">
            Legal &amp; support
          </h3>
          <ul className="mt-4 divide-y divide-white/8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
