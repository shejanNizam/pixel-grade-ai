"use client";

import EmptyState from "@/components/shared/EmptyState";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { App, Button, Select } from "antd";
import { useState } from "react";
import { FiFileText } from "react-icons/fi";

type ReportType = "revenue" | "users" | "orders";

interface Report {
  id: string;
  type: ReportType;
  generated: string;
}

const typeLabel: Record<ReportType, string> = {
  revenue: "Revenue report",
  users: "User growth report",
  orders: "Orders report",
};

// Demo page showing the Skeleton (loading) and EmptyState components together.
export default function AdminReportsPage() {
  const { message } = App.useApp();
  const [type, setType] = useState<ReportType>("revenue");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  // Fake an async generate call so the skeleton state is visible.
  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setReports((prev) => [
        {
          id: `RPT-${String(prev.length + 1).padStart(3, "0")}`,
          type,
          generated: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      setLoading(false);
      message.success("Report generated (demo).");
    }, 900);
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Reports
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Demonstrates the Skeleton (loading) and EmptyState components.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select<ReportType>
          size="large"
          value={type}
          onChange={setType}
          className="sm:max-w-xs w-full"
          options={[
            { value: "revenue", label: "Revenue report" },
            { value: "users", label: "User growth report" },
            { value: "orders", label: "Orders report" },
          ]}
        />
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={generate}
        >
          Generate report
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={<FiFileText />}
          title="No reports generated"
          description="Pick a report type above and generate one to see it listed here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
            >
              <FiFileText className="text-2xl text-blue-500" />
              <h3 className="mt-3 font-medium text-gray-900 dark:text-gray-100">
                {typeLabel[report.type]}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {report.id} · {report.generated}
              </p>
              <Button
                size="small"
                className="mt-4"
                onClick={() => message.info(`Download ${report.id} (demo)`)}
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
