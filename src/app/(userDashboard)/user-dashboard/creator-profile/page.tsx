import Image from "next/image";
import { FiShare2, FiShield, FiStar, FiUsers } from "react-icons/fi";
import { MdOutlineGridView, MdVerified } from "react-icons/md";
import { RiUserFollowLine } from "react-icons/ri";
import { creator, initials } from "../_components/creator-profile/data";

const tabs = [
  { label: "Showcase", Icon: FiStar },
  { label: "Posts", Icon: MdOutlineGridView },
  { label: "Explore", Icon: RiUserFollowLine },
  { label: "Badges", Icon: FiShield },
];

const summaryStats = [
  {
    emoji: "💰",
    label: "Total value",
    value: "$3,526",
    valueClass: "text-violet-400",
  },
  {
    emoji: "🃏",
    label: "Total cards",
    value: "128",
    valueClass: "text-violet-400",
  },
  {
    emoji: "🏅",
    label: "Total graded",
    value: "92",
    valueClass: "text-green-400",
  },
  {
    emoji: "⭐",
    label: "Community rating",
    value: "4.8",
    suffix: "/5",
    valueClass: "text-amber-400",
  },
];

const showcaseCards = Array.from({ length: 4 }, (_, i) => i);

export default function CreatorProfile() {
  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="rounded-2xl border border-white/10 bg-[#111113] p-6 sm:p-8">
        {/* Top row: avatar + info + share button */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* Avatar + name block */}
          <div className="flex items-start gap-5">
            {/* Avatar with glow */}
            <div className="relative shrink-0">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full bg-violet-500/50 blur-xl"
              />
              <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-2xl font-bold text-white ring-2 ring-violet-500/40">
                {initials}
              </span>
            </div>

            {/* Name, badge, followers */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  {creator.name}
                </h2>
                <MdVerified className="text-blue-400" size={20} />
              </div>

              <span className="inline-block rounded-md bg-violet-500/20 px-3 py-0.5 text-xs font-medium text-violet-300">
                {creator.badge}
              </span>

              <div className="flex items-center gap-5 pt-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <FiUsers size={14} className="text-violet-400" />
                  <span className="font-semibold text-white">12k</span>
                  <span className="text-zinc-500">Followers</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <FiUsers size={14} className="text-violet-400" />
                  <span className="font-semibold text-white">12k</span>
                  <span className="text-zinc-500">Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share profile button */}
          <button
            disabled
            className="flex cursor-default items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            <FiShare2 size={14} />
            Share profile
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-0 border-b border-white/10">
          {tabs.map(({ label, Icon }, idx) => (
            <button
              key={label}
              disabled
              className={`flex cursor-default items-center gap-1.5 px-4 pb-3 text-sm font-medium transition-colors ${
                idx === 0
                  ? "border-b-2 border-violet-500 text-white"
                  : "text-zinc-500"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Summary stat cards */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summaryStats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#0d0d0f] p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.emoji}</span>
                <span className="text-xs text-zinc-500">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.valueClass}`}>
                {s.value}
                {s.suffix && (
                  <span className="text-base font-semibold text-white">
                    {s.suffix}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* My showcase */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">My showcase</h2>
          <button
            disabled
            className="cursor-default text-sm font-medium text-violet-400"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {showcaseCards.map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-violet-500/30 bg-[#111113]"
            >
              <Image
                src="/assets/user-dashboard/recent_scan_card.png"
                alt="Pokemon card"
                width={280}
                height={390}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
