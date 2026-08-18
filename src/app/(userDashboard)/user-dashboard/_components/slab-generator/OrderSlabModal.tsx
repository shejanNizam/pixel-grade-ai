"use client";

import { Modal } from "antd";
import { FiShoppingBag } from "react-icons/fi";
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
}: OrderSlabModalProps) {
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
      <div className="space-y-4 py-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/20 text-violet-400">
          <FiShoppingBag size={26} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Coming Soon</h3>
          <p className="text-sm font-medium text-violet-300">
            Physical Slab Ordering &amp; Fulfillment
          </p>
        </div>
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-zinc-400">
          Physical slab production and shipping fulfillment will be enabled once
          our fulfillment network and custom holder manufacturing are fully ready.
        </p>

        {card && (
          <div className="mx-auto mt-4 max-w-xs rounded-xl border border-white/10 bg-[#0d0d0f] p-3 text-left">
            <p className="text-xs font-medium text-white">{card.name}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Grade {card.grade.toFixed(1)} {card.gradeLabel} · {spec.label}
            </p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full bg-violet-600 px-6 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}
