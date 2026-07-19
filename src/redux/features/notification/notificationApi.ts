import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Notifications — bell dropdown, badge count, and the settings page.
//
// Notifications are minted server-side only (grade ready, price alert,
// subscription, support) — there is no create endpoint. The settings PATCH
// carries exactly the five preference booleans the backend stores; anything
// else the old template UI showed does not exist.
// ---------------------------------------------------------------------------

export type NotifType =
  | "grade_ready"
  | "price_alert"
  | "subscription"
  | "support"
  | "system";

export interface TNotification {
  _id: string;
  type: NotifType;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  inappEnabled: boolean;
  emailGradeReady: boolean;
  emailPriceAlert: boolean;
  emailSubscription: boolean;
  emailSupport: boolean;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<
      { data: TNotification[]; meta?: TMeta },
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/notification",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<TNotification[]>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ["notification"],
    }),

    getUnreadCount: builder.query<{ unreadCount: number }, void>({
      query: () => ({ url: "/notification/unread-count", method: "GET" }),
      transformResponse: (res: TResponse<{ unreadCount: number }>) => res.data,
      providesTags: ["unreadCount"],
    }),

    markAsRead: builder.mutation<null, string>({
      query: (id) => ({ url: `/notification/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["notification", "unreadCount"],
    }),

    markAllAsRead: builder.mutation<null, void>({
      query: () => ({ url: "/notification/read-all", method: "PATCH" }),
      invalidatesTags: ["notification", "unreadCount"],
    }),

    deleteNotification: builder.mutation<null, string>({
      query: (id) => ({ url: `/notification/${id}`, method: "DELETE" }),
      invalidatesTags: ["notification", "unreadCount"],
    }),

    getNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => ({ url: "/notification/settings", method: "GET" }),
      transformResponse: (res: TResponse<NotificationSettings>) => res.data,
      providesTags: ["notificationSettings"],
    }),

    updateNotificationSettings: builder.mutation<
      NotificationSettings,
      Partial<NotificationSettings>
    >({
      query: (body) => ({
        url: "/notification/settings",
        method: "PATCH",
        body,
      }),
      transformResponse: (res: TResponse<NotificationSettings>) => res.data,
      invalidatesTags: ["notificationSettings"],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationApi;
