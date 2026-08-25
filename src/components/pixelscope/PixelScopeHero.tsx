"use client";

import PillButton from "@/components/shared/PillButton";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useCreateStripeCheckoutMutation } from "@/redux/features/slabOrder/slabOrderApi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  FiCamera,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiCreditCard,
  FiHardDrive,
  FiLock,
  FiMapPin,
  FiMinus,
  FiMonitor,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiShoppingCart,
  FiStar,
  FiSun,
  FiTruck,
  FiX,
  FiZap,
} from "react-icons/fi";

const galleryImages = [
  { id: 1, src: "/assets/pixelscope/pixelscope_image_one.PNG", alt: "PixelScope Digital Magnifier Front & Display", title: "Front & Display View" },
  { id: 2, src: "/assets/pixelscope/pixelscope_image_two.PNG", alt: "PixelScope LED & Sensor Back View", title: "Back View & LEDs" },
  { id: 3, src: "/assets/pixelscope/pixelscope_image_three.PNG", alt: "PixelScope Internal Chipset Explode View", title: "Internal Chipset" },
  { id: 4, src: "/assets/pixelscope/pixelscope_image_four.PNG", alt: "10X-15X Magnification Trading Card Inspection", title: "Card Magnification" },
  { id: 5, src: "/assets/pixelscope/pixelscope_image_five.PNG", alt: "PixelScope Handheld Usage & Screen View", title: "Handheld Usage" },
  { id: 6, src: "/assets/pixelscope/pixelscope_image_six.PNG", alt: "PixelScope White & UV LED Lighting Showcase", title: "White & UV Lighting" },
  { id: 7, src: "/assets/pixelscope/pixelscope_image_seven.PNG", alt: "PixelScope Complete Package Contents & Accessories", title: "Package Accessories" },
];

const keyFeatures = [
  { icon: FiSearch, title: "10X / 13X / 15X", subtitle: "Magnification" },
  { icon: FiSun, title: "White & UV", subtitle: "LED Lighting" },
  { icon: FiMonitor, title: '2.1" IPS', subtitle: "Color Screen" },
  { icon: FiCamera, title: "Photo & Video", subtitle: "Capture" },
  { icon: FiHardDrive, title: "Up to 128GB", subtitle: "TF Card Support" },
  { icon: FiZap, title: "750mAh", subtitle: "Rechargeable" },
];

const includedItems = [
  { name: "PixelScope Magnifier", qty: "x1", icon: "/assets/pixelscope/pixelscope_image_one.PNG" },
  { name: "USB-C Charging Cable", qty: "x1", icon: "/assets/pixelscope/pixelscope_image_seven.PNG" },
  { name: "User Manual", qty: "x1", icon: "/assets/pixelscope/pixelscope_image_seven.PNG" },
  { name: "Cleaning Cloth", qty: "x1", icon: "/assets/pixelscope/pixelscope_image_seven.PNG" },
  { name: "Storage Pouch", qty: "x1", icon: "/assets/pixelscope/pixelscope_image_seven.PNG" },
];

const UNIT_PRICE = 69.99;

