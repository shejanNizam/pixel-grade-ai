import Link from "next/link";
import { FiBell, FiDatabase, FiShield, FiUser } from "react-icons/fi";

export default function SettingsPage() {
  const settingsItems = [
    {
      id: "profile",
      title: "Profile",
      description: "Update your personal information and preferences",
      icon: FiUser,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      action: "Edit",
      href: "/user-dashboard/settings/profile",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage email and push notification settings",
      icon: FiBell,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      action: "Configure",
      href: "/user-dashboard/settings/notification",
    },
    {
      id: "security",
      title: "Security",
      description: "Password change",
      icon: FiShield,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      action: "Manage",
      href: "/user-dashboard/settings/security",
    },
    {
      id: "data-privacy",
      title: "Data & Privacy",
      description: "Export data, delete account, privacy settings",
      icon: FiDatabase,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      action: "View",
      href: "/user-dashboard/settings/data-privacy",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your account and preferences.
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-3 sm:space-y-4">
          {settingsItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm dark:hover:shadow-gray-900/50 transition-all duration-200"
            >
              <div className="p-4 sm:p-6 flex items-center justify-between gap-3 sm:gap-4">
                {/* Left side: Icon and text */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div
                    className={`${item.iconBg} ${item.iconColor} p-2.5 sm:p-3 rounded-lg shrink-0`}
                  >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Text content */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 sm:line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right side: Action text */}
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 shrink-0">
                  {item.action}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
