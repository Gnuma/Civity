export interface SettingsType {
  isConnected: boolean;
  navState: Object; //Todo
  fcmToken: string;
  toast: ToastType;
}

export interface ToastType {
  text: string;
  snapshot: number;
}
