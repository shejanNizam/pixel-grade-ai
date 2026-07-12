"use client";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome!
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            This is your dashboard overview. Replace this placeholder with your
            app&apos;s content.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Placeholder card {i}
              </h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                —
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
