# Specification

## Summary
**Goal:** Add a countdown timer overlay on the camera view and a Bengali poem reveal page at the end of the existing gift-opening flow.

**Planned changes:**
- Add a 10-to-1 countdown timer overlay in `CameraView.tsx` that starts automatically when the camera view becomes active, displayed large and centered over the camera feed in the existing pink dreamy theme
- After the countdown completes, automatically navigate to a new `PoemPage` component without any user interaction
- Create `PoemPage.tsx` displaying a Bengali poem inside a decorated box with soft pink/golden border, rounded corners, semi-transparent background, and elegant font consistent with the app's dreamy aesthetic
- Update `App.tsx` to include a `poem` view state, render `PoemPage`, and pass an `onCountdownComplete` callback to `CameraView` to trigger the navigation

**User-visible outcome:** After the gift box is opened and the camera view appears, users see a dramatic 10-to-1 countdown overlaid on the camera feed, which then automatically transitions to a full poem page displaying a Bengali poem in a beautifully styled decorative box.
