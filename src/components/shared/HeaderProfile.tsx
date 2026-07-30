"use client";

import { useGetMeQuery } from "@/redux/features/user/userApi";
import { Dropdown, type MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";

export interface HeaderProfileLink {
  href: string;
  label: string;
}

interface HeaderProfileProps {
  /** Where the block goes when there is no menu — the profile settings page. */
  href: string;
  /** Line under the name. Defaults to the user's formatted role. */
  subtitle?: string;
  /**
   * Turns the block into an account menu. Omit it and the block stays a plain
   * link, which is what the admin header wants — admins have no Creator
   * Profile, so a one-item dropdown there would be a worse click than a link.
   */
  links?: HeaderProfileLink[];
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

export default function HeaderProfile({
  href,
  subtitle,
  links,
}: HeaderProfileProps) {
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

  const identity = (
    <>
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
        {/* The handle, once there is one — this block is the entry point to the
            public profile, so it should show what that profile is called. */}
        <p className="max-w-40 truncate text-xs text-zinc-500">
          {me.username ? `@${me.username}` : (subtitle ?? formatRole(me.role))}
        </p>
      </div>
    </>
  );

  if (!links?.length) {
    return (
      <Link
        href={href}
        className="flex items-center gap-2.5"
        aria-label="Go to your profile"
      >
        {identity}
      </Link>
    );
  }

  const items: MenuProps["items"] = links.map((link) => ({
    key: link.href,
    label: <Link href={link.href}>{link.label}</Link>,
  }));

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2.5"
        aria-label="Account menu"
      >
        {identity}
      </button>
    </Dropdown>
  );
}
