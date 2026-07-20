"use client";

import { useGetMeQuery } from "@/redux/features/user/userApi";
import Image from "next/image";
import Link from "next/link";

interface HeaderProfileProps {
  /** Where clicking the profile block goes (the profile settings page). */
  href: string;
  /** Line under the name. Defaults to the user's formatted role. */
  subtitle?: string;
}

/** "David Joseph" -> "DJ"; "super_admin" style names still get two letters. */
const initialsOf = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** "super_admin" -> "Super Admin". */
const formatRole = (role: string): string =>
  role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function HeaderProfile({ href, subtitle }: HeaderProfileProps) {
  const { data: me, isLoading } = useGetMeQuery();

  if (isLoading || !me) {
    return (
      <div className="flex items-center gap-2.5">
        <span className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-white/10 md:h-10 md:w-10" />
        <div className="hidden leading-tight lg:block">
          <span className="block h-3.5 w-24 animate-pulse rounded bg-white/10" />
          <span className="mt-1 block h-2.5 w-16 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5"
      aria-label="Go to your profile"
    >
      {me.avatar?.url ? (
        <Image
          src={me.avatar.url}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="h-9 w-9 shrink-0 rounded-full object-cover md:h-10 md:w-10"
        />
      ) : (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white md:h-10 md:w-10">
          {initialsOf(me.name)}
        </span>
      )}
      <div className="hidden leading-tight lg:block">
        <p className="max-w-40 truncate text-sm font-medium text-white">
          {me.name}
        </p>
        <p className="text-xs text-zinc-500">
          {subtitle ?? formatRole(me.role)}
        </p>
      </div>
    </Link>
  );
}
