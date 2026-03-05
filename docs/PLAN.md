# Dynamic Institute Logo Update Plan

## Objective
Update the dashboard overview page to dynamically display the IIMU logo (`/images/iimu_logo.png`) when the logged-in user's institute has the code `iimu`. This process will be executed using the requested Orchestration Protocol.

## Phase 2: Implementation (Parallel Agents)

To satisfy the full orchestration requirement (minimum 3 agents), the following agents will execute the plan concurrently:

### 1. `backend-specialist` (Data Retrieval Update)
- **Target:** `src/app/(dashboard)/overview/page.tsx`
- **Action:** Update the Supabase query in the `OverviewPage` component to fetch the `code` field from `cdm_institutes`.
  - From: `.select("cdm_institutes(name, logo_url, location)")`
  - To: `.select("cdm_institutes(name, logo_url, location, code)")`
  
### 2. `frontend-specialist` (UI Logic Implementation)
- **Target:** `src/app/(dashboard)/overview/page.tsx`
- **Action:** Extract the `instituteCode` from the query result safely.
- **Action:** Add conditional logic to render the IIMU logo when the code matches.
  - Define `const IMG_IIMU_LOGO = "/images/iimu_logo.png";`
  - Determine `instituteLogo` based on whether `instituteCode === "iimu"`, fallback to DB `logo_url`, and finally fallback to default `IMG_IIM_LOGO`.

### 3. `test-engineer` (Verification & Quality Assurance)
- **Action:** Run the required `lint_runner.py` from `.agent/scripts` to ensure code changes have not introduced any linting or type errors.
- **Action:** Ensure the build compiles successfully without any TypeScript issues regarding the extracted `code` field.

## Verification Plan
1. **Automated Verification:**
   - Execute `python .agent/skills/lint-and-validate/scripts/lint_runner.py .` to ensure zero regressions.
2. **Manual Verification:**
   - Log in with a user whose institute is `iimu` and verify the `iimu_logo.png` is displayed.
   - Log in with a regular user and verify the default logo or their specific DB-provided logo is displayed.
