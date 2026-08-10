import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Support tickets. A ticket is a subject + status; the conversation lives in
// a separate message collection, fetched with the thread. Status moves
// automatically: a staff reply → answered, a user reply → open (reopened);
// resolved/closed are set explicitly via the status endpoint.
// ---------------------------------------------------------------------------

export type TTicketStatus = "open" | "answered" | "resolved" | "closed";

export interface TSupportTicket {
  _id: string;
  /** Populated with name/email/avatar on admin lists and threads. */
  user:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        avatar?: { url: string; publicId: string };
      };
  subject: string;
  status: TTicketStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TTicketMessage {
  _id: string;
  ticket: string;
  sender: string | { _id: string; name: string; email: string; role?: string };
  /** Denormalised at send time — a later promotion never rewrites history. */
  isAdmin: boolean;
  message: string;
  createdAt?: string;
}

export interface TicketListParams {
  page?: number;
  limit?: number;
  /** Regex-matches the subject (admin list only). */
  searchTerm?: string;
  status?: TTicketStatus;
  sort?: string;
}

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation<
      TSupportTicket,
      /** `captchaToken` is the Turnstile solution. Omitted when the widget is
       *  unconfigured; the server decides whether that is acceptable. */
      { subject: string; message: string; captchaToken?: string }
    >({
      query: (body) => ({ url: "/support", method: "POST", body }),
      transformResponse: (res: TResponse<TSupportTicket>) => res.data,
      invalidatesTags: ["support"],
    }),

    getMyTickets: builder.query<
      { data: TSupportTicket[]; meta?: TMeta },
      TicketListParams | void
    >({
      query: (params) => ({
        url: "/support",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TSupportTicket[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["support"],
    }),

    /** Admin queue across all users. */
    getAllTickets: builder.query<
      { data: TSupportTicket[]; meta?: TMeta },
      TicketListParams | void
    >({
      query: (params) => ({
        url: "/support/all",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TSupportTicket[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["support"],
    }),

    /** One thread: the ticket plus its messages oldest-first. */
    getTicket: builder.query<
      { ticket: TSupportTicket; messages: TTicketMessage[] },
      string
    >({
      query: (ticketId) => ({ url: `/support/${ticketId}`, method: "GET" }),
      transformResponse: (
        res: TResponse<{ ticket: TSupportTicket; messages: TTicketMessage[] }>,
      ) => res.data,
      providesTags: ["support"],
    }),

    /** Staff reply flips the ticket to `answered` server-side. */
    addTicketMessage: builder.mutation<
      TTicketMessage,
      { ticketId: string; message: string }
    >({
      query: ({ ticketId, message }) => ({
        url: `/support/${ticketId}/message`,
        method: "POST",
        body: { message },
      }),
      transformResponse: (res: TResponse<TTicketMessage>) => res.data,
      invalidatesTags: ["support"],
    }),

    updateTicketStatus: builder.mutation<
      TSupportTicket,
      { ticketId: string; status: TTicketStatus }
    >({
      query: ({ ticketId, status }) => ({
        url: `/support/${ticketId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (res: TResponse<TSupportTicket>) => res.data,
      invalidatesTags: ["support"],
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  useGetAllTicketsQuery,
  useGetTicketQuery,
  useAddTicketMessageMutation,
  useUpdateTicketStatusMutation,
} = supportApi;
