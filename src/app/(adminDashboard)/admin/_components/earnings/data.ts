/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

export const earnings = [
  { label: "Total earnings", value: "$ 50.8K", delta: "20.4 %" },
  { label: "Withdrawal amount", value: "$ 23.6K", delta: "1.5 %" },
  { label: "Pending amount", value: "$ 2.3K", delta: "1.2 %" },
];

export interface Transaction {
  id: string;
  ref: string;
  name: string;
  tranId: string;
  email: string;
  date: string;
  country: string;
  total: string;
}

export const transactions: Transaction[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: String(i + 1),
    ref: "#1532",
    name: "John Carter",
    tranId: "#84950520324",
    email: "hello@johncarter.com",
    date: "Jan 30, 2024",
    country: "United States",
    total: "$ 10",
  }),
);

export const PAGE_SIZE = 6;
