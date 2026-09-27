# MediCare+ — Smart Healthcare Appointment & Medical Records Management System

A production-quality **Angular 18** frontend for a hospital appointment and medical
records platform, built with a strict **frontend-only, API-ready architecture**.

> **Scope of this repository:** This is a **frontend-only** project. There is no backend,
> database, or server code here. All data is served from static, strongly-typed TypeScript
> mock files through Angular services. The app is fully usable end-to-end today, and is
> structured so a real backend can be plugged in later by editing a small, well-defined set
> of files (see [Future API Integration](#future-api-integration) below).

---

## 1. Project Overview

MediCare+ supports four roles — **Patient, Doctor, Receptionist, Admin** — each with its own
dashboard and workflows:

- **Patients** find doctors, book appointments, track appointment history, view medical
  records/prescriptions, and manage their profile.
- **Doctors** manage their availability calendar, view/manage appointments, run a
  consultation workspace (symptoms → diagnosis → notes → follow-up), and write prescriptions.
- **Receptionists** see a front-desk dashboard, browse all appointments, and manage the
  daily patient check-in queue.
- **Admins** see system-wide stats and charts, manage user accounts (activate/deactivate),
  approve/reject doctor applications, and view analytics reports.

The UI is a modern healthcare SaaS look: soft shadows, rounded cards, a gradient hero on the
login screen, light/dark mode, skeleton loaders, toast notifications, and subtle animations.

---

## 2. Technology Stack

| Concern              | Choice                                              |
|----------------------|------------------------------------------------------|
| Framework            | Angular 18 (standalone components, no NgModules)     |
| Language             | TypeScript (strict mode)                             |
| UI Components        | Angular Material (dialogs, menus, snackbar)          |
| Styling              | Bootstrap 5 (grid/utilities) + SCSS design tokens     |
| Icons                | Font Awesome 6 (via CDN in `index.html`)              |
| Reactive state        | RxJS + Angular Signals                               |
| Forms                | Angular Reactive Forms only                          |
| Routing              | Angular Router, lazy-loaded feature routes           |
| Charts               | Chart.js (wrapped in a reusable `ChartPanelComponent`)|
| HTTP                 | Angular `HttpClient` (wired, unused until backend is live) |

---

## 3. Folder Structure

```
src/app/
├── core/                      # Singleton, app-wide concerns
│   ├── auth/                  # AuthService (mock login/register)
│   ├── guards/                # authGuard, roleGuard, guestGuard
│   ├── interceptors/          # authInterceptor, errorInterceptor
│   ├── services/              # One service per domain area (see below)
│   ├── models/                # All TypeScript interfaces/types
│   ├── constants/              # Roles, routes, storage keys
│   └── mock-data/             # Static *.mock.ts data files
│
├── shared/                    # Reusable, presentation-only building blocks
│   ├── components/            # navbar+sidebar shell, cards, tables, dialogs, etc.
│   ├── validators/            # Custom reactive form validators
│   └── styles/                # SCSS design tokens (_tokens.scss) & mixins
│
└── features/                  # One folder per role, each lazy-loaded
    ├── auth/                  # login, register
    ├── patient/                # dashboard, doctors, book-appointment, appointments, records, profile
    ├── doctor/                 # dashboard, availability, appointments, consultations, prescriptions
    ├── receptionist/           # dashboard, appointments, queue
    └── admin/                  # dashboard, users, doctors (approval), reports
```

Each feature folder has a `*.routes.ts` (lazy-loaded routes) and a `*-nav.ts` (its sidebar
menu, consumed by the shared `AppShellComponent`).

---

## 4. Installation

```bash
npm install
```

> This project was authored file-by-file in a sandbox without network access, so
> `npm install` / `ng build` could not be executed here. Before your first run, install
> dependencies normally and fix any version-resolution warnings npm reports (Angular
> Material/CDK versions should match your Angular version).

## 5. Run the Project

```bash
ng serve
```

Then open `http://localhost:4200`. No backend is required — everything runs on mock data.

To build for production:

```bash
ng build
```

---

## 6. Mock Login Credentials

All accounts use the password: **`password`**

| Role         | Email                     |
|--------------|----------------------------|
| Patient      | `patient@health.com`       |
| Doctor       | `doctor@health.com`        |
| Receptionist | `reception@health.com`     |
| Admin        | `admin@health.com`         |

The login screen also has one-click "quick demo login" chips for all four roles.

---

## 7. Mock Data

All mock data lives in `src/app/core/mock-data/*.mock.ts`, one file per entity:
`users`, `patients`, `doctors`, `appointments`, `consultations`, `prescriptions`,
`medical-records`, `availability`, `notifications`. These are plain, strongly-typed arrays —
no components ever import them directly.

Some actions (booking an appointment, adding an availability slot, saving a consultation,
approving a doctor, etc.) mutate an **in-memory copy** of these arrays inside the relevant
service, so the UI behaves statefully within a browser session. Refreshing the page resets
state back to the original mock data, since nothing is persisted to a real database yet.

**Note:** The "Download" button on medical records is UI-only (shows a toast) — there is no
file being generated or fetched, since that will depend on how the backend exposes documents.

---

## 8. Service Architecture

Every screen follows the same one-way data flow:

```
Component  →  Service  →  Observable<T>  →  (mock data today / HttpClient tomorrow)
```

Components **never** import a `*.mock.ts` file or call `HttpClient` directly. They only ever
call a method on an injected service, for example:

```typescript
@Injectable({ providedIn: 'root' })
export class DoctorService {
  getDoctors(): Observable<Doctor[]> {
    return of(MOCK_DOCTORS); // today
  }
}
```

Every service in `core/services/` already contains **both** code paths, gated by
`environment.useMockData`:

```typescript
getDoctors(): Observable<Doctor[]> {
  if (environment.useMockData) {
    return of(this.doctors).pipe(delay(environment.mockNetworkDelayMs));
  }
  return this.http.get<Doctor[]>(`${environment.apiBaseUrl}/doctors`);
}
```

So switching to a real backend is a **one-line flag flip** per environment file, not a rewrite.

---

## 9. Future API Integration

Follow these steps, in order, once the backend team hands off real endpoints:

### Step 1 — Update `environment.ts`
Set the real API URL in the relevant environment file(s):
`src/environments/environment.ts`, `environment.development.ts`, `environment.production.ts`.

```typescript
export const environment = {
  production: false,
  useMockData: false,        // <-- flip this to false
  apiBaseUrl: 'https://your-real-backend.com/api',
  apiTimeoutMs: 15000,
  mockNetworkDelayMs: 0
};
```

### Step 2 — Replace mock service bodies
Every service already has the real `HttpClient` call written and commented/branched next to
the mock call — for example in `doctor.service.ts`:

```typescript
// BEFORE (mock):
getDoctors(): Observable<Doctor[]> {
  return of(MOCK_DOCTORS);
}

// AFTER (real API) — this is already the `else` branch once useMockData = false:
getDoctors(): Observable<Doctor[]> {
  return this.http.get<Doctor[]>(`${environment.apiBaseUrl}/doctors`);
}
```

A POST example (from `appointment.service.ts`):

```typescript
// BEFORE (mock):
createAppointment(appointment: Appointment): Observable<Appointment> {
  return of(appointment);
}

// AFTER (real API):
createAppointment(appointment: Appointment): Observable<Appointment> {
  return this.http.post<Appointment>(`${environment.apiBaseUrl}/appointments`, appointment);
}
```

**No component needs to change** — they only ever called `doctorService.getDoctors()` /
`appointmentService.createAppointment()`, so this swap is invisible to the UI layer.

### Step 3 — Configure authentication in the interceptor
Open `src/app/core/interceptors/auth.interceptor.ts`. It already attaches
`Authorization: Bearer <token>` whenever `useMockData` is `false`. If the backend uses a
different scheme:

- **Different header name/value** → change the `setHeaders` call.
- **API key instead of bearer token** → replace with e.g. `req.headers.set('X-API-KEY', apiKey)`.
- **Some endpoints should be excluded** (e.g. `/auth/login`) → add an `if (!req.url.includes('/auth/'))` check before attaching the header.

Also update `AuthService.login()` / `AuthService.register()` in
`src/app/core/auth/auth.service.ts` — the real `HttpClient` calls are already sketched out
in code comments; uncomment and adjust the request/response shape to match the backend.

### Step 4 — Update endpoint URLs
All endpoint paths are defined **inline, once, per service method** (e.g.
`${environment.apiBaseUrl}/doctors`). Search each file in `core/services/` for
`environment.apiBaseUrl` and adjust the path segment if the backend's routes differ from
the ones assumed here.

### Step 5 — Update request/response models if needed
If the backend's JSON shape differs from the interfaces in `core/models/`, update the
relevant model file there. Because components only bind to these typed interfaces (never to
raw JSON), a model change surfaces as compiler errors exactly where a template or component
needs updating — nothing is silently broken.

### Step 6 — Test against the real backend
1. Run the backend locally (or point `apiBaseUrl` at a staging URL).
2. Set `useMockData: false` in `environment.development.ts`.
3. Run `ng serve` and exercise each role's flows end-to-end.
4. Check the browser Network tab for the exact request/response shape if something looks off,
   and cross-reference against the model in `core/models/`.

### Files you'll touch when the backend is ready
- `src/environments/environment*.ts` — API base URL, `useMockData` flag
- `src/app/core/services/*.ts` — swap mock branch for the (already-written) HTTP branch
- `src/app/core/auth/auth.service.ts` — real login/register calls
- `src/app/core/interceptors/auth.interceptor.ts` — real auth header scheme
- `src/app/core/models/*.ts` — only if the backend's response shape differs

You should **not** need to touch anything under `features/` or `shared/` — that is the whole
point of the service-layer boundary.

---

## 10. Dark Mode

Implemented via a `ThemeService` (`core/services/theme.service.ts`) that toggles a
`data-theme="dark"` attribute on `<html>` and persists the choice to `localStorage`. All
colors are CSS custom properties defined in `src/app/shared/styles/_tokens.scss`, redefined
under `:root[data-theme='dark']` — no component hardcodes a color.

## 11. Design System

Centralized in `src/app/shared/styles/_tokens.scss`:

```
Primary   #2563EB   Secondary #06B6D4   Success #10B981
Warning   #F59E0B   Danger    #EF4444   Background #F8FAFC   Card #FFFFFF
```

## 12. Known Limitations (by design, for this frontend-only phase)

- No real persistence — mock service state resets on page refresh.
- "Download record" is a UI-only action (no file is generated).
- Registration creates a session immediately but does not persist the new user across
  reloads (there's no backend to store it in yet).
- `ng build` / `ng test` have not been executed in this delivery environment (no network
  access to install `node_modules`) — please run them locally before deploying, and open an
  issue/ping the frontend owner if anything doesn't compile so it can be patched quickly.

## 13. Testing

The project is structured to be testable with Angular's default Karma/Jasmine setup
(`ng test`). Priority areas to cover, per the original spec:

- `AuthService` (mock login for all 4 roles, invalid credentials, inactive account)
- `authGuard` / `roleGuard` / `guestGuard`
- `AppointmentService`, `AvailabilityService` (booking + overlap validation)
- Reactive form validation on Login, Register, Book Appointment, Profile, Consultation,
  Prescription forms
- Routing: role-based redirects, lazy loading

