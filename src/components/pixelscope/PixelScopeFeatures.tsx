"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FiCamera,
  FiCpu,
  FiHardDrive,
  FiLayers,
  FiMonitor,
  FiMaximize2,
  FiMonitor as FiPC,
  FiSun,
  FiZap,
} from "react-icons/fi";

const keyFeatureHighlights = [
  {
    icon: FiMaximize2,
    title: "10X / 13X / 15X Magnification",
    desc: "3 selectable gear levels to inspect surface details, foil patterns, and micro-print.",
  },
  {
    icon: FiSun,
    title: "White & UV Dual Lighting",
    desc: "3 White LEDs for natural clarity + 3 UV LEDs to reveal security watermarks.",
  },
  {
    icon: FiMonitor,
    title: '2.1" IPS Color Display',
    desc: "480×480 HD resolution with 178° wide viewing angle. No smartphone required.",
  },
  {
    icon: FiCamera,
    title: "Photo & Video Capture",
    desc: "Capture 3024×3024 high-res photos and 720×720 videos with one-click ease.",
  },
  {
    icon: FiHardDrive,
    title: "Up to 128GB Storage",
    desc: "TF card slot included to save thousands of microscopic images & inspection clips.",
  },
  {
    icon: FiZap,
    title: "750mAh Fast Recharge",
    desc: "0.5-hour fast USB-C charge provides 2 hours of continuous handheld inspection.",
  },
];

export default function PixelScopeFeatures() {
  const [activeTab, setActiveTab] = useState<"white" | "uv">("white");
  const [activeMag, setActiveMag] = useState<"10x" | "13x" | "15x">("15x");

  return (
    <section className="py-20 bg-gradient-to-b from-black via-zinc-950 to-black text-white border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            ENGINEERED FOR PRECISION
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Pro-Grade Magnification & Inspection Features
          </h2>
          <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
            Designed from the ground up for collectors and professionals who demand absolute clarity, accuracy, and ease of use.
          </p>
        </div>

        {/* 6 Key Feature Badges Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {keyFeatureHighlights.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-amber-500/40 hover:bg-amber-950/20 hover:shadow-xl hover:shadow-amber-950/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feat.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{feat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Feature Interactive Spotlight #1: Dual UV & White Lighting */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-zinc-900/60 p-8 lg:p-12 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <span className="inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30">
                Dual Lighting Technology
              </span>
              <h3 className="mt-4 text-2xl font-bold sm:text-3xl text-white">
                Built-in 8 LED Lights: Switch Between White & UV Modes
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                Easily toggle between daylight-balanced white LEDs for inspecting card textures and 365nm UV LEDs for revealing hidden security threads, watermarks, and fluorescent card authentication marks.
              </p>

              {/* Interactive Toggle */}
              <div className="mt-6 inline-flex rounded-xl border border-white/15 bg-black/60 p-1">
                <button
                  onClick={() => setActiveTab("white")}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "white"
                      ? "bg-amber-500 text-black shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  ☀️ 3 White LEDs (Natural Clarity)
                </button>
                <button
                  onClick={() => setActiveTab("uv")}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "uv"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/50"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  🔮 3 UV LEDs (Security & Watermarks)
                </button>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <strong>White Light:</strong> Ideal for circuit boards, trading card surfaces, stamps, and mechanical watch jewels.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                  <strong>UV Light:</strong> Detects hidden security ink, currency authentication marks, and fluorescent flaws.
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src={activeTab === "white" ? "/assets/pixelscope/hero.jpg" : "/assets/pixelscope/uv_lighting.jpg"}
                alt={activeTab === "white" ? "White LED Mode" : "UV LED Mode"}
                fill
                className="object-cover transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/80 backdrop-blur-md p-3 border border-white/10 text-xs">
                <span className="font-semibold text-amber-400 uppercase tracking-wider">Active Light Mode:</span>{" "}
                <span className="text-white font-mono">
                  {activeTab === "white" ? "WHITE LED (5500K Sunlight Balanced)" : "UV ULTRAVIOLET (365nm Fluorescent Detection)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Spotlight #2: 3-Gear Magnification & PC Support */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Card 1: 3-Gear Magnification */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-black p-8 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-5">
              <FiLayers size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">3-Gear Precision Magnification</h3>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              Instantly switch between 10X, 13X, and 15X magnification levels to examine micro-detailing on collectibles.
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              {(["10x", "13x", "15x"] as const).map((mag) => (
                <button
                  key={mag}
                  onClick={() => setActiveMag(mag)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                    activeMag === mag
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"
                  }`}
                >
                  {mag} Zoom
                </button>
              ))}
            </div>

            <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/assets/pixelscope/card_zoom.jpg"
                alt="3 Gear Magnification Preview"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 rounded-full bg-amber-500 px-3 py-1 font-mono text-xs font-bold text-black shadow-lg">
                {activeMag.toUpperCase()} Zoom Selected
              </div>
            </div>
          </div>

          {/* Card 2: PC/Laptop Output */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-black p-8 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-5">
              <FiPC size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">PC & Laptop Live Video Support</h3>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              Connect via USB cable to stream real-time HD video feed directly to Windows or macOS computers for large screen grading and analysis.
            </p>

            <div className="mt-6 space-y-3 text-xs text-zinc-300">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex items-center gap-2">
                  <FiCpu className="text-amber-400" /> Plug & Play Connectivity
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Windows / Mac</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex items-center gap-2">
                  <FiCamera className="text-amber-400" /> Media Capture Output
                </span>
                <span className="font-mono text-amber-300">3024×3024 JPG / 720p AVI</span>
              </div>
            </div>

            <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/assets/pixelscope/box_bundle.jpg"
                alt="PC HD Live Output Connection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
