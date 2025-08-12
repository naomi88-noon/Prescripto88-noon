# FRONTEND Remediation & Improvement Plan

## 1. Issues & Weaknesses (Audited)

### Architecture / Structure
- Duplicate context provider: `AppContextProvider` wraps App twice (in `main.jsx` and `App.jsx`).
- Mixed naming conventions & casing (`Home.jsx` imported as `home`, `/doctor` vs `/doctors`).
- Components and pages inconsistently capitalized (e.g. `footer.jsx` and usage `<footer/>`).
- Route duplication / confusion: `/doctor`, `/doctors/:speciality`, `/Appointment` vs expected `/appointment/:id`.

### Data Model Inconsistencies
- Two different doctor schemas: context (`id`, `img`) vs assets dataset (`_id`, `image`, `degree`, `fees`).
- Components assume richer fields (`degree`, `experience`) that do not exist in context version (e.g. `Appointment.jsx`).
- `Appointment.jsx` expects `docInfo.fee` but dataset uses `fees`.

### Code Quality / Bugs
- String interpolation errors: Using `'navigate('/appointment/${id}')'` inside single quotes so variable not interpolated.
- Incorrect hook imports / missing imports in multiple files (`Doctor.jsx` missing `useState`, `useNavigate`, `useContext`, `useParams`).
- Typographical className errors: `item-center` vs `items-center`, `font-meduim`, `cursur-pointer`, `hovar`. These break intended styling.
- Mis-cased context import: `../context/appcontext` (should match file system case).
- `RelatedDoctors.jsx` filter logic uses `doc._id !== docid` (variable name mismatch) and undefined `docid` vs `docId`.
- Unused variables: `specialityData` imported in `TopDoctors.jsx` but never used.
- Hardcoded `token` always true; no auth state management.
- Navigation after logout points to `/logout` route which doesn't exist.
- `Footer` exported as `Footer` but used as `<footer/>` (native HTML element name) in `App.jsx`.
- `Doctor.jsx` curly brace/closure mismatches and malformed component ending (`}};`).
- Appointment slot logic conditions reversed: `if (docInfo && doctors.length>0 && docId){ fetchDocInfo(); }` should fetch once doctors loaded before checking `docInfo`.
- Time slot UI class string concatenation missing backticks & curly braces.

### UX / Accessibility
- Buttons and interactive divs not using semantic elements (`div` with onClick for cards, missing ARIA roles or `button` elements).
- No loading states for async-like operations (future API calls).
- No error boundaries or form validation messages in Login.
- Color contrast risk: light gray text on white backgrounds.

### Performance
- All images imported eagerly; no code-splitting or lazy-loading of route-based bundles.
- Large static doctor list maintained twice (context + assets). Potential duplication.

### Maintainability
- Hardcoded business logic (slot generation) inside component; should be a reusable utility.
- Magic numbers (clinic hours 10–21) embedded inline.
- Lack of TypeScript or prop validation (no PropTypes).
- No central API service layer.

## 2. Immediate Fix Priorities (P1)
1. Normalize doctor schema (adopt richer `_id` form, rename `fees`→`fee` or vice versa; pick one).
2. Fix routing and path casing; unify `/doctors` base.
3. Remove duplicate context provider in `App.jsx` OR in `main.jsx`.
4. Correct all template literal / navigation bugs.
5. Repair malformed / missing hook imports in `Doctor.jsx`, `RelatedDoctors.jsx`.
6. Replace incorrect class names (`item-center`, `font-meduim`, etc.).
7. Use `<Footer />` properly and rename file to `Footer.jsx` for consistency.
8. Implement a single source of truth for doctors (load from context initialized via assets dataset temporarily until backend API available).

## 3. Secondary Improvements (P2)
- Introduce a `services/api.js` abstraction (Axios instance with baseURL, interceptors).
- Add React Query (or SWR) for data fetching + caching once backend ready.
- Add authentication flow (JWT localStorage, protected routes wrapper).
- Extract slot generation into `utils/generateSlots.js` with unit tests.
- Convert to TypeScript or add PropTypes.
- Introduce ESLint rules for naming & accessibility (jsx-a11y plugin).

## 4. Future Enhancements (P3)
- Pagination / infinite scroll for doctor lists.
- Search + speciality filtering server-side.
- Favorites / recently viewed doctors.
- Appointment rescheduling & cancellation.
- Toast notifications (React-Toastify) for booking success/failure.
- Dark mode toggle.

