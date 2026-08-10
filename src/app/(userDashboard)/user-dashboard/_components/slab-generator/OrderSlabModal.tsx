"use client";

import { useCreateSlabOrderMutation } from "@/redux/features/slabOrder/slabOrderApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Form, Input, InputNumber, Modal } from "antd";
import { useState } from "react";
import { FiShoppingBag, FiTruck } from "react-icons/fi";
import type { GradedCard, SlabSpec } from "./data";

interface OrderSlabModalProps {
  open: boolean;
  onClose: () => void;
  card: GradedCard;
  spec: SlabSpec;
  slabId?: string;
}

interface OrderFormValues {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  quantity: number;
}

const UNIT_PRICE = 9.99;

export default function OrderSlabModal({
  open,
  onClose,
  card,
  spec,
  slabId,
}: OrderSlabModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<OrderFormValues>();
  const [quantity, setQuantity] = useState(1);
  const [createOrder, { isLoading }] = useCreateSlabOrderMutation();

  const USPS_SHIPPING = 4.99;
  const TAX_RATE = 0.08;
  const subtotal = Number((quantity * UNIT_PRICE).toFixed(2));
  const shippingFee = USPS_SHIPPING;
  const taxAmount = Number((subtotal * TAX_RATE).toFixed(2));
  const totalAmount = (subtotal + shippingFee + taxAmount).toFixed(2);

  const handleSubmit = async (values: OrderFormValues) => {
    if (!slabId) {
      message.error("Please generate or select artwork for your slab first.");
      return;
    }

    try {
      await createOrder({
        slabId,
        slabLabel: slabId,
        amount: Number(totalAmount),
        quantity: values.quantity || 1,
        shippingFee,
        taxAmount,
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          streetAddress: values.streetAddress,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
        },
      }).unwrap();

      message.success("Order placed successfully! USPS shipping label generated.");
      form.resetFields();
      onClose();
    } catch (err) {
      message.error(getApiErrorMessage(err, "Couldn't place order. Try again."));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="flex items-center gap-2 text-lg font-medium text-white">
          <FiShoppingBag className="text-violet-400" /> Order Physical Slab
        </span>
      }
      className="[&_.ant-modal-content]:!bg-[#111113] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent"
    >
      <div className="space-y-4 pt-2">
        {/* Item Summary */}
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-3.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-white">{card.name}</span>
            <span className="rounded-md bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">
              Grade {card.grade.toFixed(1)} {card.gradeLabel}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            {spec.label} · {spec.widthMm} × {spec.heightMm} mm Acrylic Slab Holder
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ quantity: 1, country: "United States" }}
          requiredMark={false}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="fullName"
              label={<span className="text-xs text-zinc-300">Full Name</span>}
              rules={[{ required: true, message: "Full Name is required" }]}
            >
              <Input placeholder="John Doe" className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="text-xs text-zinc-300">Phone Number</span>}
              rules={[{ required: true, message: "Phone is required" }]}
            >
              <Input placeholder="+1 555-0199" className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
            </Form.Item>
          </div>

          <Form.Item
            name="streetAddress"
            label={<span className="text-xs text-zinc-300">Street Address</span>}
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input placeholder="123 Collector Way, Suite 4" className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-3">
            <Form.Item
              name="city"
              label={<span className="text-xs text-zinc-300">City</span>}
              rules={[{ required: true, message: "City is required" }]}
            >
              <Input placeholder="New York" className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
            </Form.Item>

            <Form.Item
              name="state"
              label={<span className="text-xs text-zinc-300">State / Region</span>}
            >
              <Input placeholder="NY" className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
            </Form.Item>

            <Form.Item
              name="postalCode"
              label={<span className="text-xs text-zinc-300">ZIP / Postal</span>}
              rules={[{ required: true, message: "Postal code is required" }]}
            >
              <Input placeholder="10001" className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="country"
              label={<span className="text-xs text-zinc-300">Country</span>}
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input placeholder="United States" className="!rounded-lg !border-white/15 !bg-zinc-950 !text-white" />
            </Form.Item>

            <Form.Item
              name="quantity"
              label={<span className="text-xs text-zinc-300">Quantity</span>}
              rules={[{ required: true, message: "Quantity is required" }]}
            >
              <InputNumber
                min={1}
                max={50}
                value={quantity}
                onChange={(v) => setQuantity(v || 1)}
                className="w-full !rounded-lg !border-white/15 !bg-zinc-950 !text-white"
              />
            </Form.Item>
          </div>

          {/* Itemized Pricing breakdown */}
          <div className="mt-4 rounded-xl border border-white/10 bg-[#0d0d0f] p-3 text-xs space-y-2">
            <div className="flex justify-between text-zinc-300">
              <span>Slab Subtotal ({quantity} × $9.99):</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span className="flex items-center gap-1.5">
                <span className="rounded bg-blue-500/20 px-1 py-0.5 text-[10px] font-bold text-blue-400">USPS</span>
                Standard Shipping:
              </span>
              <span className="font-mono">${shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Estimated Sales Tax (8%):</span>
              <span className="font-mono">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex items-center justify-between font-semibold text-sm">
              <span className="text-white">Checkout Total:</span>
              <span className="text-amber-400 font-bold">${totalAmount} USD</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-5 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-2 text-xs font-medium text-white transition-colors hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              <FiTruck size={14} />
              {isLoading ? "Placing order…" : `Confirm & Order ($${totalAmount})`}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
