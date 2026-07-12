"use client";

import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import { App } from "antd";
import { useMemo, useState } from "react";
import {
  FiAlertCircle as AlertCircle,
  FiBell as Bell,
  FiCheck as Check,
  FiCheckCircle as CheckCircle,
  FiFilter as Filter,
  FiInfo as Info,
  FiSettings as Settings,
  FiTrash2 as Trash2,
  FiX as X,
} from "react-icons/fi";

type Severity = "info" | "warning" | "error";

interface Notification {
  id: string;
  type: string;
  severity: Severity;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Frontend-only demo data. Replace with a real notifications endpoint.
const demoNotifications: Notification[] = [
  {
    id: "1",
    type: "rule_triggered",
    severity: "info",
    title: "Welcome to the dashboard",
    message: "This is a demo notification. Wire this list up to your API.",
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    type: "rule_violated",
    severity: "warning",
    title: "Heads up",
    message: "A warning-level notification example.",
    is_read: false,
    created_at: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "3",
    type: "session_locked",
    severity: "error",
    title: "Something needs attention",
    message: "An error-level notification example.",
    is_read: true,
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
];

export default function Notification() {
  const { message } = App.useApp();
  const [notifications, setNotifications] =
    useState<Notification[]>(demoNotifications);
  const [filters, setFilters] = useState({
    unread: false,
    type: "",
    severity: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    notify_rule_triggered: true,
    notify_rule_violated: true,
    notify_session_locked: true,
    notify_session_unlocked: true,
    auto_delete_after_days: 30,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    type: "single" | "all";
    id?: string;
  }>({ open: false, type: "single" });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filters.unread && n.is_read) return false;
      if (filters.type && n.type !== filters.type) return false;
      if (filters.severity && n.severity !== filters.severity) return false;
      return true;
    });
  }, [notifications, filters]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    message.success("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    message.success("All notifications marked as read");
  };

  const confirmDelete = () => {
    if (deleteModal.type === "single" && deleteModal.id) {
      setNotifications((prev) => prev.filter((n) => n.id !== deleteModal.id));
      message.success("Notification deleted");
    } else if (deleteModal.type === "all") {
      setNotifications([]);
      message.success("All notifications cleared");
    }
    setDeleteModal({ open: false, type: "single" });
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only demo: no API call.
    message.success("Settings updated (demo).");
  };

  const getSeverityStyles = (severity: Severity) => {
    switch (severity) {
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-950/20",
          border: "border-red-200 dark:border-red-800",
          icon: (
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          ),
          badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-950/20",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: (
            <AlertCircle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
          ),
          badge:
            "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
        };
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-200 dark:border-blue-800",
          icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
          badge:
            "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        };
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stay updated with your account activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <Filter className="w-5 h-5" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              <CheckCircle className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Unread Count Banner */}
      {unreadCount > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.unread}
                onChange={(e) =>
                  setFilters({ ...filters, unread: e.target.checked })
                }
                className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Unread only
              </span>
            </label>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="rule_triggered">Rule Triggered</option>
              <option value="rule_violated">Rule Violated</option>
              <option value="session_locked">Session Locked</option>
              <option value="session_unlocked">Session Unlocked</option>
            </select>

            <select
              value={filters.severity}
              onChange={(e) =>
                setFilters({ ...filters, severity: e.target.value })
              }
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          {(filters.unread || filters.type || filters.severity) && (
            <button
              onClick={() =>
                setFilters({ unread: false, type: "", severity: "" })
              }
              className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No notifications found
            </p>
          </div>
        ) : (
          filtered.map((notification) => {
            const style = getSeverityStyles(notification.severity);
            return (
              <div
                key={notification.id}
                className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                  !notification.is_read
                    ? `${style.bg} ${style.border} shadow-sm`
                    : "bg-white dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">{style.icon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`text-sm font-semibold ${
                            !notification.is_read
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}
                          >
                            {notification.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                          </span>
                          {!notification.is_read && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              type: "single",
                              id: notification.id,
                            })
                          }
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setDeleteModal({ open: true, type: "all" })}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear all notifications
            </button>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preferences
          </h2>
        </div>

        <form onSubmit={handleUpdateSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(
              [
                [
                  "notify_rule_triggered",
                  "Rule Triggered",
                  "Soft rule threshold breaches",
                ],
                [
                  "notify_rule_violated",
                  "Rule Violated",
                  "Hard rule threshold breaches",
                ],
                [
                  "notify_session_locked",
                  "Session Locked",
                  "When session is locked",
                ],
                [
                  "notify_session_unlocked",
                  "Session Unlocked",
                  "When session is unlocked",
                ],
              ] as const
            ).map(([key, label, desc]) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <input
                  type="checkbox"
                  checked={settingsForm[key]}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      [key]: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {desc}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto-delete after:
            </label>
            <select
              value={settingsForm.auto_delete_after_days}
              onChange={(e) =>
                setSettingsForm({
                  ...settingsForm,
                  auto_delete_after_days: parseInt(e.target.value),
                })
              }
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="0">Never</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      <DeleteConfirmationModal
        open={deleteModal.open}
        loading={false}
        onCancel={() => setDeleteModal({ ...deleteModal, open: false })}
        onConfirm={confirmDelete}
        title={
          deleteModal.type === "single"
            ? "Delete Notification"
            : "Clear All Notifications"
        }
        description={
          deleteModal.type === "single"
            ? "Are you sure you want to delete this notification?"
            : "Are you sure you want to delete all notifications? This action cannot be undone."
        }
      />
    </div>
  );
}
