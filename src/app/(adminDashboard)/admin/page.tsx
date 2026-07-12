import {
  FiActivity,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    label: "Total Users",
    value: "—",
    icon: FiUsers,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Active Sessions",
    value: "—",
    icon: FiActivity,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    label: "Revenue",
    value: "—",
    icon: FiDollarSign,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    label: "Growth",
    value: "—",
    icon: FiTrendingUp,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function AdminDashboard() {
  return (
    <div className="w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Admin Overview
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          High-level metrics for your platform. Replace these placeholders with
          real data from your API.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <div
                className={`${stat.iconBg} ${stat.iconColor} p-2 rounded-lg`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Recent Activity
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Wire this panel to an activity/audit-log endpoint.
          </p>
        </div>
        <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Quick Actions
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add shortcuts for common admin tasks here.
          </p>
        </div>
      </div>
    </div>
  );
}
