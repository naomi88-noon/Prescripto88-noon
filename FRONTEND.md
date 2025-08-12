# Frontend Overview

A React + Vite single-page application styled with Tailwind CSS. It implements a simple doctor discovery and appointment booking UI with a global context to store doctor data.

## Tech stack

- React 19 (functional components, hooks)
- React Router DOM 7 (Routes/Route API)
- Vite 6 (dev/build)
- Tailwind CSS 3
- Axios (planned, not yet used)
- React-Toastify (planned, not yet used)

## Project structure

- frontend/
  - index.html – Vite HTML entry
  - vite.config.js – Vite + React plugin
  - tailwind.config.js, postcss.config.js – Tailwind setup
  - src/
    - main.jsx – App bootstrap; wraps <App /> with BrowserRouter and AppContextProvider
    - App.jsx – Top-level routes and layout (Navbar + Routes + Footer)
    - context/AppContext.jsx – React Context with in-memory doctors list and currency symbol
    - components/
      - Navbar.jsx, Header.jsx, Banner.jsx, SpecialityMenu.jsx, TopDoctors.jsx, RelatedDoctors.jsx, footer.jsx
    - pages/
      - Home.jsx, AllDoctors.jsx, Doctor.jsx, Appointment.jsx, Login.jsx, About.jsx, Contact.jsx, MyProfile.jsx, MyAppointment.jsx, Homepage.jsx
    - assets/assets_frontend – images and assets.js (also includes a richer sample doctors dataset)

## Routing

Defined in App.jsx using React Router:
- / → Home
- /header → Header
- /banner → Banner
- /top-doctors → TopDoctors
- /doctor/ → AllDoctors (note: also referenced as /doctors elsewhere)
- /doctors/:speciality → Doctor list for a speciality
- /login → Login
- /about → About
- /contact → Contact
- /My-profile → MyProfile
- /MyAppointment → MyAppointment
- /Appointment → Appointment (note: route parameter expected in multiple places but not wired)

Notes:
- main.jsx already wraps with BrowserRouter; App.jsx wraps with AppContextProvider again, causing duplicate provider.
- Mixed path casing and pluralization (/doctor, /doctors, /Appointment).

## State management and data flow

- context/AppContext.jsx
  - Exposes doctors (array), setDoctors, and currencySymbol.
  - Doctors shape (as currently provided):
    {
      id: number,
      name: string,
      img: string, // image path
      speciality: string,
      address: { line1: string, line2: string }
    }
- Consumers:
  - TopDoctors, AllDoctors, Appointment, Doctor, RelatedDoctors read doctors.
  - TopDoctors also mutates doctors (adds entries) via setDoctors.

- A second dataset exists in assets/assets_frontend/assets.js with a different doctors shape (richer fields):
  {
    _id: string,
    name: string,
    image: string,
    speciality: string,
    degree: string,
    experience: string,
    fees: number,
    address: { line1: string, line2: string }
  }

- Data flow pattern:
  - Pages/components read from context and render lists/cards.
  - Appointment page attempts to derive 7 days of timeslots client-side.

## Styling

- Tailwind utility classes applied across components.
- Global styles via src/index.css and tailwind.config.js.

## Features implemented

- Hero header and marketing banner
- Speciality menu linking to speciality-filtered doctor list
- Top doctors grid
- All doctors grid with click-through to appointment flow
- Appointment page with client-generated time slots
- Basic navbar with profile dropdown (token hardcoded true)
- Static About and Contact pages

## Notable inconsistencies (high level)

- Inconsistent routes and casing (/doctor vs /doctors, Appointment vs appointment).
- Context doctors shape differs from components expecting richer fields (degree, experience, fees, image vs img).
- Multiple string interpolation issues in navigation (using '...' instead of template literals).
- Typos in Tailwind classes and props (items-center vs item-center, font-medium vs font-meduim, etc.).
- Mixed import paths and case sensitivity issues (Linux FS): Home.jsx file imported as ./pages/home.
- Duplicate AppContextProvider wrapping in both main.jsx and App.jsx.
- Some components import the context with a wrong path or casing (../context/appcontext).

## How to run (dev)

- cd frontend
- npm install
- npm run dev

## Build

- cd frontend
- npm run build
- npm run preview

---

This document reflects the current code on branch master and highlights areas that are further detailed in FRONTEND_FIX.md.
