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
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
  FiZap,
} from "react-icons/fi";

const FALLBACK_IMAGE = "/assets/user-dashboard/recent_scan_card.png";
const FREE_SHIPPING_THRESHOLD = 50.0;
const DEFAULT_SLAB_PRICE = 0.99;

export default function CartPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const { data: cartData, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );

  const cart = cartData?.data;
  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (acc, item) =>
      acc + (item.price || DEFAULT_SLAB_PRICE) * (item.quantity || 1),
    0,
  );
  const totalQuantity = items.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0,
  );

  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );
  const isFreeShippingQualified = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShippingQualified ? 0 : 5.95;
  const taxAmount = Number((subtotal * 0.085).toFixed(2));
  const grandTotal = Number((subtotal + shippingFee + taxAmount).toFixed(2));

  const handleRemove = async (item: TCartItem) => {
    setRemovingId(item._id);
    try {
      await removeFromCart({ itemId: item._id }).unwrap();
      message.success(`Removed ${item.cardName} from cart.`);
    } catch (err) {
      message.error(getApiErrorMessage(err, "Couldn't remove item."));
    } finally {
      setRemovingId(null);
    }
  };

  const handleClear = () => {
    modal.confirm({
      title: "Clear your cart?",
      content: "This removes all items from your shopping cart.",
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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header & Steps Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Shopping Cart
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Review your selected items before proceeding to checkout.
          </p>
        </div>

        {/* Steps indicator matching PDF page 2 mockup */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 rounded-full bg-purple-600/30 border border-purple-500/50 px-3 py-1 text-purple-300">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white">
              1
            </span>{" "}
            Cart
          </span>
          <span className="text-zinc-600">—</span>
          <span className="text-zinc-500">2 Checkout</span>
          <span className="text-zinc-600">—</span>
          <span className="text-zinc-500">3 Confirmation</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#111113] p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400">
            <FiShoppingBag size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white">
              Your cart is empty
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Browse our products or grade a custom slab to add items to your
              shopping cart.
            </p>
          </div>
          <Link
            href="/pixelscope"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Browse PixelScope <FiArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ---- Left Column: Free Shipping Bar & Cart Items ---- */}
          <div className="space-y-5">
            {/* Free Shipping Progress Banner (PDF Page 1 & 2 requirement) */}
            <div className="rounded-2xl border border-purple-500/30 bg-zinc-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-2">
                  <FiTruck className="text-purple-400" />
                  {isFreeShippingQualified
                    ? "🎉 You qualify for FREE shipping!"
                    : `You're $${amountNeededForFreeShipping.toFixed(2)} away from FREE shipping!`}
                </span>
                <span className="text-zinc-400 font-mono text-[11px]">
                  ${subtotal.toFixed(2)} / ${FREE_SHIPPING_THRESHOLD.toFixed(2)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-linear-to-r from-purple-600 to-indigo-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Cart Items Card List */}
            <div className="space-y-3">
              {items.map((item) => {
                const itemPrice = item.price || DEFAULT_SLAB_PRICE;
                const isSelected = selectedItems[item._id] ?? true;

                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-[#111113] p-3.5 sm:p-4 transition-colors hover:border-purple-500/30"
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        setSelectedItems({
                          ...selectedItems,
                          [item._id]: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />

                    {/* Image */}
                    <div className="relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                      <Image
                        src={item.compositeUrl || FALLBACK_IMAGE}
                        alt={item.cardName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.cardName.includes("PixelScope")
                          ? item.cardName
                          : item.cardName.includes("Custom Slab")
                            ? item.cardName
                            : `${item.cardName} Custom Slab`}
                      </h4>

                      <p className="mt-1 text-[11px] font-semibold text-purple-400">
                        {item.cardName.includes("PixelScope")
                          ? '10X-15X Magnification • 2.1" IPS Screen'
                          : `Grade ${item.grade ? item.grade.toFixed(1) : "9.5"} ${item.gradeLabel || "GEM MINT"}`}
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-400">
                        Quantity:{" "}
                        <span className="font-bold text-white">
                          {item.quantity || 1}
                        </span>{" "}
                        • ${itemPrice.toFixed(2)} each
                      </p>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-right shrink-0 space-y-2">
                      <p className="text-sm sm:text-base font-extrabold text-white tabular-nums">
                        ${(itemPrice * (item.quantity || 1)).toFixed(2)}
                      </p>
                      <button
                        type="button"
                        disabled={removingId === item._id}
                        onClick={() => handleRemove(item)}
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <FiTrash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls Bar (Matching PDF page 2 mockup) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div className="text-xs text-zinc-400">
                Update quantities or manage selected items
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                <FiTrash2 size={13} />
                <span>Clear cart</span>
              </button>
            </div>
          </div>

          {/* ---- Right Column: Order Summary & Trust Cards ---- */}
          <div className="space-y-4">
            {/* Order Summary Sticky Card */}
            <div className="sticky top-6 rounded-2xl border border-white/10 bg-zinc-950 p-5 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">Order Summary</h3>

              <div className="space-y-2.5 text-xs text-zinc-300 border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({totalQuantity}{" "}
                    {totalQuantity === 1 ? "item" : "items"})
                  </span>
                  <span className="font-semibold text-white tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping (USPS Ground)</span>
                  <span
                    className={
                      isFreeShippingQualified
                        ? "text-emerald-400 font-bold"
                        : "font-semibold text-white"
                    }
                  >
                    {isFreeShippingQualified
                      ? "FREE"
                      : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                {isFreeShippingQualified && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium pt-0.5">
                    <FiCheckCircle size={12} />
                    <span>You qualify for free shipping!</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (8.5%)</span>
                  <span className="font-semibold text-white tabular-nums">
                    ${taxAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-sm font-bold text-white pt-1">
                <span>Total</span>
                <span className="text-xl font-extrabold text-white tabular-nums">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/user-dashboard/checkout")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-xs font-bold text-white transition-all hover:bg-purple-500 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <span>Continue to Checkout</span>
                <FiArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <FiLock size={12} />
                <span>Secure checkout</span>
              </div>
            </div>

            {/* 3 Trust Cards (PDF Page 1 & 2 requirement) */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <FiShield size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Premium Quality
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Durable slabs made to protect your cards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/5 pt-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <FiZap size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Fast Processing
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Most orders ship within 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/5 pt-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <FiLock size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Secure Checkout
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Safe and encrypted payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
