const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Remove the unstable_workerThreads option that causes the warning
if (config.watcher) {
  delete config.watcher.unstable_workerThreads;
}

module.exports = withNativeWind(config, { input: "./app/global.css" });
