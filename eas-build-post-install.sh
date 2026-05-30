#!/usr/bin/env bash

# This script runs after dependencies are installed and after prebuild during EAS Build
# It adds the Mapbox download token to gradle.properties

set -e

echo "Adding Mapbox token to gradle.properties..."

if [ ! -d "android" ]; then
  echo "android folder not found yet; Expo prebuild/config plugins will configure Mapbox."
  exit 0
fi

if [ ! -f android/gradle.properties ]; then
  echo "android/gradle.properties not found yet; skipping manual Mapbox token write."
  exit 0
fi

# Check if token is already in gradle.properties
if ! grep -q "RNMAPBOX_MAPS_DOWNLOAD_TOKEN" android/gradle.properties; then
  echo "" >> android/gradle.properties
  echo "# Mapbox download token for SDK access" >> android/gradle.properties
  echo "RNMAPBOX_MAPS_DOWNLOAD_TOKEN=${RNMAPBOX_MAPS_DOWNLOAD_TOKEN}" >> android/gradle.properties
  echo "✓ Mapbox token added to gradle.properties"
else
  echo "✓ Mapbox token already exists in gradle.properties"
fi

echo "Post-install script completed successfully"
