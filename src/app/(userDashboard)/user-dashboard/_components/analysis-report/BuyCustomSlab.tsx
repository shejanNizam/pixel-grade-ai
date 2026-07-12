import Image from "next/image";
import { CARD_IMAGE } from "./data";

export default function BuyCustomSlab() {
  return (
    <article className="flex flex-col rounded-2xl border border-violet-500/40 bg-[#111113] p-5 text-center">
      <h3 className="text-base font-medium text-white">Buy Custom Slab</h3>
      <p className="mt-1.5 text-xs text-zinc-500">
        Turn your card into a grading card with your brand
      </p>

      <Image
        src={CARD_IMAGE}
        alt=""
        width={220}
        height={308}
        className="mx-auto my-5 h-52 w-auto rounded-xl object-contain"
      />

      <button
        type="button"
        disabled
        className="mt-auto w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-zinc-400"
      >
        Upcoming
      </button>
    </article>
  );
}
