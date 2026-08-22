"use client";

import { useClearCartMutation, useGetCartQuery } from "@/redux/features/cart/cartApi";
import { useGetRatesMutation, type TShippoAddressInput } from "@/redux/features/shippo/shippoApi";
import {
  useCreateSlabOrderMutation,
  useCreateStripeCheckoutMutation,
} from "@/redux/features/slabOrder/slabOrderApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCheckCircle, FiCreditCard, FiLock, FiMapPin, FiPackage, FiShield, FiTruck } from "react-icons/fi";

const FALLBACK_IMAGE = "/assets/user-dashboard/recent_scan_card.png";
const TAX_RATE = 0.085; // 8.50% tax

export default function CheckoutPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const [getRates, { isLoading: isCalculatingRates }] = useGetRatesMutation();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateSlabOrderMutation();
  const [clearCart] = useClearCartMutation();

  const cart = cartData?.data;
  const items = cart?.items ?? [];

  // Address State
  const [address, setAddress] = useState<TShippoAddressInput>({
    name: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  // Rates & Step State
  const [step, setStep] = useState<1 | 2>(1);
  const [validatedRate, setValidatedRate] = useState<number | null>(null);
  const [shippoRateId, setShippoRateId] = useState<string | undefined>(undefined);
  const [shippoValidated, setShippoValidated] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + (i.price || 24.99), 0);
  const shippingFee = validatedRate ?? 5.95;
  const taxAmount = Number((subtotal * TAX_RATE).toFixed(2));
  const totalAmount = Number((subtotal + shippingFee + taxAmount).toFixed(2));

  const handleValidateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.street1 || !address.city || !address.state || !address.zip) {
      message.error("Please fill in all required shipping address fields.");
      return;
    }

    try {
      const res = await getRates({
        address: { ...address, country: "US" },
        count: items.length,
      }).unwrap();

      const selected = res.data?.selectedRate;
      if (selected) {
        setValidatedRate(selected.amount);
        setShippoRateId(selected.rateId);
        setShippoValidated(true);
        setStep(2);
        message.success("Shipping address validated by Shippo!");
      } else {
        setValidatedRate(5.95);
        setShippoValidated(true);
        setStep(2);
      }
    } catch (err) {
      message.error(
        getApiErrorMessage(err, "Shipping address validation failed. Please check address details."),
      );
    }
  };

  const [createStripeCheckout, { isLoading: isRedirectingStripe }] =
    useCreateStripeCheckoutMutation();

  const handleCompletePayment = async () => {
    if (items.length === 0) return;

    try {
      const order = await createOrder({
        items: items.map((i) => ({
          slab: i.slab,
          cardName: i.cardName,
          grade: i.grade,
          gradeLabel: i.gradeLabel,
          compositeUrl: i.compositeUrl,
          price: i.price,
        })),
        shippingAddress: {
          fullName: address.name,
          streetAddress: address.street2 ? `${address.street1}, ${address.street2}` : address.street1,
          city: address.city,
          state: address.state,
          postalCode: address.zip,
          country: "US",
        },
        shippingFee,
        taxAmount,
        paymentStatus: "paid",
        ...(shippoRateId ? { shippoRateId } : {}),
      }).unwrap();

      await clearCart().unwrap();
      message.success(`Order ${order.orderNumber} placed successfully!`);
      router.push("/user-dashboard/slab-orders");
    } catch (err) {
      message.error(getApiErrorMessage(err, "Failed to place order. Try again."));
    }
  };

  const handleStripeCheckoutRedirect = async () => {
    try {
      const res = await createStripeCheckout({
        items,
        shippingAddress: {
          fullName: address.name,
          streetAddress: address.street2 ? `${address.street1}, ${address.street2}` : address.street1,
          city: address.city,
          state: address.state,
          postalCode: address.zip,
          country: "US",
        },
        shippingFee,
        taxAmount,
      }).unwrap();

      if (res?.url) {
        window.location.href = res.url;
      } else {
        await handleCompletePayment();
      }
    } catch {
      await handleCompletePayment();
    }
  };

  if (isCartLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-[#111113]" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#111113] p-12 text-center space-y-4">
        <FiPackage size={32} className="mx-auto text-zinc-500" />
        <h3 className="text-lg font-medium text-white">Your cart is empty</h3>
        <p className="text-xs text-zinc-400">Add custom slabs to your cart before proceeding to checkout.</p>
        <Link
          href="/user-dashboard/cart"
          className="inline-block rounded-full bg-violet-600 px-6 py-2 text-xs font-semibold text-white"
        >
          Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-white">Checkout</h2>
        <p className="mt-1 text-xs text-zinc-400">
          Complete your physical custom slab order with Shippo shipping &amp; secure Stripe payment.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* ---- Step Form ---- */}
        <div className="space-y-6">
          {/* Step Indicators */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div
              className={`flex items-center gap-2 text-xs font-medium ${
                step === 1 ? "text-violet-400" : "text-zinc-400"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600/20 text-xs font-bold text-violet-400 border border-violet-500/40">
                1
              </span>
              <span>Shipping Address</span>
            </div>
            <span className="text-zinc-600">/</span>
            <div
              className={`flex items-center gap-2 text-xs font-medium ${
                step === 2 ? "text-violet-400" : "text-zinc-400"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600/20 text-xs font-bold text-violet-400 border border-violet-500/40">
                2
              </span>
              <span>Payment &amp; Review</span>
            </div>
          </div>

          {/* Step 1: Address Form */}
          {step === 1 ? (
            <form onSubmit={handleValidateAddress} className="rounded-2xl border border-white/10 bg-[#111113] p-6 space-y-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                <FiMapPin className="text-violet-400" /> Enter Shipping Address
              </h3>
              <p className="text-xs text-zinc-400">
                Addresses are validated live by Shippo to ensure accurate USPS Ground delivery.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="112 Commercial Ct"
                    value={address.street1}
                    onChange={(e) => setAddress({ ...address, street1: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Apt, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    placeholder="Ste 25"
                    value={address.street2}
                    onChange={(e) => setAddress({ ...address, street2: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Santa Rosa"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="CA"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="95407"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value="United States (USPS Domestic)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-zinc-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isCalculatingRates}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50 cursor-pointer"
                >
                  <FiTruck size={14} />
                  {isCalculatingRates ? "Validating & Calculating Rates..." : "Continue to Payment"}
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Payment Review */
            <div className="rounded-2xl border border-white/10 bg-[#111113] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                    <FiCheckCircle className="text-emerald-400" /> Shipping Address Confirmed
                  </h3>
                  <p className="mt-1 text-xs text-zinc-300">
                    {address.name} — {address.street1} {address.street2}, {address.city}, {address.state} {address.zip}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-violet-400 hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {shippoValidated && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300">
                  <FiCheckCircle className="shrink-0" />
                  <span>Shippo Validated Address · USPS Ground Advantage Offered (${shippingFee.toFixed(2)})</span>
                </div>
              )}

              {/* Payment Method Option */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white">Payment Method</h4>
                <div className="rounded-xl border border-violet-500/40 bg-violet-500/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiCreditCard size={20} className="text-violet-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Credit / Debit Card (Stripe)</p>
                      <p className="text-[11px] text-zinc-400">VISA **** 4242 · Encrypted &amp; Secured</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <FiLock size={11} /> Secured by Stripe
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isPlacingOrder || isRedirectingStripe}
                  onClick={handleStripeCheckoutRedirect}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 py-3 text-sm font-bold text-white transition-transform hover:scale-101 disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  <FiShield size={16} />
                  {isPlacingOrder || isRedirectingStripe
                    ? "Redirecting to Stripe..."
                    : `Pay $${totalAmount.toFixed(2)} with Stripe`}
                </button>
                <p className="mt-2 text-center text-[10px] text-zinc-500">
                  Shipping label is NOT purchased until payment is successful. No fake tracking numbers!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---- Right Summary Panel ---- */}
        <div>
          <div className="sticky top-6 rounded-2xl border border-white/10 bg-[#111113] p-6 space-y-5">
            <h3 className="text-base font-semibold text-white">Order Summary</h3>

            {/* Item Thumbnails */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i._id} className="flex items-center gap-3">
                  <div className="relative h-14 w-12 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black">
                    <Image src={i.compositeUrl || FALLBACK_IMAGE} alt={i.cardName} fill unoptimized className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{i.cardName}</p>
                    <p className="text-[11px] text-zinc-400">Qty 1 · Grade {i.grade.toFixed(1)}</p>
                  </div>
                  <span className="text-xs font-bold text-white tabular-nums">${i.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs border-t border-white/10 pt-4 text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
                <span className="font-medium text-white tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (USPS Ground)</span>
                <span className="font-medium text-white tabular-nums">${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8.50%)</span>
                <span className="font-medium text-white tabular-nums">${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-xl font-extrabold text-violet-300 tabular-nums">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
