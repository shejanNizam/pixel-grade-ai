import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";
import type { TSlabLabel } from "../slab/slabApi";

export interface IShippingAddress {
  fullName: string;
  phone?: string;
  streetAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export type TSlabOrderStatus =
  | "order_received"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "shipping_exception"
  | "shipping_error"
  | "pending"
  | "cancelled";

export interface TSlabOrderItem {
  _id?: string;
  slab: TSlabLabel | string;
  cardName: string;
  grade: number;
  gradeLabel: string;
  compositeUrl: string;
  price: number;
}

export interface TShippoInfo {
  shipmentId?: string;
  rateId?: string;
  transactionId?: string;
  labelUrl?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
}

export interface TSlabOrder {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    username?: string;
    avatar?: { url?: string };
  };
  items: TSlabOrderItem[];
  slab?: TSlabLabel;
  shippingAddress: IShippingAddress;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  shippingCarrier?: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: TSlabOrderStatus;
  trackingNumber?: string;
  shippo?: TShippoInfo;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const slabOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSlabOrder: builder.mutation<
      TSlabOrder,
      {
        items?: Partial<TSlabOrderItem>[];
        slabId?: string;
        shippingAddress: IShippingAddress;
        shippingFee?: number;
        taxAmount?: number;
        paymentStatus?: string;
        shippoRateId?: string;
      }
    >({
      query: (body) => ({
        url: "/slab-order",
        method: "POST",
        body,
      }),
      transformResponse: (res: TResponse<TSlabOrder>) => res.data,
      invalidatesTags: ["slabOrder", "Cart"],
    }),

    createStripeCheckout: builder.mutation<
      { url?: string; sessionId?: string },
      {
        items: Partial<TSlabOrderItem>[];
        shippingAddress: IShippingAddress;
        shippingFee?: number;
        taxAmount?: number;
      }
    >({
      query: (body) => ({
        url: "/slab-order/create-checkout-session",
        method: "POST",
        body,
      }),
      transformResponse: (res: TResponse<{ url?: string; sessionId?: string }>) => res.data,
    }),

    confirmStripePayment: builder.mutation<TSlabOrder, { orderId: string }>({
      query: (body) => ({
        url: "/slab-order/confirm-stripe-payment",
        method: "POST",
        body,
      }),
      transformResponse: (res: TResponse<TSlabOrder>) => res.data,
      invalidatesTags: ["slabOrder", "Cart"],
    }),

    getMySlabOrders: builder.query<
      { data: TSlabOrder[]; meta?: TMeta },
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/slab-order/my-orders",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TSlabOrder[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["slabOrder"],
    }),

    getAllSlabOrders: builder.query<
      { data: TSlabOrder[]; meta?: TMeta },
      { page?: number; limit?: number; status?: string } | void
    >({
      query: (params) => ({
        url: "/slab-order/admin/all",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TSlabOrder[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["slabOrder"],
    }),

    purchaseShippoLabel: builder.mutation<
      TSlabOrder,
      { orderId: string; rateId?: string }
    >({
      query: ({ orderId, rateId }) => ({
        url: `/slab-order/admin/${orderId}/purchase-label`,
        method: "POST",
        body: { rateId },
      }),
      transformResponse: (res: TResponse<TSlabOrder>) => res.data,
      invalidatesTags: ["slabOrder"],
    }),

    updateSlabOrderStatus: builder.mutation<
      TSlabOrder,
      {
        orderId: string;
        orderStatus?: TSlabOrderStatus;
        trackingNumber?: string;
        notes?: string;
      }
    >({
      query: ({ orderId, ...body }) => ({
        url: `/slab-order/admin/${orderId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: TResponse<TSlabOrder>) => res.data,
      invalidatesTags: ["slabOrder"],
    }),
  }),
});

export const {
  useCreateSlabOrderMutation,
  useCreateStripeCheckoutMutation,
  useConfirmStripePaymentMutation,
  useGetMySlabOrdersQuery,
  useGetAllSlabOrdersQuery,
  usePurchaseShippoLabelMutation,
  useUpdateSlabOrderStatusMutation,
} = slabOrderApi;
