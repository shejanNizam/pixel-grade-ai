import baseApi from "@/redux/api/baseApi";

export const demoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---- READ (list) ------------------------------------------------------
    getDemos: builder.query({
      query: (params) => ({
        url: "/api/demos/",
        method: "GET",
        params: params,
      }),
      providesTags: ["demo"],
    }),

    // ---- READ (single) ----------------------------------------------------
    getDemoById: builder.query({
      query: (id) => ({
        url: `/api/demos/${id}/`,
        method: "GET",
      }),
      providesTags: ["demo"],
    }),

    // ---- CREATE -----------------------------------------------------------
    createDemo: builder.mutation({
      query: (body) => ({
        url: "/api/demos/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["demo"],
    }),

    // ---- UPDATE -----------------------------------------------------------
    updateDemo: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/demos/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["demo"],
    }),

    // ---- DELETE -----------------------------------------------------------
    deleteDemo: builder.mutation({
      query: (id) => ({
        url: `/api/demos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["demo"],
    }),
  }),
});

export const {
  useGetDemosQuery,
  useGetDemoByIdQuery,
  useCreateDemoMutation,
  useUpdateDemoMutation,
  useDeleteDemoMutation,
} = demoApi;
