"use client";

import BackHeading from "../_components/BackHeading";
import {
  useExportLabelOnlyMutation,
  useExportPrintSlabMutation,
} from "@/redux/features/slab/slabApi";
import {
  useGetAllSlabOrdersQuery,
  usePurchaseShippoLabelMutation,
  useUpdateSlabOrderStatusMutation,
  type TSlabOrder,
  type TSlabOrderStatus,
} from "@/redux/features/slabOrder/slabOrderApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Button, Form, Input, Modal, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FiDownload, FiFileText, FiPrinter, FiTruck } from "react-icons/fi";

const STATUS_COLOR: Partial<Record<TSlabOrderStatus, string>> = {
  order_received: "blue",
  processing: "gold",
  ready_to_ship: "cyan",
  shipped: "purple",
  delivered: "green",
  shipping_exception: "volcano",
  shipping_error: "red",
  pending: "orange",
  cancelled: "red",
};

export const dynamic = "force-dynamic";

export default function AdminSlabOrdersPage() {
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<TSlabOrder | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [purchasingOrderId, setPurchasingOrderId] = useState<string | null>(null);

  const { data, isLoading } = useGetAllSlabOrdersQuery({
    page,
    limit: 20,
    status: statusFilter,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateSlabOrderStatusMutation();
  const [purchaseShippoLabel] = usePurchaseShippoLabelMutation();
  const [exportPrint] = useExportPrintSlabMutation();
  const [exportLabel] = useExportLabelOnlyMutation();
  const [form] = Form.useForm();

  const handlePurchaseLabel = async (order: TSlabOrder) => {
    setPurchasingOrderId(order._id);
    try {
      const updatedOrder = await purchaseShippoLabel({ orderId: order._id }).unwrap();
      message.success(`Shippo shipping label purchased! Tracking #: ${updatedOrder.trackingNumber}`);
    } catch (err) {
      message.error(getApiErrorMessage(err, "Failed to purchase Shippo label."));
    } finally {
      setPurchasingOrderId(null);
    }
  };

  const handleDownload = async (labelId: string, format: "png" | "pdf") => {
    const key = `${format}-${labelId}`;
    setDownloadingKey(key);
    try {
      const blob = await exportLabel({ labelId, format }).unwrap();

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `label_only_${labelId}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      message.error(getApiErrorMessage(err, "Couldn't download label file."));
    } finally {
      setDownloadingKey(null);
    }
  };

  const orders = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleOpenStatusModal = (order: TSlabOrder) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber ?? "",
      notes: order.notes ?? "",
    });
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (values: {
    orderStatus: TSlabOrderStatus;
    trackingNumber?: string;
    notes?: string;
  }) => {
    if (!selectedOrder) return;
    try {
      await updateStatus({
        orderId: selectedOrder._id,
        orderStatus: values.orderStatus,
        trackingNumber: values.trackingNumber,
        notes: values.notes,
      }).unwrap();

      message.success("Order status updated successfully!");
      setStatusModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      message.error(getApiErrorMessage(err, "Couldn't update order status."));
    }
  };

  const columns: ColumnsType<TSlabOrder> = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNum: string, record) => (
        <div>
          <span className="font-mono text-xs font-bold text-violet-300">
            {orderNum || `#PG-${record._id.slice(-5).toUpperCase()}`}
          </span>
          <span className="block text-[11px] text-zinc-500">
            {new Date(record.createdAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "user",
      render: (_, record) => (
        <div>
          <span className="block text-xs font-medium text-white">{record.user?.name ?? "Customer"}</span>
          <span className="block text-[11px] text-zinc-400">{record.user?.email}</span>
        </div>
      ),
    },
    {
      title: "Shipping Address",
      key: "address",
      render: (_, record) => {
        const addr = record.shippingAddress;
        if (!addr) return <span className="text-xs text-zinc-500">—</span>;
        return (
          <div className="max-w-xs text-xs text-zinc-300">
            <span className="block font-medium text-white">{addr.fullName}</span>
            <span className="block truncate text-zinc-400">{addr.streetAddress}</span>
            <span className="block text-zinc-400">
              {addr.city}, {addr.state ? `${addr.state} ` : ""}{addr.postalCode}
            </span>
            <span className="block font-medium text-amber-400">{addr.country}</span>
          </div>
        );
      },
    },
    {
      title: "Custom Slabs & Pricing",
      key: "card",
      render: (_, record) => {
        const items = record.items || [];
        const sub = record.subtotal ?? 24.99;
        const ship = record.shippingFee ?? 5.95;
        const tax = record.taxAmount ?? sub * 0.085;
        return (
          <div className="text-xs">
            {items.length > 0 ? (
              <div className="space-y-0.5 mb-1">
                {items.map((i, idx) => (
                  <div key={idx} className="font-medium text-white">
                    {i.cardName} <span className="text-[10px] text-violet-300">(Grade {i.grade})</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="block font-medium text-white">Custom Slab</span>
            )}
            <div className="space-y-0.5 text-[10px] text-zinc-400">
              <span>Qty: {record.quantity} · Sub: ${sub.toFixed(2)}</span>
              <span className="block">Shipping: ${ship.toFixed(2)} · Tax: ${tax.toFixed(2)}</span>
              <span className="block text-amber-400 font-bold">Total: ${record.totalAmount.toFixed(2)} USD</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Print Files",
      key: "printFiles",
      render: (_, record) => {
        const firstItemSlab = record.items?.[0]?.slab;
        const labelId =
          typeof firstItemSlab === "object" && firstItemSlab !== null
            ? firstItemSlab._id
            : typeof record.slab === "object" && record.slab !== null
              ? record.slab._id
              : (firstItemSlab as string | undefined);
        if (!labelId) return <span className="text-xs text-zinc-500">N/A</span>;
        const pngBusy = downloadingKey === `png-${labelId}`;
        const pdfBusy = downloadingKey === `pdf-${labelId}`;
        return (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              disabled={pngBusy || pdfBusy}
              onClick={() => handleDownload(labelId, "png")}
              className="inline-flex items-center gap-1 rounded border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[11px] font-medium text-violet-300 transition-colors hover:bg-violet-500/20 disabled:opacity-50 cursor-pointer"
            >
              <FiDownload size={11} /> {pngBusy ? "Building…" : "Label PNG"}
            </button>
            <button
              type="button"
              disabled={pngBusy || pdfBusy}
              onClick={() => handleDownload(labelId, "pdf")}
              className="inline-flex items-center gap-1 rounded border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/10 disabled:opacity-50 cursor-pointer"
            >
              <FiFileText size={11} /> {pdfBusy ? "Building…" : "Label PDF"}
            </button>
          </div>
        );
      },
    },
    {
      title: "Status & Shippo Label",
      key: "status",
      render: (_, record) => {
        const hasLabel = Boolean(record.shippo?.labelUrl);
        const isPurchasing = purchasingOrderId === record._id;

        return (
          <div className="space-y-2">
            <div>
              <Tag color={STATUS_COLOR[record.orderStatus] || "blue"} className="capitalize font-medium">
                {record.orderStatus?.replace("_", " ")}
              </Tag>
              {record.trackingNumber && (
                <span className="block mt-1 font-mono text-[10px] text-zinc-400">
                  <FiTruck className="inline mr-1" /> {record.trackingNumber}
                </span>
              )}
            </div>

            {hasLabel ? (
              <a
                href={record.shippo?.labelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-500 cursor-pointer"
              >
                <FiPrinter size={11} /> Print Shipping Label
              </a>
            ) : (
              <button
                type="button"
                disabled={isPurchasing}
                onClick={() => handlePurchaseLabel(record)}
                className="inline-flex items-center gap-1 rounded bg-violet-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50 cursor-pointer"
              >
                <FiTruck size={11} /> {isPurchasing ? "Purchasing..." : "Create Shipping Label"}
              </button>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
          type="button"
          onClick={() => handleOpenStatusModal(record)}
          className="inline-flex items-center gap-1 rounded border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-white/10 cursor-pointer"
        >
          Update Status
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <BackHeading label="Physical Slab Orders" />

      <div className="flex items-center justify-between gap-4">
        <Select
          allowClear
          placeholder="Filter by Order Status"
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-52 [&_.ant-select-selector]:!rounded-full [&_.ant-select-selector]:!border-zinc-800 [&_.ant-select-selector]:!bg-zinc-950 [&_.ant-select-selection-item]:!text-white"
          options={[
            { label: "Order Received", value: "order_received" },
            { label: "Processing", value: "processing" },
            { label: "Ready to Ship", value: "ready_to_ship" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
          ]}
        />

        <span className="text-xs text-zinc-400">
          Total Orders: <strong className="text-white">{total}</strong>
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111113] p-4">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: 20,
            total,
            onChange: (p) => setPage(p),
          }}
          className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!border-white/8 [&_.ant-table-cell]:!bg-transparent [&_.ant-table-cell]:!text-white [&_.ant-table-thead_.ant-table-cell]:!bg-white/5 [&_.ant-table-thead_.ant-table-cell]:!text-zinc-400"
        />
      </div>

      <Modal
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        footer={null}
        title="Update Order Status & Tracking"
        className="[&_.ant-modal-content]:!bg-[#111113] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-title]:!text-white"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateStatus}
          requiredMark={false}
          className="mt-4 space-y-4"
        >
          <Form.Item
            name="orderStatus"
            label={<span className="text-xs text-zinc-300">Order Status</span>}
            rules={[{ required: true }]}
          >
            <Select
              className="w-full"
              options={[
                { label: "Order Received", value: "order_received" },
                { label: "Processing", value: "processing" },
                { label: "Ready to Ship", value: "ready_to_ship" },
                { label: "Shipped", value: "shipped" },
                { label: "Delivered", value: "delivered" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="trackingNumber"
            label={<span className="text-xs text-zinc-300">Tracking Number</span>}
          >
            <Input placeholder="e.g. 940011189956..." className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
          </Form.Item>

          <Form.Item
            name="notes"
            label={<span className="text-xs text-zinc-300">Notes / Internal Comment</span>}
          >
            <Input.TextArea rows={3} placeholder="Add any internal processing notes…" className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
