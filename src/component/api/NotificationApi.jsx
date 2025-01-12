import { ApiUrl } from "../../config/apiUrl";

const NotificationApi = {
  getNotifications: (axiosPrivate, userId, page, size) =>
    axiosPrivate.get(
      `${ApiUrl.notification.getNotifications}/${userId}?page=${page}&size=${size}`
    ),

  readNotifications: (axiosPrivate, userId) =>
    axiosPrivate.put(`${ApiUrl.notification.readNotifications}/${userId}`),
  handleNotification: (axiosPrivate, notificationId) =>
    axiosPrivate.post(
      `${ApiUrl.notification.handleNotification}/${notificationId}`
    ),
  updateNotificationStatus: (axiosPrivate, notificationId) =>
    axiosPrivate.put(`${ApiUrl.notification.markAsRead}/${notificationId}`),
};

export default NotificationApi;
