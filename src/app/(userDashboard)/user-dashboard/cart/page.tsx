"use client";

import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  type TCartItem,
} from "@/redux/features/cart/cartApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowRight, FiShoppingBag, FiTrash2 } from "react-icons/fi";

const FALLBACK_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

export default function CartPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const { data: cartData, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const cart = cartData?.data;
  const items = cart?.items ?? [];

  const subtotal = items.reduce((acc, item) => acc + (item.price || 24.99), 0);

  const handleRemove = async (item: TCartItem) => {
    setRemovingId(item._id);
    try {
      await removeFromCart({ itemId: item._id }).unwrap();
      message.success(`Removed ${item.cardName} slab from cart.`);
    } catch (err) {
      message.error(getApiErrorMessage(err, "Couldn't remove item."));
    } finally {
      setRemovingId(null);
    }
  };

  const handleClear = () => {
    modal.confirm({
      title: "Clear your cart?",
      content: "This removes all custom slabs from your shopping cart.",
      okText: "Clear Cart",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await clearCart().unwrap();
          message.success("Cart cleared.");
        } catch (err) {
          message.error(getApiErrorMessage(err, "Couldn't clear cart."));
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-2xl border border-white/10 bg-[#111113]" />
        <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-[#111113]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-white">Shopping Cart</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Review your custom physical slabs before proceeding to checkout.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#111113] p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400">
            <FiShoppingBag size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white">Your cart is empty</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Scan and grade a card, generate your custom slab artwork, then add it to your cart to order physical slabs.
            </p>
          </div>
          <Link
            href="/user-dashboard/slab-generator"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Go to Slab Generator <FiArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ---- Cart Items List ---- */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111113] p-4 transition-colors hover:border-violet-500/30"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                  <Image
                    src={item.compositeUrl || FALLBACK_IMAGE}
                    alt={item.cardName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {item.cardName} Custom Slab
                  </h4>
                  <p className="mt-1 text-xs text-violet-300">
                    Grade {item.grade.toFixed(1)} {item.gradeLabel}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Quantity: 1 (Custom One-off Slab)
                  </p>
                </div>

                <div className="text-right shrink-0 space-y-2">
                  <p className="text-base font-bold text-white tabular-nums">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    type="button"
                    disabled={removingId === item._id}
                    onClick={() => handleRemove(item)}
                    className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <FiTrash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ---- Cart Order Summary ---- */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-white/10 bg-[#111113] p-6 space-y-5">
              <h3 className="text-base font-medium text-white">Order Summary</h3>

              <div className="space-y-3 text-xs text-zinc-400 border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
                  <span className="font-semibold text-white tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping (USPS Ground)</span>
                  <span className="text-zinc-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8.5%)</span>
                  <span className="text-zinc-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-sm font-semibold text-white">
                <span>Subtotal</span>
                <span className="text-lg text-violet-300 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/user-dashboard/checkout")}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-violet-500 cursor-pointer"
              >
                Continue to Checkout <FiArrowRight size={14} />
              </button>

              <p className="text-center text-[11px] text-zinc-500">
                Shippo-validated address &amp; live USPS Ground rates on next step.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
