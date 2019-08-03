/**
 * @format
 */

import { AppRegistry, YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import bgMessaging from "./src/utils/bgMessaging"; // <-- Import the file you created in (2)

YellowBox.ignoreWarnings([
  "Warning: componentWillReceiveProps",
  "Warning: componentWillMount",
  "Warning: Async Storage"
]);

AppRegistry.registerComponent(appName, () => App);

// New task registration
AppRegistry.registerHeadlessTask(
  "RNFirebaseBackgroundMessage",
  () => bgMessaging
); // <-- Add this line
