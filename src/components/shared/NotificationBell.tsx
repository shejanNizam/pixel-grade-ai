"use client";

import {
  useGetUnreadCountQuery,
  useListNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  type NotifType,
} from "@/redux/features/notification/notificationApi";
import { Popover } from "antd";
import Link from "next/link";
import { useState } from "react";
import {
  FiAward,
  FiBell,
  FiCreditCard,
  FiInfo,
  FiLifeBuoy,
  FiTrendingUp,
} from "react-icons/fi";

/** One icon per notification type — a quick visual cue in the dropdown. */
const TYPE_ICON: Record<NotifType, React.ReactNode> = {
  grade_ready: <FiAward className="text-violet-400" />,
  price_alert: <FiTrendingUp className="text-emerald-400" />,
  subscription: <FiCreditCard className="text-blue-400" />,
  support: <FiLifeBuoy className="text-amber-400" />,
  system: <FiInfo className="text-zinc-400" />,
};

/** Compact "3m ago" style timestamp; falls back to a date past a week. */
const relativeTime = (iso?: string): string => {
  if (!iso) return "";
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

interface NotificationBellProps {
  /** Optional "See all" target — omit where there's no full notifications page. */
  seeAllHref?: string;
}

export default function NotificationBell({ seeAllHref }: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const { data: unread } = useGetUnreadCountQuery();
  const { data } = useListNotificationsQuery({ limit: 8 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const count = unread?.unreadCount ?? 0;
  const items = data?.data ?? [];

  const panel = (
    <div className="w-80 max-w-[calc(100vw-2rem)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-white">Notifications</p>
        {count > 0 && (
          <button
            type="button"
            onClick={() => markAllAsRead()}
            className="text-xs text-violet-400 transition-opacity hover:opacity-80"
          >
            Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-8 text-center text-xs text-zinc-500">
          You&apos;re all caught up.
        </p>
      ) : (
        <ul className="max-h-96 divide-y divide-white/8 overflow-y-auto">
          {items.map((n) => (
            <li key={n._id}>
              <button
                type="button"
                onClick={() => {
                  if (!n.isRead) markAsRead(n._id);
                }}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                  n.isRead ? "" : "bg-violet-500/5"
                }`}
              >
                <span className="mt-0.5 shrink-0 text-base">
                  {TYPE_ICON[n.type] ?? TYPE_ICON.system}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={`truncate text-xs font-medium ${
                        n.isRead ? "text-zinc-300" : "text-white"
                      }`}
                    >
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    )}
                  </span>
                  {n.body && (
                    <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
                      {n.body}
                    </span>
                  )}
                  <span className="mt-0.5 block text-[10px] text-zinc-600">
                    {relativeTime(n.createdAt)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {seeAllHref && (
        <Link
          href={seeAllHref}
          onClick={() => setOpen(false)}
          className="block border-t border-white/10 px-4 py-2.5 text-center text-xs text-violet-400 transition-colors hover:bg-white/5"
        >
          See all notifications
        </Link>
      )}
    </div>
  );

  return (
    <Popover
      content={panel}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      color="#18181b"
      styles={{ content: { padding: 0 } }}
    >
      <button
        type="button"
        aria-label={
          count > 0 ? `Notifications, ${count} unread` : "Notifications"
        }
        className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 transition-colors hover:bg-zinc-200 md:h-10 md:w-10"
      >
        <FiBell size={17} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-black bg-red-500 px-1 text-[9px] font-semibold text-white tabular-nums">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>
    </Popover>
  );
}
