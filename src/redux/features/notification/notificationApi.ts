import baseApi from "@/redux/api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET api - list all notifications
    listNotifications: builder.query({
      query: ({ unread, type, severity }) => ({
        url: "/api/notifications/",
        method: "GET",
        params: {
          ...(unread !== undefined && { unread }),
          ...(type && { type }),
          ...(severity && { severity }),
        },
      }),
      providesTags: ["notification"],
    }),

    // GET api - get unread notifications with count
    getUnreadNotifications: builder.query({
      query: () => ({
        url: "/api/notifications/unread/",
        method: "GET",
      }),
      providesTags: ["notification", "unreadCount"],
    }),

    // PATCH api - mark single notification as read
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/notifications/${id}/read/`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification", "unreadCount"],
    }),

    // PATCH api - mark all notifications as read
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/api/notifications/read-all/",
        method: "PATCH",
      }),
      invalidatesTags: ["notification", "unreadCount"],
    }),

    // DELETE api - delete single notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/api/notifications/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification", "unreadCount"],
    }),

    // DELETE api - clear all notifications
    clearAllNotifications: builder.mutation({
      query: () => ({
        url: "/api/notifications/clear-all/",
        method: "DELETE",
      }),
      invalidatesTags: ["notification", "unreadCount"],
    }),

    // GET api - get notification settings
    getNotificationSettings: builder.query({
      query: () => ({
        url: "/api/notifications/settings/",
        method: "GET",
      }),
      providesTags: ["notificationSettings"],
    }),

    // PATCH api - update notification settings
    updateNotificationSettings: builder.mutation({
      query: (payload) => ({
        url: "/api/notifications/settings/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["notificationSettings"],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useGetUnreadNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationApi;
