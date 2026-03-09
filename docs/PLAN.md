# Hide Empty Profile Sections - Implementation Plan

## Goal Description
The user wants to gracefully hide or collapse the following sections on the Student Profile Overview page when they contain no data, instead of displaying an empty state card:
- Summary about Me
- Skills
- Sectors of Interest
- Domains of Interest

## Proposed Changes

### Frontend UI Components

#### [MODIFY] `src/components/students/profile/overview/student-overview.tsx`(file:///d:/TCC-CDM/institute-cdm-nextjs/src/components/students/profile/overview/student-overview.tsx)
- Check if `aboutMe` is empty or null.
- If it is empty, do not render the `Card` for "Summary about Me" at all.

#### [MODIFY] `src/components/students/profile/overview/student-skills.tsx`(file:///d:/TCC-CDM/institute-cdm-nextjs/src/components/students/profile/overview/student-skills.tsx)
- At the top of the component, add an early return: `if (!skills || skills.length === 0) return null;`.
- Remove the empty state fallback UI from the `CardContent`.

#### [MODIFY] `src/components/students/profile/overview/student-interests.tsx`(file:///d:/TCC-CDM/institute-cdm-nextjs/src/components/students/profile/overview/student-interests.tsx)
- At the top of the component, add an early return: `if (!hasAny) return null;`.
- Modify the rendering so that the "Sectors of Interest" `Card` is only rendered if `hasSectors` is true.
- Modify the rendering so that the "Domains of Interest" `Card` is only rendered if `hasDomains` is true.
- Since they are in a CSS Grid `grid-cols-1 md:grid-cols-2`, if only one card is visible, it will cleanly take up one slot and look fine.

## Verification Plan

### Automated Tests
- Pre-deploy automated safety checks logic (lints, format errors) via the orchestrate protocol: `python .agent/scripts/checklist.py .`

### Manual Verification
- Start the development server (`npm run dev`).
- Navigate to the student profile page of a student who is missing this data (e.g., Aakanksha Nikam as seen in the screenshot attached by user).
- Verify that the "Summary about Me", "Skills", "Sectors of Interest", and "Domains of Interest" cards are completely hidden and the remaining cards slide up to fill the space.
- Navigate to a student profile that *does* have this data and ensure the cards still render correctly with the tags.
