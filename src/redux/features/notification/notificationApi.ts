import baseApi from "@/redux/api/baseApi";
import type { TMeta, TResponse } from "@/types/auth";

// ---------------------------------------------------------------------------
// Notifications — bell dropdown, badge count, and the settings page.
//
// Notifications are minted server-side from platform events; the only endpoint
// that creates one is the admin broadcast. Everything is scoped to the caller
// AND to one AUDIENCE:
//
//   audience=user  — about your own activity  (user dashboard bell)
//   audience=admin — about platform operations (admin dashboard bell, staff only)
//
// Always pass `audience` explicitly. It defaults to "user" server-side, so an
// admin screen that forgets it silently shows the admin's personal
// notifications instead of the staff queue.
// ---------------------------------------------------------------------------

export type NotifAudience = "user" | "admin";

export type NotifType =
  // user-facing
  | "grade_ready"
  | "price_alert"
  | "subscription"
  | "support"
  | "system"
  // staff-facing
  | "support_ticket_new"
  | "support_ticket_reply"
  | "subscription_started"
  | "subscription_payment_failed";

export interface TNotification {
  _id: string;
  type: NotifType;
  audience: NotifAudience;
  title: string;
  body?: string;
  isRead: boolean;
  /** In-app path to open when clicked, e.g. "/admin/support/<id>". */
  link?: string;
  createdAt: string;
}

export interface NotificationSettings {
  inappEnabled: boolean;
  emailGradeReady: boolean;
  emailPriceAlert: boolean;
  emailSubscription: boolean;
  emailSupport: boolean;
  /** Staff only, off by default. */
  emailAdminAlerts?: boolean;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<
      { data: TNotification[]; meta?: TMeta },
      { page?: number; limit?: number; audience?: NotifAudience } | void
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

    getUnreadCount: builder.query<
      { unreadCount: number },
      { audience?: NotifAudience } | void
    >({
      query: (params) => ({
        url: "/notification/unread-count",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: TResponse<{ unreadCount: number }>) => res.data,
      providesTags: ["unreadCount"],
    }),

    markAsRead: builder.mutation<null, string>({
      query: (id) => ({ url: `/notification/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["notification", "unreadCount"],
    }),

    /** Scoped to one audience — clearing the admin bell must not also clear
     *  the reader's personal notifications. */
    markAllAsRead: builder.mutation<null, { audience?: NotifAudience } | void>({
      query: (params) => ({
        url: "/notification/read-all",
        method: "PATCH",
        params: params ?? undefined,
      }),
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

    /** Admin announcement to every active customer. Staff only. */
    broadcastNotification: builder.mutation<
      { recipients: number; delivered: number; failed: number },
      { title: string; body?: string; link?: string }
    >({
      query: (body) => ({
        url: "/notification/broadcast",
        method: "POST",
        body,
      }),
      transformResponse: (
        res: TResponse<{ recipients: number; delivered: number; failed: number }>,
      ) => res.data,
      invalidatesTags: ["notification", "unreadCount"],
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
  useBroadcastNotificationMutation,
} = notificationApi;
