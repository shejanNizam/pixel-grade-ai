// ---------------------------------------------------------------------------
// Public slab verification.
//
// This is what the QR code on every slab band resolves to
// (`{FRONTEND_PUBLIC_URL}/verify/{pixelId}` — see `verifyUrlFor` in the
// server's slab.service.ts). Someone handed a physical slab scans it and lands
// here to confirm the grade printed on it was really issued by us.
//
// Deliberately:
//   • PUBLIC — no login. A buyer checking a card they don't own yet is the
//     entire point, so requiring an account would defeat it.
//   • READ-ONLY. There is nothing to act on here; the page renders the same
//     projection the API returns and offers no way to change it.
//   • Rendered on the server, so a scanned QR shows the grade on first paint
//     rather than a spinner over a mobile connection.
// ---------------------------------------------------------------------------

import { env } from "@/config/env";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/** Mirrors the public projection returned by GET /grading/verify/:pixelId. */
interface VerifiedReport {
  pixelId: string;
  grade: number;
  gradeLabel: string;
  confidence: number;
  pixelVerified: boolean;
  scores: {
    surface: number;
    corners: number;
    edges: number;
    centering: number;
  };
  card: {
    name?: string;
    setExpansion?: string;
    cardNumber?: string;
    rarity?: string;
    language?: string;
    releaseYear?: number;
    officialImageUrl?: string;
  };
  owner: {
    username?: string;
    avatarUrl?: string;
  };
  gradedAt?: string;
  modelVersion?: string;
}

async function fetchReport(pixelId: string): Promise<VerifiedReport | null> {
  try {
    const res = await fetch(
      `${env.API_URL}/api/v1/grading/verify/${encodeURIComponent(pixelId)}`,
      // A grade never changes once issued, but the owner's handle and avatar
      // can — revalidate rather than caching forever.
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pixelId: string }>;
}): Promise<Metadata> {
  const { pixelId } = await params;
  return {
    title: `Verify ${pixelId} · PixelGrade AI`,
    description: `Public verification for PixelGrade slab ${pixelId}.`,
    // A verification page has no business in search results — the ids are
    // meant to be reachable from the slab in your hand, not enumerated.
    robots: { index: false, follow: false },
  };
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 py-2.5 last:border-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-sm font-medium tabular-nums text-white">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ pixelId: string }>;
}) {
  const { pixelId } = await params;
  const report = await fetchReport(pixelId);

  if (!report) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="rounded-2xl border border-white/10 bg-[#0d0d0f] px-8 py-12">
          <p className="text-4xl">🔍</p>
          <h1 className="mt-5 text-xl font-medium text-white">
            No card matches that Pixel ID
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            <span className="font-mono text-zinc-300">{pixelId}</span> isn&apos;t
            a grade we&apos;ve issued. Check the code printed on the slab, or
            scan the QR again.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            Go to PixelGrade AI
          </Link>
        </div>
      </main>
    );
  }

  const { card, owner, scores } = report;
  const gradedAt = report.gradedAt
    ? new Date(report.gradedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
          ✓ Verified grade
        </p>
        <h1 className="mt-5 text-2xl font-medium text-white">
          {card.name ?? "Graded card"}
        </h1>
        <p className="mt-1.5 font-mono text-xs tracking-wider text-zinc-500">
          {report.pixelId}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        {/* ---- Card ---- */}
        <div className="space-y-4">
          {card.officialImageUrl ? (
            <Image
              src={card.officialImageUrl}
              alt={card.name ?? "Graded card"}
              width={260}
              height={364}
              unoptimized
              className="w-full rounded-xl border border-white/10"
            />
          ) : (
            <div className="aspect-5/7 w-full rounded-xl border border-dashed border-white/15 bg-white/5" />
          )}

          {owner.username && (
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0d0d0f] px-4 py-3">
              {owner.avatarUrl ? (
                <Image
                  src={owner.avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-8 items-center justify-center rounded-full bg-violet-600 text-xs font-medium text-white">
                  {owner.username.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Owner
                </p>
                <p className="truncate text-sm text-white">
                  @{owner.username}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---- Grade ---- */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-violet-500/40 bg-[#111113] p-6 text-center">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              PixelGrade
            </p>
            <p className="mt-1 text-6xl font-semibold tabular-nums text-white">
              {report.grade.toFixed(1)}
            </p>
            <p className="mt-1 text-sm font-medium text-violet-400">
              {report.gradeLabel}
            </p>

            {/* Server-awarded only: PixelScope upload AND confidence >= 90.
                Rendered from the flag, never inferred from anything else. */}
            {report.pixelVerified && (
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-400">
                ★ Pixel Verified
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0d0f] px-5 py-3">
            <ScoreRow label="Centering" value={scores.centering} />
            <ScoreRow label="Corners" value={scores.corners} />
            <ScoreRow label="Edges" value={scores.edges} />
            <ScoreRow label="Surface" value={scores.surface} />
          </div>

          <dl className="rounded-2xl border border-white/10 bg-[#0d0d0f] px-5 py-3 text-xs">
            {[
              ["Set", card.setExpansion],
              ["Card number", card.cardNumber],
              ["Rarity", card.rarity],
              ["Language", card.language],
              ["Year", card.releaseYear ? String(card.releaseYear) : undefined],
              ["Confidence", `${Math.round(report.confidence)}%`],
              ["Graded", gradedAt ?? undefined],
              ["Model", report.modelVersion],
            ]
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-white/8 py-2.5 last:border-0"
                >
                  <dt className="text-zinc-400">{label}</dt>
                  <dd className="text-right text-zinc-200">{value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>

      <p className="mt-10 text-center text-[11px] text-zinc-500">
        This grade was issued by PixelGrade AI and is shown here for
        verification only.{" "}
        <Link href="/" className="text-violet-400 hover:underline">
          Grade your own cards →
        </Link>
      </p>
    </main>
  );
}
