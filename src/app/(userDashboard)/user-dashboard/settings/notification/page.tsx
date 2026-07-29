"use client";

import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import {
  useDeleteNotificationMutation,
  useGetNotificationSettingsQuery,
  useGetUnreadCountQuery,
  useListNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useUpdateNotificationSettingsMutation,
  type NotificationSettings,
  type NotifType,
} from "@/redux/features/notification/notificationApi";
import { App } from "antd";
import { useEffect, useState } from "react";
import {
  FiAward,
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiInfo,
  FiLifeBuoy,
  FiSettings,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

const TYPE_META: Record<
  NotifType,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  grade_ready: {
    label: "Grade ready",
    icon: <FiAward className="h-5 w-5 text-violet-400" />,
    badge: "bg-violet-500/15 text-violet-300",
  },
  price_alert: {
    label: "Price alert",
    icon: <FiTrendingUp className="h-5 w-5 text-emerald-400" />,
    badge: "bg-emerald-500/15 text-emerald-400",
  },
  subscription: {
    label: "Subscription",
    icon: <FiCreditCard className="h-5 w-5 text-blue-400" />,
    badge: "bg-blue-500/15 text-blue-400",
  },
  support: {
    label: "Support",
    icon: <FiLifeBuoy className="h-5 w-5 text-amber-400" />,
    badge: "bg-amber-500/15 text-amber-400",
  },
  system: {
    label: "System",
    icon: <FiInfo className="h-5 w-5 text-zinc-400" />,
    badge: "bg-white/10 text-zinc-300",
  },

  // Staff-audience types. This page only ever lists `audience=user` rows, so
  // these are unreachable here — they exist so the map stays exhaustive and a
  // future type cannot be added without the compiler pointing at this file.
  support_ticket_new: {
    label: "New ticket",
    icon: <FiLifeBuoy className="h-5 w-5 text-amber-400" />,
    badge: "bg-amber-500/15 text-amber-400",
  },
  support_ticket_reply: {
    label: "Ticket reply",
    icon: <FiLifeBuoy className="h-5 w-5 text-amber-300" />,
    badge: "bg-amber-500/15 text-amber-300",
  },
  subscription_started: {
    label: "New subscription",
    icon: <FiCreditCard className="h-5 w-5 text-emerald-400" />,
    badge: "bg-emerald-500/15 text-emerald-400",
  },
  subscription_payment_failed: {
    label: "Payment failed",
    icon: <FiCreditCard className="h-5 w-5 text-red-400" />,
    badge: "bg-red-500/15 text-red-400",
  },
};

/** Email preference toggles — exactly the five booleans the backend stores. */
const PREFERENCES: {
  key: keyof NotificationSettings;
  label: string;
  desc: string;
}[] = [
  {
    key: "inappEnabled",
    label: "In-app notifications",
    desc: "Show notifications inside the dashboard",
  },
  {
    key: "emailGradeReady",
    label: "Grade ready",
    desc: "Email when a grading report finishes",
  },
  {
    key: "emailPriceAlert",
    label: "Price alerts",
    desc: "Email on tracked card price moves",
  },
  {
    key: "emailSubscription",
    label: "Subscription",
    desc: "Email for billing and plan changes",
  },
  {
    key: "emailSupport",
    label: "Support",
    desc: "Email when support replies to a ticket",
  },
];

export default function Notification() {
  const { message } = App.useApp();

  // `audience` is explicit even though "user" is the server default — this is
  // the customer-facing page and must never render the staff queue, and an
  // implicit default is one refactor away from doing exactly that.
  const { data, isLoading } = useListNotificationsQuery({
    limit: 50,
    audience: "user",
  });
  const { data: unread } = useGetUnreadCountQuery({ audience: "user" });
  const { data: settings } = useGetNotificationSettingsQuery();

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();
  const [updateSettings, { isLoading: isSavingSettings }] =
    useUpdateNotificationSettingsMutation();

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NotificationSettings | null>(null);

  // Load the stored preferences into the local form once they arrive.
  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  const notifications = (data?.data ?? []).filter(
    (n) => !unreadOnly || !n.isRead,
  );
  const unreadCount = unread?.unreadCount ?? 0;

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteNotification(deletingId).unwrap();
      message.success("Notification deleted");
    } catch {
      message.error("Couldn't delete the notification. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const savePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft || isSavingSettings) return;
    try {
      await updateSettings(draft).unwrap();
      message.success("Preferences saved.");
    } catch {
      message.error("Couldn't save preferences. Try again.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Stay updated with your account activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded border-zinc-600 text-violet-500 focus:ring-violet-500"
            />
            Unread only
          </label>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead({ audience: "user" })}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white transition hover:bg-violet-500"
            >
              <FiCheckCircle className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Unread banner */}
      {unreadCount > 0 && (
        <div className="mb-6 rounded-xl border border-violet-500/30 bg-violet-950/30 p-4">
          <div className="flex items-center gap-2">
            <FiBell className="h-5 w-5 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-white/8 bg-white/5"
            />
          ))
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <FiBell className="mx-auto mb-3 h-12 w-12 text-zinc-600" />
            <p className="text-zinc-400">No notifications found</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const meta = TYPE_META[notification.type] ?? TYPE_META.system;
            return (
              <div
                key={notification._id}
                className={`group relative rounded-xl border p-4 transition-all ${
                  notification.isRead
                    ? "border-white/8 bg-[#111113]"
                    : "border-violet-500/30 bg-violet-950/20 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">{meta.icon}</div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`text-sm font-semibold ${
                            notification.isRead
                              ? "text-zinc-300"
                              : "text-white"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${meta.badge}`}
                          >
                            {meta.label}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          {!notification.isRead && (
                            <span className="rounded-full bg-violet-500 px-2 py-0.5 text-xs text-white">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="rounded-lg p-1.5 text-violet-400 transition hover:bg-violet-500/10"
                            title="Mark as read"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeletingId(notification._id)}
                          className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-500/10"
                          title="Delete"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {notification.body && (
                      <p className="mt-2 text-sm text-zinc-400">
                        {notification.body}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preferences */}
      <div className="mt-12 border-t border-white/10 pt-8">
        <div className="mb-4 flex items-center gap-2">
          <FiSettings className="h-5 w-5 text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
        </div>

        {draft ? (
          <form onSubmit={savePreferences} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {PREFERENCES.map(({ key, label, desc }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={draft[key]}
                    onChange={(e) =>
                      setDraft({ ...draft, [key]: e.target.checked })
                    }
                    className="rounded border-zinc-600 text-violet-500 focus:ring-violet-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{label}</p>
                    <p className="text-xs text-zinc-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="rounded-lg bg-violet-600 px-6 py-2 text-sm text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingSettings ? "Saving…" : "Save Preferences"}
              </button>
            </div>
          </form>
        ) : (
          <div className="h-32 animate-pulse rounded-xl border border-white/8 bg-white/5" />
        )}
      </div>

      <DeleteConfirmationModal
        open={deletingId !== null}
        loading={isDeleting}
        onCancel={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete Notification"
        description="Are you sure you want to delete this notification?"
      />
    </div>
  );
}
