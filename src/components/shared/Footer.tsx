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

const support = [
  { label: "+880 78 97 328473483", href: "tel:+8807897328473483" },
  { label: "abc@gmail.com", href: "mailto:abc@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[url('/assets/footer_bg.png')] bg-cover bg-bottom bg-no-repeat px-4 pb-12">
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
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
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
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
