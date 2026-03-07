# Implementation Plan: Separate Tabs for Practice Interview Sessions

## Issue Analysis
The user requested that instead of stacking multiple sessions of the "Practice Interview (floating credit)" module into a single tab, each session should have its own separate tab (e.g., "Practice Interview - 1", "Practice Interview - 2", "Practice Interview - 3").

Currently, the `getStudentReportTypes` action groups reports by `journey_item_id`. Since multiple sessions can map to the *same* `journey_item_id` for "practice_interview", they are incorrectly grouped into a single tab.

## Proposed Changes

### 1. Update `src/app/actions/student-reports.ts`
- **`StudentReportSummary`**: Add an optional `reportId?: string` field.
- **`getStudentReportTypes` logic**: Modify the grouping logic so that if the `report_type` is `"practice_interview"`, we group distinct items by `r.id` (report ID) rather than `journey_item_id`. This will yield a separate `StudentReportSummary` for each practice interview session.
- **`getStudentReportsByType` logic**: Add an optional `reportId?: string` parameter and apply an additional DB filter (`.eq('id', reportId)`) if it's provided.

### 2. Update `src/components/students/profile/student-info-tabs.tsx`
- **`toTabValue` function**: Because multiple tabs might share the same `journeyItemId` now, we must append the `reportId` to generate unique tab values (`report_${rt.reportType}_${rt.journeyItemId}_${rt.reportId}`).
- **`<StudentReportTab>` instantiation**: Pass the newly available `rt.reportId` prop to the child component.

### 3. Update `src/components/students/profile/student-report-tab.tsx`
- **Props**: Accept the optional `reportId?: string`.
- **Fetch Logic**: Pass `reportId` into the `getStudentReportsByType` function call so that it fetches *only* the specific session for that tab.

## Verification Plan

### Manual Verification
1. Navigate to the profile of a student with multiple sessions for the Practice Interview floating credit module (e.g., "Arunav Mandal").
2. Validate that the UI now renders multiple, distinct tabs at the top (e.g., "Practice Interview - 1", "Practice Interview - 2", "Practice Interview - 3").
3. Click on each individual "Practice Interview" tab.
4. Verify that each tab solely renders the content/report for *that specific session*.
5. Navigate to the Analytics tab and verify that the metrics continue to calculate/display based on *all* sessions (already updated previously).
