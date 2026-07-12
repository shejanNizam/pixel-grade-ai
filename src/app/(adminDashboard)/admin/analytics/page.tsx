"use client";

import { Progress, Tag } from "antd";
import {
  FiActivity,
  FiDollarSign,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

// Demo data — replace with your analytics endpoint.
const stats = [
  {
    label: "Total users",
    value: "8,214",
    change: "+12.4%",
    up: true,
    icon: FiUsers,
  },
  {
    label: "Revenue (MTD)",
    value: "$47,320",
    change: "+8.1%",
    up: true,
    icon: FiDollarSign,
  },
  {
    label: "Active sessions",
    value: "1,092",
    change: "-3.2%",
    up: false,
    icon: FiActivity,
  },
];

const trafficSources = [
  { source: "Organic search", percent: 48 },
  { source: "Direct", percent: 27 },
  { source: "Referral", percent: 15 },
  { source: "Social", percent: 10 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          A demo stat-card layout. Feed these from your metrics API.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Trend = stat.up ? FiTrendingUp : FiTrendingDown;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </h3>
                <Icon className="text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
              <p
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                  stat.up ? "text-green-600" : "text-red-600"
                }`}
              >
                <Trend />
                {stat.change} vs last month
              </p>
            </div>
          );
        })}
      </div>

      {/* Traffic sources */}
      <div className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Traffic sources
          </h2>
          <Tag color="blue">Last 30 days</Tag>
        </div>
        <div className="mt-4 space-y-4">
          {trafficSources.map((item) => (
            <div key={item.source}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {item.source}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {item.percent}%
                </span>
              </div>
              <Progress percent={item.percent} showInfo={false} size="small" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
