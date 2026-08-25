import baseApi from "@/redux/api/baseApi";
import type { TResponse } from "@/types/auth";

export interface TCartItem {
  _id: string;
  slab: string;
  cardName: string;
  grade: number;
  gradeLabel: string;
  compositeUrl: string;
  price: number;
  quantity?: number;
  addedAt: string;
}

export interface TCart {
  _id: string;
  user: string;
  items: TCartItem[];
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<TResponse<TCart>, void>({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<
      TResponse<TCart>,
      { slabId?: string; itemType?: string; cardName?: string; compositeUrl?: string; price?: number; quantity?: number }
    >({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<TResponse<TCart>, { itemId: string }>({
      query: ({ itemId }) => ({
        url: `/cart/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<TResponse<TCart>, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
