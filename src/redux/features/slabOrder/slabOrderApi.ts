import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";
import type { TSlabLabel } from "../slab/slabApi";

export interface IShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export type TSlabOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface TSlabOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    username?: string;
    avatar?: { url?: string };
  };
  slab: TSlabLabel;
  shippingAddress: IShippingAddress;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  shippingFee?: number;
  taxAmount?: number;
  totalAmount: number;
  shippingCarrier?: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: TSlabOrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const slabOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSlabOrder: builder.mutation<
      TSlabOrder,
      {
        slabId: string;
        slabLabel?: string;
        amount?: number;
        shippingFee?: number;
        taxAmount?: number;
        shippingAddress: IShippingAddress;
        quantity?: number;
      }
    >({
      query: (body) => ({
        url: "/slab-order",
        method: "POST",
        body,
      }),
      transformResponse: (res: TResponse<TSlabOrder>) => res.data,
      invalidatesTags: ["slabOrder"],
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
  useGetMySlabOrdersQuery,
  useGetAllSlabOrdersQuery,
  useUpdateSlabOrderStatusMutation,
} = slabOrderApi;
