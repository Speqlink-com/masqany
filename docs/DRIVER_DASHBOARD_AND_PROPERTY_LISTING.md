# Driver Dashboard And Property Listing

## Driver Dashboard

- Added `app/(driver)/dashboard.tsx` with dashboard loading, error, pull-to-refresh, active move, and upcoming request states.
- Added `app/(driver)/move-execution/[moveId].tsx` as the initial destination for `Start Move`.
- Added `app/(driver)/_layout.tsx` and registered `(driver)` in the root stack.
- `vehicle-prompt.tsx` now gives drivers a direct entry point to the dashboard, and successful vehicle registration routes to the dashboard.
- Driver dashboard API uses mock data by default in development unless `EXPO_PUBLIC_USE_MOCK=false`.
- Fixed missing icon references by using existing assets from `assets/icons`.

## Move And Listings

- Move map cards now only show vacant properties.
- Move map property cards use `#E1E6E8` and open the reusable listing screen.
- Move screen has the blue tab-bar protection background using `#3fbdfd`.
- Added `app/property/[propertyId].tsx` as a reusable property details screen for Move, video feed, and future chat-agent property selections.
- Video feed `View Listing` opens the reusable listing screen.
- Video feed `Book Now` opens the same listing screen with the payment section highlighted.
