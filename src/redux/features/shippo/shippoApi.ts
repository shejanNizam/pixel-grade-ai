import baseApi from "@/redux/api/baseApi";
import type { TResponse } from "@/types/auth";

export interface TShippoAddressInput {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface TShippoRate {
  rateId: string;
  amount: number;
  currency: string;
  provider: string;
  serviceLevelName: string;
  estimatedDays?: number;
}

export interface TShippoRatesResponse {
  shipmentId: string;
  rates: TShippoRate[];
  selectedRate?: TShippoRate;
}

export const shippoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateAddress: builder.mutation<TResponse<Record<string, unknown>>, TShippoAddressInput>({
      query: (body) => ({
        url: "/shippo/validate-address",
        method: "POST",
        body,
      }),
    }),
    getRates: builder.mutation<
      TResponse<TShippoRatesResponse>,
      { address: TShippoAddressInput; count: number }
    >({
      query: (body) => ({
        url: "/shippo/rates",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useValidateAddressMutation, useGetRatesMutation } = shippoApi;
