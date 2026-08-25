import PillButton from "@/components/shared/PillButton";
import { FiCheckCircle } from "react-icons/fi";

const features = [
  "UV & white LED lights",
  "32GB built-in storage",
  "Rechargeable battery",
];

/** The PixelScope device upsell that sits under the subscription plans. */
export default function HardwareCard() {
  return (
    <article className="mx-auto mt-6 flex max-w-5xl flex-col items-center rounded-2xl border border-amber-500/50 bg-linear-to-b from-amber-950/40 to-black p-6 text-center md:p-8">
      <h3 className="text-2xl font-semibold text-white sm:text-3xl">
        PixelScope Hardware
      </h3>

      <p className="mt-6 inline-flex items-baseline rounded-full bg-amber-500 px-10 py-3 text-3xl font-semibold text-black">
        $69.99
      </p>

      <ul className="mt-7 grid gap-3 text-left md:grid-cols-3 md:gap-8">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2.5 text-sm text-zinc-300"
          >
            <FiCheckCircle className="shrink-0 text-amber-400" />
            {feature}
          </li>
        ))}
      </ul>

      <PillButton
        href="/pixelscope"
        aria-label="View PixelScope Digital Magnifier"
        className="mt-8 bg-amber-500! py-2.5! text-black! ring-amber-300/70! shadow-[0_0_24px_rgba(245,158,11,0.45)]!"
      >
        Buy Now & Details
      </PillButton>
    </article>
  );
}