## 5. Proposed Normalized Doctor Schema
```ts
Doctor {
  id: string;          // use UUID or backend ObjectId-like string
  name: string;
  image: string;       // URL
  speciality: string;  // enum
  degree: string;
  experienceYears: number; // numeric for sorting
  about: string;
  fee: number;         // integer in default currency minor units OR decimal
  address: {
    line1: string;
    line2?: string;
    city?: string;
    country?: string;
  };
  availability?: Array<{ day: number; start: string; end: string }>; // optional pre-defined schedule
}
```

## 6. Refactored Folder Structure (Target)
```
src/
  app/
    App.jsx
    routes.jsx
  components/
    layout/
      Navbar.jsx
      Footer.jsx
    doctors/
      DoctorCard.jsx
      DoctorGrid.jsx
      RelatedDoctors.jsx
  context/
    AppProvider.jsx
  hooks/
    useDoctors.js
  pages/
    Home/
      Home.jsx
    Doctors/
      DoctorsList.jsx
      DoctorSpeciality.jsx
    Appointment/
      Appointment.jsx
  services/
    apiClient.js
    doctorsApi.js
    authApi.js
  utils/
    generateSlots.js
  types/
    doctor.d.ts (if TS later)
```

## 7. Step-by-Step Remediation Plan

| Step | Action | Outcome |
|------|--------|---------|
| 1 | Consolidate doctor data into assets dataset & update context | Unified schema |
| 2 | Fix all route paths & casing; adopt lowercase kebab-case | Reliable navigation |
| 3 | Remove duplicate provider; keep provider only in `main.jsx` | Single context instance |
| 4 | Correct string interpolations & className typos | Functional UI |
| 5 | Patch imports & add missing hooks | Eliminate runtime errors |
| 6 | Extract slot logic into util | Cleaner component |
| 7 | Add API service layer scaffolding | Ready for backend integration |
| 8 | Add auth state (token, user) to context | Prepare secure calls |
| 9 | Introduce notifications via React-Toastify | Better UX |
| 10 | Add lint rules & a11y plugin | Enforced quality |

## 8. Example Refactors

### Navigation (Before → After)
```js
// Before
navigate('/appointment/${id}')
// After	navigate(`/appointment/${id}`)
```

### Context Initialization
```js
// Before: local inline array
const [doctors, setDoctors] = useState([...])
// After: import dataset & map to normalized shape
import { doctors as seedDoctors } from '../assets/assets_frontend/assets'
const [doctors, setDoctors] = useState(seedDoctors.map(mapToDomainDoctor))
```

### Slot Generation Utility
```js
export function generateSlots(days = 7, startHour = 10, endHour = 21, stepMins = 30, now = new Date()) {
  const out = [];
  for (let d = 0; d < days; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const slots = [];
    const cursor = new Date(date);
    cursor.setHours(d === 0 ? Math.max(cursor.getHours() + 1, startHour) : startHour, 0, 0, 0);
    const end = new Date(date); end.setHours(endHour, 0, 0, 0);
    while (cursor < end) {
      slots.push({ datetime: new Date(cursor), label: cursor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      cursor.setMinutes(cursor.getMinutes() + stepMins);
    }
    out.push(slots);
  }
  return out;
}
```

## 9. Performance Opportunities
- Lazy-load heavy pages: `const Appointment = React.lazy(() => import('./pages/Appointment'));`
- Use `loading="lazy"` for non-critical images.
- Replace large PNGs with optimized WebP variants.
- Memoize large doctor lists if filters applied frequently.

## 10. Testing Recommendations
- Add vitest or jest + React Testing Library.
- Unit test: `generateSlots` edge cases (end-of-day, daylight saving boundaries if applicable).
- Component tests for route navigation & filtering.
- Snapshot tests for Navbar and Doctor cards.

## 11. Accessibility Improvements
- Use semantic `<button>` for interactive elements.
- Add alt texts describing image purpose.
- Keyboard navigation: ensure dropdown accessible (focus trap / ARIA attributes).
- Announce toast notifications with `role="alert"`.

## 12. Deployment / Build Readiness
- Configure environment variables (`VITE_API_BASE_URL`) for API endpoints.
- Add build-time checks: `npm run lint && npm test`.

## 13. KPI Metrics (Post-Fix Goals)
- Lighthouse Performance > 85
- CLS < 0.1; FCP < 1.5s (desktop baseline)
- Bundle size main < 250KB (gzipped) after code splitting.

## 14. Incremental Commit Examples
- chore: normalize doctor schema & unify data source
- fix: correct route paths and template literals
- refactor: extract slot generation util & add tests
- feat: add api client and doctor fetch hook
- feat: implement auth context and protected routes
- perf: add lazy loading for appointment & doctors pages

---
This plan should be executed before backend integration (see API.md & BACKEND.md).
