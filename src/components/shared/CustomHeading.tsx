import { PropsWithChildren } from "react";

export default function CustomHeading({ children }: PropsWithChildren) {
  return (
    <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-600 dark:text-white transition-colors">
      {children}
    </h2>
  );
}
