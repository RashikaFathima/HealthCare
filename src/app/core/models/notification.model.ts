export type NotificationType = 'APPOINTMENT' | 'PRESCRIPTION' | 'SYSTEM' | 'ALERT';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
