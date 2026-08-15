import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Services",
    links: [
      { label: "Home", href: "/" },
      { label: "Working process", href: "/#working-process" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Service", href: "/terms" },
    ],
  },
];

/* Client, 2026-08-15: support is this address only — the phone number is gone
   and the address is deliberately plain text, not a mailto link. */
const support = ["admin@pixelgradeai.com"];

export default function Footer() {
  return (
    /* pt-14 matters on pages that don't have <SupportCta> above the footer to
       provide the gap — About, Privacy, Terms. */
    <footer className="bg-[url('/assets/footer_bg.png')] bg-cover bg-bottom bg-no-repeat px-4 pt-14 pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label="PixelGrade AI home">
            <Image
              src="/assets/main_logo_all.png"
              alt="PixelGrade AI"
              width={180}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-zinc-400">
            Professional graphic design, digital marketing, custom website
            development, mobile app solutions, and branding services for modern
            businesses.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-base font-medium text-white">{column.title}</h3>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white! transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-base font-medium text-white">Support</h3>
          <ul className="mt-5 space-y-3">
            {support.map((item) => (
              <li key={item} className="text-sm break-all text-white">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
