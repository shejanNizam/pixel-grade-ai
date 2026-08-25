"use client";

import {
  FiCpu,
  FiEye,
  FiFeather,
  FiFileText,
  FiHardDrive,
  FiLayers,
  FiLifeBuoy,
  FiShield,
  FiSliders,
  FiWatch,
  FiZap,
} from "react-icons/fi";

const technicalParameters = [
  { label: "Body Material", value: "Premium Aluminum Alloy", icon: FiShield },
  { label: "Camera Pixel / Sensor", value: "100W Pixel (1MP), 1/4-inch CMOS Sensor", icon: FiCpu },
  { label: "Battery Capacity", value: "750mAh Lithium-ion (3.7V / 1W)", icon: FiZap },
  { label: "Magnification Gears", value: "10x, 13x, 15x Selectable Zoom", icon: FiLayers },
  { label: "Storage Capacity", value: "TF Card Slot (Supports 32GB - 128GB)", icon: FiHardDrive },
  { label: "Photo Format", value: "3024 × 3024 resolution (JPG format)", icon: FiFileText },
  { label: "Video Format", value: "720 × 720 resolution (AVI format)", icon: FiFileText },
  { label: "PC / Laptop Support", value: "Windows & macOS (USB live output)", icon: FiSliders },
  { label: "Charging / Battery Life", value: "0.5h fast charge (5V/1A) → 2h working time", icon: FiZap },
  { label: "Auto Power Saving", value: "Sleep Mode after 5 minutes of inactivity", icon: FiFeather },
];

const applicationCategories = [
  { name: "Trading Cards (TCG)", desc: "Grade foil layers, surface centering, micro-print, and centering.", icon: FiLayers },
  { name: "Circuit Boards", desc: "Inspect IC solder joints, PCBA traces, and miniature components.", icon: FiCpu },
  { name: "Mechanical Watches", desc: "Examine balance wheels, jewels, gear teeth, and hairsprings.", icon: FiWatch },
  { name: "Coins & Currency", desc: "Verify mint marks, die cracks, edge reeding, and UV watermarks.", icon: FiSliders },
  { name: "Stamps & Philately", desc: "Check perforation integrity, paper grain, and hidden overprints.", icon: FiFileText },
  { name: "Diamonds & Gemstones", desc: "Analyze gemstone facets, inclusions, clarity, and laser inscriptions.", icon: FiEye },
  { name: "Antiques & Artifacts", desc: "Examine patina, pottery glaze crazing, and maker signatures.", icon: FiShield },
  { name: "Medicine Bottles", desc: "Effortlessly read micro-text dosage warnings and batch numbers.", icon: FiFileText },
  { name: "Plant & Biology", desc: "Observe leaf stomata, trichomes, pollen, and plant cellular structure.", icon: FiFeather },
  { name: "Masonry & Materials", desc: "Inspect micro-fractures, stone porosity, and surface coatings.", icon: FiLifeBuoy },
];

export default function PixelScopeSpecs() {
  return (
    <section className="py-20 bg-black text-white border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            TECHNICAL SPECIFICATIONS
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Full Parameter Specifications
          </h2>
          <p className="mt-4 text-zinc-400 text-sm">
            Everything you need to know about the hardware engineering inside PixelScope.
          </p>
        </div>

        {/* Technical Parameters Matrix Table */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 bg-amber-500/10 px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Hardware Parameter Matrix
            </h3>
            <span className="text-xs font-mono text-zinc-400">Model: PS-100X</span>
          </div>

          <div className="divide-y divide-white/5">
            {technicalParameters.map((param, index) => {
              const Icon = param.icon;
              return (
                <div
                  key={param.label}
                  className={`grid grid-cols-1 sm:grid-cols-12 items-center px-6 py-4 text-sm transition-colors hover:bg-white/[0.02] ${
                    index % 2 === 0 ? "bg-white/[0.01]" : ""
                  }`}
                >
                  <div className="sm:col-span-5 flex items-center gap-3 font-medium text-zinc-300">
                    <Icon className="text-amber-400 shrink-0 text-base" />
                    <span>{param.label}</span>
                  </div>
                  <div className="sm:col-span-7 font-mono font-semibold text-white mt-1 sm:mt-0 text-xs sm:text-sm">
                    {param.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wide Range of Applications Showcase Grid */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              VERSATILE USE CASES
            </span>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
              Wide Range of Professional & Everyday Applications
            </h3>
            <p className="mt-3 text-xs text-zinc-400">
              From grading high-value trading cards to inspecting electronic circuit boards and fine antiques.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {applicationCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 transition-all hover:border-amber-500/40 hover:bg-amber-950/20 hover:scale-[1.02]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-20 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/50 via-zinc-900 to-black p-8 text-center sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-black uppercase tracking-wider mb-4">
              Order Risk-Free Today
            </span>
            <h3 className="text-2xl font-extrabold sm:text-4xl text-white">
              Elevate Your Inspection Precision
            </h3>
            <p className="mt-4 text-sm text-zinc-300">
              Every PixelScope includes a 30-day money-back guarantee, 1-year warranty, and free expedited shipping over $50.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#top"
                className="rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_24px_rgba(245,158,11,0.5)] transition-all hover:bg-amber-400 hover:scale-105"
              >
                Order PixelScope for $69.99
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
