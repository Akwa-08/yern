# Expense Tracker App — Concept & Capabilities Spec (v1.1)

> Reference doc for building with Laravel + OpenCode, deployed to Laravel Cloud.
> Keep this in the project root (e.g. `SPEC.md`) so you can point OpenCode at it during builds.

## 1. Vision

A personal + household expense (and income) tracker for two people (you and your girlfriend) who want:

- Their own private log of what they spend/earn
- A combined household view that automatically merges both people's data
- Budgeting, recurring transactions, and search/filtering — without needing to be Laravel experts to build or maintain it
- Installable on mobile as a PWA (add to home screen, app-like feel)
- An architecture that doesn't need to be rebuilt if this later opens up to the public

## 2. Core Concepts

| Concept                   | Description                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**                  | A person with an account (email + password). Both of you get separate logins.                                                                               |
| **Household**             | A shared group. You create one and invite your girlfriend via an invite code/link. All members' transactions automatically roll up into the household view. |
| **Transaction**           | A single expense or income entry — always owned by one user.                                                                                                |
| **Category**              | Label for a transaction (e.g. "Food," "Side Job," "Allowance"). Comes with sensible defaults; fully customizable.                                           |
| **Budget**                | A spending cap per category per period (e.g. ₱3,000/month on Food), trackable personally or at household level.                                             |
| **Recurring Transaction** | A template (e.g. "Netflix ₱549/month") that auto-generates real transactions on schedule.                                                                   |
| **Visibility**            | Per-transaction setting: `private` (only you see it) or `shared` (rolls up into the household view).                                                        |

### 2.1 Privacy Toggle — Design Details

Every transaction gets a `visibility` field: **Private** or **Shared**. Here's how it behaves across the app:

- **Personal view (always shows everything):** you see all your own transactions regardless of visibility — private ones just get a small lock icon so you can tell at a glance.
- **Household view (shared only):** only pulls in transactions marked `shared`, from any household member. Private entries never appear here, in totals, in category breakdowns, or in the "by person" split.
- **Per-transaction control:** the toggle sits right on the add/edit form — flip it when you create the entry, or change it later at any time (private → shared or back).
- **Default preference:** rather than toggling every single entry, each user sets a personal default (e.g. "new transactions default to Shared") in their account settings. You can always override per-entry.
- **Budgets respect visibility too:** a _personal_ budget counts all your transactions (private + shared) since it's tracking your own spending. A _household_ budget only counts shared transactions from all members — a private purchase shouldn't count against a joint grocery budget.
- **Recurring transactions:** the recurring template itself carries a visibility setting, inherited by each auto-generated transaction. Changing the template's visibility only affects future occurrences, not past ones.
- **Filtering:** the personal view's search/filter includes a "Private / Shared / All" filter so you can quickly pull up just your private entries (e.g. to review or reclassify them).

I kept this binary (private vs. shared) rather than something more granular like "shared but note hidden" — it covers your stated need cleanly and keeps the UI simple. Worth flagging if you actually want finer-grained visibility later, but I'd recommend starting simple and only adding that complexity if you find you actually need it.

## 3. Feature List (Standard scope — confirmed)

### Must-have (v1)

- **Auth:** register, login, logout, password reset
- **Household:** create a household, generate/share an invite code, join a household
- **Personal dashboard:** your own transactions, monthly totals, category breakdown chart, income vs. expense balance
- **Household dashboard:** combined totals, breakdown by category _and_ by person, combined balance
- **Expenses:** add/edit/delete — amount, category, date, note, optional receipt photo, private/shared toggle
- **Income:** add/edit/delete — amount, source/category, date, note, private/shared toggle. Flexible categories since income isn't a fixed salary (allowance, Side Job A, Side Job B, gifts, etc. — all just custom categories under "income" type)
- **Categories:** seeded defaults for both expense and income, fully custom categories allowed
- **Privacy settings:** per-user default visibility preference (Private/Shared) applied to new entries; override per-transaction anytime
- **Budgets:** monthly budget per category, personal (counts all your transactions) or household-level (counts shared transactions only), progress bar + near-limit/over-limit warning
- **Recurring transactions:** define once (amount, category, frequency, visibility), auto-generates entries, editable/cancelable
- **Search & filter:** by date range, category, type (expense/income), person (household view), amount range, visibility (Private/Shared/All — personal view)
- **Sort:** by date or amount
- **Mobile-first responsive UI**
- **PWA:** installable to home screen, app icon, offline shell (last-loaded data viewable without connection)

### Nice-to-have (build if time allows, still v1)

- CSV export
- Dark mode
- Charts: pie (category breakdown), line/bar (monthly trend over time)
- Currency tag per transaction (no live conversion — just labeling, in case side-job income comes in a different currency)

### Explicitly deferred (not in v1, but architecture won't block them later)

- Reminders
- To-do list
- Public/open registration polish (signup can technically stay open from day one — just won't be advertised — so no rework needed if you open it up later)

## 4. Data Model Sketch (conceptual, not final schema)

- **users** — id, name, email, password, default_visibility (private/shared), timestamps
- **households** — id, name, invite_code, owner_user_id
- **household_user** (pivot) — household_id, user_id, role (owner/member)
- **categories** — id, user_id (nullable = global default), name, type (expense/income), icon, color
- **transactions** — id, user_id, household_id, category_id, type (expense/income), amount, currency, date, note, visibility (private/shared), receipt_path (nullable), recurring_transaction_id (nullable, links back if auto-generated)
- **recurring_transactions** — id, user_id, category_id, type, amount, frequency (daily/weekly/monthly), visibility (private/shared), next_run_date, is_active
- **budgets** — id, owner_type (user/household), owner_id, category_id (nullable = overall budget), amount, period (weekly/monthly), start_date

This is intentionally normalized so "household" scales to more than 2 people later without schema changes.

## 5. Suggested Technical Shape (still conceptual)

Updated based on your React familiarity:

- **Laravel + Inertia.js + React.** Inertia lets Laravel stay in charge of routing and backend logic while your pages are actual React components — no separate REST/GraphQL API layer needed, and no throwing away your React knowledge. Laravel Breeze has an official Inertia + React starter kit that scaffolds auth (register/login/password reset) for you, which saves you from writing that by hand.
- **Database:** MySQL (Laravel's most common default, well-supported on Laravel Cloud)
- **Charts:** Recharts (React-native charting, straightforward for category breakdowns and monthly trend lines)
- **Build tool:** Vite (Laravel's default bundler, and it pairs well with React + Inertia out of the box)
- **PWA:** `vite-plugin-pwa` — since you're already on Vite, this handles the manifest + service worker generation with minimal manual setup
- **Scheduled jobs:** Laravel's task scheduler handles auto-generating recurring transactions daily
- **Authorization:** Laravel Policies to enforce visibility rules server-side (e.g. a household member's API request for "household transactions" is only ever allowed to return `shared` rows — private data never touches the response, not just hidden in the UI)

## 6. Suggested Next Steps

1. Confirm/adjust this concept (categories you want seeded by default, exact budget behavior, etc.)
2. List out the actual screens/pages needed (wireframe level, not visual design)
3. Set up the Laravel project + OpenCode workflow, get a minimal "hello world" deployed to Laravel Cloud first (to de-risk the deployment pipeline early, before building all features)
4. Build feature-by-feature: auth → households → transactions (with visibility) → categories → budgets → recurring → search/filter → PWA polish
