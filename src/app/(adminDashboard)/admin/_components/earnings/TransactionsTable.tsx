"use client";

import { Table, type TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { PAGE_SIZE, transactions, type Transaction } from "./data";

export default function TransactionsTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return transactions;

    return transactions.filter(
      (row) =>
        row.name.toLowerCase().includes(term) ||
        row.ref.toLowerCase().includes(term) ||
        row.tranId.toLowerCase().includes(term),
    );
  }, [query]);

  const cell = (value: string) => (
    <span className="text-xs text-zinc-300">{value}</span>
  );

  const columns: TableColumnsType<Transaction> = [
    {
      title: "Id",
      dataIndex: "ref",
      key: "ref",
      width: 100,
      render: (ref: string) => (
        <span className="text-xs text-zinc-400">{ref}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: cell,
    },
    {
      title: "Tran. ID",
      dataIndex: "tranId",
      key: "tranId",
      align: "center",
      render: cell,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: cell,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: cell,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      align: "center",
      render: cell,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
      width: 110,
      render: (total: string) => (
        <span className="text-xs text-white tabular-nums">{total}</span>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-white">
          Total transactions ( {rows.length} )
        </h2>

        <div className="relative w-full sm:w-80">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or ID"
            aria-label="Search transactions by name or ID"
            className="w-full rounded-full bg-white py-2.5 pr-13 pl-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <span className="absolute top-1/2 right-1 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white">
            <FiSearch size={16} />
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <Table<Transaction>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          pagination={{
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            // The design labels the arrows "Back" and "Next" rather than using
            // bare chevrons.
            itemRender: (_page, type, element) => {
              if (type === "prev") {
                return (
                  <button className="inline-flex items-center gap-1 px-1 text-xs">
                    <FiChevronLeft size={12} />
                    Back
                  </button>
                );
              }
              if (type === "next") {
                return (
                  <button className="inline-flex items-center gap-1 px-1 text-xs">
                    Next
                    <FiChevronRight size={12} />
                  </button>
                );
              }
              return element;
            },
          }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </div>
    </section>
  );
}
