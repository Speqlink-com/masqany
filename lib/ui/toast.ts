/**
 * Toast utility — Simple toast notifications using Alert
 * 
 * For a production app, consider using react-native-toast-message
 * or a similar library for better UX
 */

import { Alert } from "react-native";

export const toast = {
  success: (message: string, title: string = "Success") => {
    Alert.alert(title, message, [{ text: "OK" }]);
  },
  
  error: (message: string, title: string = "Error") => {
    Alert.alert(title, message, [{ text: "OK" }]);
  },
  
  info: (message: string, title: string = "Info") => {
    Alert.alert(title, message, [{ text: "OK" }]);
  },
  
  errorWithRetry: (
    message: string,
    onRetry: () => void,
    title: string = "Error"
  ) => {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Retry", onPress: onRetry },
    ]);
  },
};