export default function PixelScopeHero() {
  const router = useRouter();
  const { message } = App.useApp();
  const { data: me } = useGetMeQuery();

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [createStripeCheckout, { isLoading: isRedirectingStripe }] =
    useCreateStripeCheckoutMutation();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // Thumbnail Carousel Ref & Navigation
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      thumbnailContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Express Checkout Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  const subtotal = Number((UNIT_PRICE * quantity).toFixed(2));
  const shippingFee = 0;
  const taxAmount = 0;
  const totalAmount = subtotal;

  const activeImage = galleryImages[activeImageIndex];

  // Add to Cart handler
  const handleAddToCart = async () => {
    if (!me) {
      message.info("Please sign in to add items to your shopping cart.");
      router.push("/login?redirect=/pixelscope");
      return;
    }

    try {
      await addToCart({
        itemType: "hardware",
        cardName: "PixelScope Digital Magnifier",
        compositeUrl: "/assets/pixelscope/pixelscope_image_one.PNG",
        price: UNIT_PRICE,
        quantity,
      }).unwrap();

      message.success(`Added ${quantity}x PixelScope Digital Magnifier to your cart!`);
      router.push("/user-dashboard/cart");
    } catch (err) {
      message.error(getApiErrorMessage(err, "Couldn't add to cart. Try again."));
    }
  };

  // Buy Now Express Checkout handler
  const handleOpenBuyNow = () => {
    if (!me) {
      message.info("Please sign in to complete your checkout.");
      router.push("/login?redirect=/pixelscope");
      return;
    }
    setShippingAddress((prev) => ({
      ...prev,
      fullName: me.name || "",
    }));
    setIsModalOpen(true);
  };

  const handleStripePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingAddress.fullName ||
      !shippingAddress.streetAddress ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      message.error("Please fill in all required shipping address fields.");
      return;
    }

    try {
      const itemsPayload = [
        {
          cardName: `PixelScope Digital Magnifier (x${quantity})`,
          grade: 10,
          gradeLabel: "HARDWARE",
          compositeUrl: "/assets/pixelscope/pixelscope_image_one.PNG",
          price: subtotal,
        },
      ];

      const res = await createStripeCheckout({
        items: itemsPayload,
        shippingAddress,
        shippingFee: 0,
        taxAmount: 0,
      }).unwrap();

      if (res?.url) {
        message.loading("Redirecting to Stripe secure checkout...");
        window.location.href = res.url;
      } else {
        message.error("Stripe session URL was not returned. Please try again.");
      }
    } catch (err) {
      message.error(getApiErrorMessage(err, "Failed to initiate Stripe checkout."));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* 1. Top Guarantee Banner Bar (Offset below fixed Navbar at pt-20 to avoid collision) */}
      <div className="pt-20">
        <div className="border-b border-purple-500/20 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-purple-950/60 py-3.5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-xs font-medium text-purple-200">
            <div className="flex items-center gap-2">
              <FiTruck className="text-purple-400 text-sm shrink-0" />
              <span>Free shipping on orders over $50</span>
            </div>
            <span className="hidden sm:inline text-purple-500/30">|</span>
            <div className="flex items-center gap-2">
              <FiRefreshCw className="text-purple-400 text-sm shrink-0" />
              <span>30-day returns</span>
            </div>
            <span className="hidden sm:inline text-purple-500/30">|</span>
            <div className="flex items-center gap-2">
              <FiShield className="text-purple-400 text-sm shrink-0" />
              <span>1-year warranty</span>
            </div>
            <span className="hidden sm:inline text-purple-500/30">|</span>
            <div className="flex items-center gap-2">
              <FiLock className="text-purple-400 text-sm shrink-0" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-4">
        {/* 2. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-purple-400 transition-colors">
            Home
          </Link>
          <FiChevronRight size={12} />
          <span className="text-white font-semibold">PixelScope Digital Magnifier</span>
        </nav>

        {/* 3. Product Upper Grid (Left: Gallery & 17-Image Carousel | Right: Buy Box) */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Main Image & 17-Image Thumbnail Carousel */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image Container */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-black p-2 shadow-2xl shadow-purple-950/20">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                className="object-cover transition-all duration-300 rounded-2xl"
              />
              <span className="absolute top-4 left-4 rounded-full bg-purple-600/90 px-3.5 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
                ★ Best for Card Collectors
              </span>
            </div>

            {/* 17-Image Thumbnail Carousel with Left (<) and Right (>) Arrows */}
            <div className="relative flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => scrollThumbnails("left")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-zinc-900/90 text-white shadow-lg hover:bg-purple-600 hover:border-purple-500 transition-all cursor-pointer z-10"
                aria-label="Scroll thumbnails left"
              >
                <FiChevronLeft size={18} />
              </button>

              <div
                ref={thumbnailContainerRef}
                className="flex flex-1 gap-3 overflow-x-auto scrollbar-none py-1 scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {galleryImages.map((img, index) => {
                  const isActive = index === activeImageIndex;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-purple-500 ring-2 ring-purple-500/50 scale-105"
                          : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                      }`}
                    >
                      <Image src={img.src} alt={img.title} fill className="object-cover" />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollThumbnails("right")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-zinc-900/90 text-white shadow-lg hover:bg-purple-600 hover:border-purple-500 transition-all cursor-pointer z-10"
                aria-label="Scroll thumbnails right"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Buy Box */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
                PIXELSCOPE
              </span>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                PixelScope Digital Magnifier
              </h1>

              {/* Rating */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex items-center text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-300">4.8</span>
                <span className="text-xs text-zinc-400">(126 reviews)</span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-zinc-300">
                See what your eyes can&apos;t. Inspect cards and collectibles in stunning detail with 10X–15X magnification, white &amp; UV lighting, and built-in screen.
              </p>

              {/* Price & Stock */}
              <div className="mt-5">
                <div className="text-3xl font-extrabold text-white tracking-tight">$69.99</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <FiCheckCircle className="text-emerald-400" />
                  <span>In Stock – Ships within 24 hours</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <label className="block text-xs font-medium text-zinc-300 mb-2">Quantity</label>
                <div className="inline-flex items-center rounded-xl border border-white/15 bg-zinc-900/90 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-purple-500 shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
                >
                  <FiShoppingCart size={16} />
                  <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenBuyNow}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-white/20 py-3.5 text-sm font-bold text-white transition-all hover:bg-black hover:border-white/40 shadow-lg cursor-pointer"
                >
                  <FiZap className="text-amber-400 animate-pulse" size={16} />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Stripe & Payment Logos */}
              <div className="mt-5 text-center text-xs text-zinc-400 space-y-3">
                <div className="flex items-center justify-center gap-1.5 font-medium text-zinc-400">
                  <span>Secure checkout powered by</span>
                  <span className="font-extrabold text-[#635BFF] text-sm tracking-tight font-sans">stripe</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {/* VISA */}
                  <div className="flex h-6 px-2 items-center justify-center rounded border border-zinc-200 bg-white">
                    <svg className="h-3 w-auto" viewBox="0 0 40 14" fill="none">
                      <path fill="#1A1F71" d="M15.4 0.3L10.1 13.5H6.6L3.9 3.1C3.7 2.3 3.5 2.0 2.9 1.7C2.0 1.2 0.8 0.8 0 0.6L0.1 0.3H5.5C6.2 0.3 6.8 0.8 7.0 1.6L8.3 8.7L11.9 0.3H15.4ZM28.6 9.4C28.6 5.8 23.6 5.6 23.6 4.0C23.6 3.5 24.1 2.9 25.2 2.8C25.8 2.7 27.4 2.6 29.2 3.4L30.0 0.8C28.9 0.4 27.5 0 25.8 0C22.6 0 20.3 1.7 20.3 4.1C20.3 5.9 21.9 6.9 23.1 7.5C24.3 8.1 24.7 8.5 24.7 9.0C24.7 9.8 23.7 10.2 22.8 10.2C21.2 10.2 19.6 9.6 18.7 9.2L17.8 11.9C19.0 12.5 21.0 13.0 23.0 13.0C26.5 13.0 28.6 11.3 28.6 9.4ZM37.0 13.5H40.0L37.4 0.3H34.7C34.1 0.3 33.6 0.6 33.4 1.2L28.5 13.5H32.0L32.7 11.5H36.6L37.0 13.5ZM33.6 9.0L35.2 4.4L36.1 9.0H33.6ZM19.5 0.3L16.8 13.5H13.6L16.3 0.3H19.5Z"/>
                    </svg>
                  </div>
                  {/* Mastercard */}
                  <div className="flex h-6 px-2 items-center justify-center rounded border border-zinc-200 bg-white">
                    <svg className="h-4 w-auto" viewBox="0 0 38 24" fill="none">
                      <circle cx="13" cy="12" r="8.5" fill="#EB001B"/>
                      <circle cx="25" cy="12" r="8.5" fill="#F79E1B"/>
                      <path fill="#FF5F00" d="M19 5.3A8.47 8.47 0 0015.4 12c0 2.8 1.4 5.3 3.6 6.7A8.47 8.47 0 0022.6 12c0-2.8-1.4-5.3-3.6-6.7z"/>
                    </svg>
                  </div>
                  {/* AMEX */}
                  <div className="flex h-6 px-2 items-center justify-center rounded border border-blue-600 bg-[#006FCF]">
                    <span className="font-extrabold tracking-tighter text-white text-[10px] italic">AMEX</span>
                  </div>
                  {/* DISCOVER */}
                  <div className="flex h-6 px-2 items-center justify-center rounded border border-zinc-200 bg-white">
                    <span className="font-extrabold text-[9px] tracking-tight text-slate-900">DISC<span className="text-orange-500 font-black">O</span>VER</span>
                  </div>
                  {/* Apple Pay */}
                  <div className="flex h-6 px-2 items-center justify-center rounded border border-zinc-200 bg-white">
                    <svg className="h-3.5 w-auto" viewBox="0 0 44 24" fill="none">
                      <path fill="#000000" d="M15.2 11.2c-.1-1.3.9-2 1-2.1-.5-.8-1.4-.9-1.7-.9-0.7-.1-1.4.4-1.8.4-.4 0-1-.4-1.6-.4-.8 0-1.6.5-2 1.2-1 1.7-.2 4.2.7 5.5.5.7 1 1.4 1.7 1.4.7 0 1-.4 1.8-.4.8 0 1 .4 1.7.4.7 0 1.2-.7 1.7-1.4.5-.8.7-1.5.7-1.6 0 0-1.3-.5-1.3-2.1zm-1.1-3.6c.4-.5.6-1.1.5-1.8-.5 0-1.1.3-1.5.7-.3.4-.6 1-.5 1.7.6.1 1.1-.2 1.5-.6z"/>
                      <text x="20" y="15" fill="#000000" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Pay</text>
                    </svg>
                  </div>
                  {/* Google Pay */}
                  <div className="flex h-6 px-2 items-center justify-center rounded border border-zinc-200 bg-white">
                    <svg className="h-3.5 w-auto" viewBox="0 0 44 24" fill="none">
                      <path fill="#4285F4" d="M12.6 12.2c0-.3 0-.6-.1-.9H8.5v1.7h2.3c-.1.5-.4 1-.9 1.3v1.1h1.4c.8-.8 1.3-2 1.3-3.2z"/>
                      <path fill="#34A853" d="M8.5 16.4c1.1 0 2.1-.4 2.8-1.1l-1.4-1.1c-.4.3-.9.5-1.4.5-1.1 0-2.1-.7-2.4-1.7H4.6v1.1c.7 1.4 2.2 2.3 3.9 2.3z"/>
                      <path fill="#FBBC05" d="M6.1 13c-.1-.3-.1-.6-.1-1s0-.7.1-1V9.9H4.6c-.3.6-.5 1.3-.5 2.1s.2 1.5.5 2.1l1.5-1.1z"/>
                      <path fill="#EA4335" d="M8.5 7.6c.6 0 1.2.2 1.6.6l1.2-1.2C10.6 6.3 9.6 5.9 8.5 5.9 6.8 5.9 5.3 6.8 4.6 8.2l1.5 1.1c.3-1 1.3-1.7 2.4-1.7z"/>
                      <text x="16" y="15" fill="#3C4043" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Pay</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Trust Badges Row */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-4 gap-2 text-center text-[10px] text-zinc-300">
                <div className="space-y-1">
                  <FiTruck size={16} className="mx-auto text-purple-400" />
                  <p className="font-semibold text-white leading-tight">Free Shipping</p>
                  <p className="text-zinc-500 scale-90">on orders over $50</p>
                </div>
                <div className="space-y-1">
                  <FiRefreshCw size={16} className="mx-auto text-purple-400" />
                  <p className="font-semibold text-white leading-tight">30-Day</p>
                  <p className="text-zinc-500 scale-90">Returns</p>
                </div>
                <div className="space-y-1">
                  <FiShield size={16} className="mx-auto text-purple-400" />
                  <p className="font-semibold text-white leading-tight">1-Year</p>
                  <p className="text-zinc-500 scale-90">Warranty</p>
                </div>
                <div className="space-y-1">
                  <FiLock size={16} className="mx-auto text-purple-400" />
                  <p className="font-semibold text-white leading-tight">Secure</p>
                  <p className="text-zinc-500 scale-90">Checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Product Lower Grid (Left: Key Features & Collapsible Product Details | Right: What's Included) */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Key Features & Product Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Key Features Card */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl shadow-2xl">
              <h3 className="text-sm font-bold text-white mb-6">Key Features</h3>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                {keyFeatures.map((kf) => {
                  const Icon = kf.icon;
                  return (
                    <div key={kf.subtitle} className="space-y-2">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-white leading-tight">{kf.title}</p>
                        <p className="text-[10px] text-zinc-400 leading-tight">{kf.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Details Collapsible Card */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl shadow-2xl">
              <h3 className="text-sm font-bold text-white mb-3">Product Details</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                PixelScope is a premium portable digital magnifier built for collectors and professionals who demand perfect clarity, anywhere, anytime.
              </p>

              {showMoreDetails && (
                <div className="mt-4 space-y-3 text-xs text-zinc-300 border-t border-white/10 pt-4 animate-fadeIn">
                  <p>
                    <strong>High-Definition Optics:</strong> Powered by a 1.0MP CMOS sensor and 2.1-inch IPS wide color screen (480×480 resolution, 178° viewing angle) to inspect card foil, surface centering, and micro-print with zero distortion.
                  </p>
                  <p>
                    <strong>Dual Lighting Modes:</strong> Features 3 daylight white LEDs for true-color inspection and 3 UV LEDs (365nm) for verifying security threads, watermarks, and fluorescent markings on banknotes and stamps.
                  </p>
                  <p>
                    <strong>Rechargeable &amp; Standalone:</strong> Built-in 750mAh lithium battery recharges in 30 minutes via USB-C for 2 hours of continuous handheld operation. No phone or app required. Supports TF card recording (up to 128GB) and live PC/Mac USB output.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowMoreDetails((prev) => !prev)}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <span>{showMoreDetails ? "Show less" : "Show more"}</span>
                {showMoreDetails ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Right Column: What's Included Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">What&apos;s Included</h3>

              <div className="space-y-3">
                {includedItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-black shrink-0">
                        <Image src={item.icon} alt={item.name} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-medium text-zinc-200">{item.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400">{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Express Stripe Checkout Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={500}
        closeIcon={<FiX className="text-zinc-400 hover:text-white text-lg" />}
        modalRender={(modalContent) => (
          <div className="rounded-3xl border border-purple-500/30 bg-zinc-950 p-6 shadow-2xl backdrop-blur-xl text-white">
            {modalContent}
          </div>
        )}
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FiCreditCard size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PixelScope Express Checkout</h3>
              <p className="text-xs text-zinc-400">Secured by Stripe Payment Gateway</p>
            </div>
          </div>

          {/* Item Summary */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-white/10 bg-black">
                <Image src="/assets/pixelscope/pixelscope_image_one.PNG" alt="PixelScope" fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">PixelScope Digital Magnifier</p>
                <p className="text-[11px] text-purple-400 font-medium">Qty: {quantity} • $69.99 each</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-white">${subtotal.toFixed(2)}</span>
          </div>

          {/* Form */}
          <form onSubmit={handleStripePaymentSubmit} className="space-y-4">
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400">
                <FiMapPin /> Shipping Address
              </h4>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="112 Commercial Ct"
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Santa Rosa"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="CA"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="95407"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-1.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-400 font-semibold">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-extrabold text-sm text-white">
                <span>Total Amount</span>
                <span className="text-purple-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRedirectingStripe}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white transition-all hover:bg-purple-500 shadow-md shadow-purple-600/30 disabled:opacity-50 cursor-pointer"
            >
              <FiShield size={16} />
              {isRedirectingStripe ? "Redirecting to Stripe..." : `Pay $${totalAmount.toFixed(2)} with Stripe`}
            </button>

            <p className="text-center text-[10px] text-zinc-400">
              🔒 You will be redirected to Stripe&apos;s encrypted checkout session.
            </p>
          </form>
        </div>
      </Modal>
    </div>
  );
}
