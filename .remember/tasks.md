# ✅ Task Master: Photography Portfolio

> Visual roadmap of the website project with priorities, dependencies, and execution order.

---

## 🔧 Project Setup & Base Features

| ID  | Task Title                                      | Stat       | Prio      | Deps | Order | Desc                                               | Info                                                                  |
| --- | ----------------------------------------------- | ---------- | --------- | ---- | ----- | -------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Project Setup (Vite, Bun, TS, Tailwind, ShadCN) | ✅ Done    | 🔥 High   | None | 1     | Initial project scaffolding and core dependencies. | Vite, Bun, TypeScript, Tailwind CSS, ShadCN UI library.               |
| 2   | Homepage Layout                                 | ✅ Done    | 🔥 High   | 1    | 2     | Main landing page structure and initial content.   | Includes gallery previews, About section, etc. (Considered complete). |
| 3   | Responsive Design (Initial)                     | ✅ Done    | 🔶 Medium | 1, 2 | 3     | Basic responsiveness for different screen sizes.   | Mobile, tablet, desktop layouts functional but need optimization.     |
| 4   | SEO Basics (Metadata)                           | ✅ Done    | 🔥 High   | 1, 2 | 4     | Core SEO metadata implementation.                  | Title, meta description tags added.                                   |
| 9   | Pricing and Packages Page                       | ⭕ Pending | 🔶 Medium | 1    | 9     | Page detailing service offerings and prices.       | Requires content and design.                                          |
| 10  | Contact Form                                    | ⭕ Pending | 🔶 Medium | 1    | 10    | User contact form implementation.                  | Requires UI, form validation, and email sending setup (e.g., Resend). |

---

## 💾 Database & Backend

| ID  | Task Title                       | Stat           | Prio      | Deps | Order | Desc                                                      | Info                                                                                                                           |
| --- | -------------------------------- | -------------- | --------- | ---- | ----- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 5   | Database & Auth Setup (Supabase) | ✅ Done        | 🔥 High   | 1    | 5     | Setting up Supabase for DB, Auth, and Storage.            | Basic setup complete, potential improvements needed (`tasks.md#22`). Auth flow integrated.                                     |
| 22  | Database Improvements            | 🟡 In Progress | 🔶 Medium | 5    | 22    | Review and refine database schema, queries, and security. | Evaluate current setup for efficiency and scalability. Implement RLS updates if necessary. Refactored `src/lib/supabasedb.ts`. |
| 11  | Calendar System (Core Logic)     | ⭕ Pending     | 🔶 Medium | 5    | 11    | Backend logic for managing photographer availability.     | Database schema for storing booked/unavailable dates. API endpoints for fetching availability.                                 |
| 13  | Newsletter System (Core Logic)   | ⭕ Pending     | 🔶 Medium | 5    | 13    | Backend logic for managing newsletter subscriptions.      | Database schema for subscribers. API endpoints for sign-up. Integration with an email service if needed.                       |

---

## 🛠️ Admin & CMS Features

| ID  | Task Title                        | Stat       | Prio      | Deps  | Order | Desc                                                         | Info                                                                                                            |
| --- | --------------------------------- | ---------- | --------- | ----- | ----- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 6   | Admin Panel (Base + Auth)         | ✅ Done    | 🔥 High   | 5     | 6     | Basic structure and authentication for the admin area.       | Login/logout functional. Basic layout exists. Needs further development (`tasks.md#21`).                        |
| 7   | Admin - Photo Upload & Management | ✅ Done    | 🔥 High   | 6, 5  | 7     | Functionality for uploading and managing gallery photos.     | Upload to Supabase Storage, store metadata in DB. Basic management UI exists. Needs refinement (`tasks.md#21`). |
| 20  | Admin - Content Management        | ⭕ Pending | 🔶 Medium | 6, 5  | 15    | Allow editing of website text sections via Admin Panel.      | E.g., About section, pricing details. Requires DB schema updates and UI in Admin Panel.                         |
| 12  | Admin - Calendar Management       | ⭕ Pending | 🔶 Medium | 6, 11 | 16    | UI for photographer to block/unblock dates in the calendar.  | Interface to interact with the Calendar System backend (`tasks.md#11`).                                         |
| 14  | Admin - Newsletter Management     | ⭕ Pending | 🔶 Medium | 6, 13 | 17    | UI for managing newsletter subscribers and sending emails.   | Interface to interact with Newsletter System backend (`tasks.md#13`). Viewing subscribers, composing emails.    |
| 21  | Admin Panel Improvements          | ⭕ Pending | 🔶 Medium | 6, 7  | 21    | General refinement and enhancement of the Admin Panel UX/UI. | Address usability issues, improve layout, add missing features based on other admin tasks.                      |

---

## 📸 Public Pages & UX

| ID  | Task Title                 | Stat       | Prio      | Deps | Order | Desc                                                                    | Info                                                                                                                        |
| --- | -------------------------- | ---------- | --------- | ---- | ----- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 8   | Individual Gallery Pages   | ⭕ Pending | 🔥 High   | 5, 7 | 8     | Dynamically generated pages for each photo gallery category.            | Wedding, Baby, Family, etc. Fetch photos from Supabase based on category.                                                   |
| 15  | Lazy Loading for Galleries | ⭕ Pending | 🔶 Medium | 8    | 14    | Implement lazy loading for images within gallery pages.                 | Improve initial page load performance.                                                                                      |
| 23  | Fix Carousel Image Sizing  | ✅ Done    | 🔥 High   | 2, 5 | 7.5   | Ensure consistent image sizes in homepage carousels & optimize loading. | Applied fixed height, Supabase transforms, and conditional object-fit (cover/contain) based on aspect ratio in `Index.tsx`. |

---

## 📈 Optimization & Deployment

| ID  | Task Title                     | Stat       | Prio      | Deps | Order | Desc                                               | Info                                                              |
| --- | ------------------------------ | ---------- | --------- | ---- | ----- | -------------------------------------------------- | ----------------------------------------------------------------- |
| 16  | Advanced SEO (Sitemap/Robots)  | ⭕ Pending | 🔶 Medium | 4    | 18    | Generate and configure sitemap.xml and robots.txt. | Improve search engine crawlability and indexing.                  |
| 18  | Responsive Design Optimization | ⭕ Pending | 🔹 Low    | 3    | 19    | Fine-tune and polish responsive layouts.           | Address any layout issues or awkward scaling on specific devices. |
| 17  | Google Analytics Integration   | ⭕ Pending | 🔹 Low    | 1    | 20    | Add Google Analytics tracking code.                | Monitor website traffic and user behavior.                        |
| 19  | Deployment (Vercel)            | ✅ Done    | 🔹 Low    | 1    | 23    | Project hosted and deployed on Vercel.             | CI/CD pipeline might need configuration if not already done.      |

---

## 🗂️ Legend

- ✅ Done
- 🟡 In Progress (Use this if a task is actively being worked on)
- ⭕ Pending
- 🔥 High Priority
- 🔶 Medium Priority
- 🔹 Low Priority
