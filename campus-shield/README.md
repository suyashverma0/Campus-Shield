# Campus Shield — University Lost & Found Platform

Campus Shield is a modern, responsive, and secure college Lost & Found frontend built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**, inspired by the tactile neo-brutalist and high-polish editorial design aesthetic of [Linklee.in](https://linklee.in/).

---

## 🌟 Key Features

1. **Linklee-Inspired Visual Design System**:
   - Tactile neo-brutalist interaction physics with hard drop shadows (`shadow-hard`, `shadow-hard-md`, `shadow-hard-lg`).
   - High-contrast ink borders (`border-2 border-ink`), warm paper backgrounds (`bg-paper`), and vibrant alert tags (`bg-pop`, `bg-accent`, `bg-status-lost`).
   - Punchy display typography using Outfit & Plus Jakarta Sans.

2. **Automated AI Matching Engine**:
   - Multi-factor scoring comparing categories, campus zones & buildings, timestamps, and physical descriptors (brands, colors, tags).
   - Instant visual side-by-side comparison modal with percentage confidence breakdown.

3. **Claimant Ownership Challenge (Anti-Fraud)**:
   - Secret verification question for lost valuables (e.g., hidden sticker, lock screen, engraving) before initiating handovers.

4. **Real-time Mock Data & Centralized API Service**:
   - Decoupled `api.js`, `itemService.js`, `authService.js`, `matchService.js`, and `messageService.js` layers ready for production REST or GraphQL backends.
   - LocalStorage persistence for testing user changes, reporting items, and resolving handovers.

5. **Student Hub & In-App Security Messaging**:
   - Authenticated student profiles with college email, ID badge, and Karma points for honest returns.
   - End-to-end simulated chat thread between owners and finders.

---

## 📁 Project Structure

```
campus-shield/
├── README.md
├── .gitignore
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── images/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── AppLayout.jsx
    │   │   ├── common/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── SearchBar.jsx
    │   │   │   ├── StatusBadge.jsx
    │   │   │   ├── LoadingState.jsx
    │   │   │   ├── EmptyState.jsx
    │   │   │   ├── ConfirmDialog.jsx
    │   │   │   └── Toast.jsx
    │   │   ├── items/
    │   │   │   ├── ItemCard.jsx
    │   │   │   ├── ItemGrid.jsx
    │   │   │   ├── ItemFilters.jsx
    │   │   │   ├── ImageUploader.jsx
    │   │   │   └── ItemForm.jsx
    │   │   └── matches/
    │   │       ├── MatchCard.jsx
    │   │       └── MatchComparison.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── LostItems.jsx
    │   │   ├── FoundItems.jsx
    │   │   ├── ReportLost.jsx
    │   │   ├── ReportFound.jsx
    │   │   ├── ItemDetails.jsx
    │   │   ├── Matches.jsx
    │   │   ├── MyReports.jsx
    │   │   ├── MyMatches.jsx
    │   │   ├── Messages.jsx
    │   │   ├── Profile.jsx
    │   │   └── NotFound.jsx
    │   ├── routes/
    │   │   └── AppRoutes.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── itemService.js
    │   │   ├── authService.js
    │   │   ├── matchService.js
    │   │   └── messageService.js
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── ItemContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── data/
    │   │   └── mockData.js
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Running Locally

```bash
cd campus-shield/frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.
