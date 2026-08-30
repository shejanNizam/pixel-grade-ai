"use client";

import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import type { GradedCard, SlabSpec } from "./data";

interface OrderSlabModalProps {
  open: boolean;
  onClose: () => void;
  card: GradedCard;
  spec: SlabSpec;
  slabId?: string;
}

export default function OrderSlabModal({
  open,
  onClose,
  card,
  spec,
  slabId,
}: OrderSlabModalProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [addToCart] = useAddToCartMutation();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!slabId) {
      message.error("Generate the slab first before adding to cart.");
      return;
    }

    setLoading(true);
    try {
      await addToCart({ slabId }).unwrap();
      message.success(`${card.name} Custom Slab added to your cart!`);
      onClose();
      router.push("/user-dashboard/cart");
    } catch (err) {
      message.error(getApiErrorMessage(err, "Couldn't add item to cart."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="flex items-center gap-2 text-lg font-medium text-white">
          <FiShoppingBag className="text-violet-400" /> Add Physical Slab to Cart
        </span>
      }
      className="[&_.ant-modal-content]:!bg-[#111113] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent"
    >
      <div className="space-y-4 py-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/20 text-violet-400">
          <FiShoppingCart size={26} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Custom Physical Slab</h3>
          <p className="text-sm font-medium text-violet-300">
            $0.99 per slab · Quantity 1
          </p>
        </div>
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-zinc-400">
          Get this custom slab produced in-house and shipped directly to your address. You can review your cart and calculate live USPS shipping rates at checkout.
        </p>

        {card && (
          <div className="mx-auto mt-4 max-w-xs rounded-xl border border-white/10 bg-[#0d0d0f] p-3 text-left">
            <p className="text-xs font-medium text-white">{card.name}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Grade {card.grade.toFixed(1)} {card.gradeLabel} · {spec.label}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-white/15 px-5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 cursor-pointer rounded-full bg-violet-600 px-6 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
          >
            <FiShoppingCart size={14} />
            {loading ? "Adding..." : "Add to Cart ($0.99)"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
