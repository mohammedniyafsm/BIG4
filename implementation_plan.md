# Enterprise Monorepo Migration Plan

> [!IMPORTANT]
> **User Review Required**: This document is purely an analysis and architectural planning phase. No code has been modified, moved, or deleted. Please review the 24 sections below. Once explicitly approved, the phased migration will begin.

---

## 1. Executive Summary

This document proposes a comprehensive migration strategy to merge the existing **User (Web)** and **Admin** Next.js applications into a single, highly scalable, enterprise-grade monorepo. The core architectural shift involves decoupling all backend logic (currently entangled in the Admin app via Next.js Server Actions) into a dedicated, independent **Express.js Server**. This ensures a clear separation of concerns, secure database access, and highly reusable shared packages (UI, Types, Validation) across both independent frontends.

---

## 2. Existing Architecture Analysis

- **User Application (Root)**: A frontend-heavy Next.js 16 (App Router) application. It relies on Tailwind v4, Shadcn UI, Framer Motion, and GSAP for a premium UI. It currently uses a dummy API client and lacks direct database integration.
- **Admin Application (`Big4-Admin/`)**: A Next.js 16 application that inappropriately mixes frontend UI with backend logic. It contains a Prisma schema (connecting to PostgreSQL), Server Actions acting as data mutators, business logic (Services), and basic API routes (Auth, Upload).
- **Current Flaw**: Prisma and backend services are coupled to the Admin frontend. There is no unified backend, and the user frontend operates completely detached from the actual data source.

---

## 3. Dependency Analysis

- **Frontend Shared**: Next.js 16.2.10, React 19.2.4, Tailwind v4.
- **User Specific**: `framer-motion`, `gsap`, `shadcn` components, `lucide-react`.
- **Admin Specific (Backend)**: `@prisma/client`, `bcryptjs`, `jsonwebtoken`, `zod`, `nodemailer`, `pg`, `browser-image-compression`.
- **Conclusion**: The monolithic integration in the Admin app introduces heavy backend dependencies to a frontend project. Extracting the backend will resolve this.

---

## 4. Duplicate Code Report

- **Types**: Interfaces like `Product` and `Category` exist independently in both repositories.
- **Configuration**: Duplicated `tsconfig.json`, `tailwind` configuration, and ESLint configurations.
- **Validation**: Potentially duplicated form/data validation rules.
- **UI Components**: Overlapping concepts for basic elements (Buttons, Inputs, Dialogs) where the User app uses Shadcn and the Admin app uses custom implementations.

---

## 5. Conflict Analysis

- **Architectural Conflict**: Admin app uses Next.js Server Actions for database writes, which cannot be securely exposed to the separate User frontend without creating messy, tightly-coupled API routes.
- **Dependency Conflict**: Running Prisma inside a Vercel-deployed Next.js app can lead to serverless connection limits. Extracting Prisma to a long-running Express server (deployed on a VPS/Railway) resolves this connection pooling conflict.

---

## 6. Recommended Enterprise Architecture

The target architecture is a **Turborepo** based monorepo containing three distinct applications:
1. `apps/web`: The User frontend (Next.js).
2. `apps/admin`: The Admin dashboard frontend (Next.js).
3. `apps/server`: The unified backend API (Express.js).

Neither frontend will have access to the database or ORM. All communication will flow via HTTP REST calls to `apps/server`.

---

## 7. Folder Structure

```text
/
├── apps/
│   ├── web/               # User Next.js Frontend
│   ├── admin/             # Admin Next.js Frontend
│   └── server/            # Express.js Backend API
├── packages/
│   ├── ui/                # Generic UI Components (Button, Modal, etc.)
│   ├── api-client/        # Shared Axios/Fetch client
│   ├── validation/        # Shared Zod schemas
│   ├── types/             # Shared TypeScript DTOs
│   ├── utils/             # Shared helper functions
│   ├── config/            # Shared ESLint, TS configs
│   └── constants/         # Enums, roles, routes
├── docs/                  # Project documentation
├── tests/                 # E2E and cross-package tests
├── docker/                # Dockerfiles and compose configs
├── .github/               # CI/CD Workflows
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## 8. Backend Architecture

The backend (`apps/server`) will be built using **Express.js** and follow a layered, enterprise architecture:

- **Routing Layer**: Express routes grouping endpoints by feature and version (e.g., `v1/products`).
- **Middleware Layer**: JWT validation, Role-based access control (RBAC), Error handling, Rate limiting.
- **Controller Layer**: Handles HTTP requests, extracts parameters, and returns HTTP responses.
- **Service Layer**: Contains core business logic.
- **Validation Layer**: Uses `@repo/validation` Zod schemas to validate incoming payloads.
- **Repository Layer**: Abstraction over Prisma to handle all database queries.
- **Storage Layer**: Interface for handling file uploads (abstracted).

---

## 9. Database Architecture

**Prisma** will be installed and configured **exclusively inside `apps/server`**.

### Merged Schema Models:
- `User`: Core user account details.
- `Role` & `Permission`: RBAC tables.
- `Product`, `Category`, `Brand`: E-commerce catalog.
- `ProductImage`: Related gallery images.
- `RefreshToken`, `PasswordResetToken`: Auth tokens.
- `AuditLog`: Tracking admin actions.
- `Enquiry`: Customer inquiries from the Web app.
- `Settings`: Global application settings.

Relationships will be strictly normalized (e.g., `Product` -> `Category` via Foreign Key). Models will **not** be exported directly to the frontend.

---

## 10. API Design

The API will follow a strict RESTful design with versioning (`/api/v1/...`).

### Endpoint Structure
- **Public**:
  - `GET /api/v1/products`
  - `GET /api/v1/products/:slug`
  - `GET /api/v1/categories`
- **Protected (Admin)**:
  - `POST /api/v1/admin/products`
  - `PUT /api/v1/admin/products/:id`
  - `POST /api/v1/admin/upload`
- **Auth**:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/logout`

### Response Structure
Standardized JSON responses:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "pagination": { ... } }
}
```

---

## 11. Authentication Design

- **Flow**: User logs in -> Server issues a short-lived **JWT Access Token** (in memory/response) and a long-lived **Refresh Token** (stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie).
- **Storage**: Frontends never store sensitive tokens in `localStorage`.
- **RBAC**: Middleware decodes the JWT and checks the `role` against required permissions for `/admin/*` routes.

---

## 12. Shared Packages Design

Only strictly reusable code belongs in packages:
- **`@repo/ui`**: Base generic components (Button, Input, Dialog, Toast, Table, Loader). *Note: Feature components like Hero, 3D Canvas, and Dashboards remain inside `apps/web` or `apps/admin`.*
- **`@repo/api-client`**: Abstracted fetch wrapper with functions like `getProducts()`, `login()`, handling automatic token refresh via interceptors.
- **`@repo/validation`**: Centralized Zod schemas.
- **`@repo/types`**: DTOs for frontend consumption.
- **`@repo/utils`**: Formatting tools (`formatPrice`), loggers, class merging (`cn`).
- **`@repo/config`**: Pre-configured TS, ESLint, Prettier setups.
- **`@repo/constants`**: Role definitions, status enums.

---

## 13. DTO Strategy

To decouple the database from the frontend, we use Data Transfer Objects (DTOs):
1. **Backend (Prisma Models)**: Represents the raw DB structure (e.g., includes password hashes, internal IDs).
2. **DTO Mapper (Service Layer)**: Transforms Prisma Models into safe DTOs.
3. **Shared Types (`@repo/types`)**: Defines the DTO interface (e.g., `ProductDTO`, `UserPublicDTO`).
4. **Frontend**: Imports and consumes the DTO interface.

---

## 14. Validation Strategy

- **Single Source of Truth**: `@repo/validation` exports Zod schemas (e.g., `createProductSchema`).
- **Backend Usage**: Express middleware uses the schema to parse and validate `req.body` before hitting the controller.
- **Frontend Usage**: `react-hook-form` utilizes the `@hookform/resolvers/zod` with the exact same schema to provide immediate client-side validation.

---

## 15. Storage Strategy

Avoid tight coupling to Cloudinary.
- **Interface**: Define a `StorageProvider` interface in the backend.
- **Adapter**: Implement a `CloudinaryAdapter` that satisfies this interface.
- **Future Proofing**: If migrating to S3 or Cloudflare R2, simply implement an `S3Adapter` without changing business logic or controllers.

---

## 16. Logging Strategy

Centralized logging mechanism using tools like Winston or Pino inside `apps/server`.
- **API Logs**: Track request latency and endpoints accessed.
- **Authentication Logs**: Track failed logins, password resets.
- **Database Logs**: Slow query tracking.
- **Error Logs**: Stack traces captured centrally.

---

## 17. Testing Strategy

- **Unit Tests**: Test utility functions in `@repo/utils`, pure business logic in Server Services.
- **Integration Tests**: Supertest for Express API endpoints (requires test DB).
- **E2E Tests**: Playwright or Cypress covering critical paths (Login -> Admin Dashboard -> Create Product -> View on Web).
- **Location**: Kept in the `/tests/` directory at the root for cross-package E2E, and adjacent to files for unit tests.

---

## 18. Deployment Strategy

- **`apps/web` (User App)**:
  - **Host**: Vercel
  - **Domain**: `example.com`
  - **CI/CD**: GitHub pushes to `main` auto-deploy.
- **`apps/admin` (Admin App)**:
  - **Host**: Vercel
  - **Domain**: `admin.example.com`
- **`apps/server` (Express API)**:
  - **Host**: Railway, Render, or custom VPS.
  - **Domain**: `api.example.com`
  - **Database**: PostgreSQL hosted on Neon (or internal to VPS).

---

## 19. Migration Phases

> [!WARNING]
> No code will be deleted before validation is complete in each phase.

### Phase 1: Repository Analysis (Completed)
- Objectives: Analyze current state, identify duplicates, and formulate strategy.

### Phase 2: Monorepo Setup
- **Objectives**: Initialize Turborepo and pnpm workspaces.
- **Tasks**: Create root configuration files and empty `apps/` and `packages/` directories.
- **Validation**: Ensure `pnpm install` completes without workspace errors.

### Phase 3: Copy Applications
- **Objectives**: Move existing code without altering functionality.
- **Tasks**: Copy User to `apps/web` and Admin to `apps/admin`. Leave root intact as backup.
- **Validation**: Both apps can run locally (`pnpm dev`) independently.

### Phase 4: Verify Applications
- **Objectives**: Ensure copied apps function identical to pre-migration state.

### Phase 5: Extract Backend
- **Objectives**: Stand up `apps/server` while keeping the current Admin app functional.
- **Tasks**: Initialize Express. Move Prisma schema. **Copy** existing Server Actions and build equivalent Express Controllers/Routes alongside them. Create Repository and Service layers. **Do not delete the old Server Actions yet.**
- **Validation**: Postman/curl hits to the Express API return valid JSON matching the expected behavior.

### Phase 6: Verify Backend
- **Objectives**: Validate DB connection, JWT generation, and Cloudinary upload via the new Express API.

### Phase 7: Extract Shared Packages
- **Objectives**: Create `@repo/ui`, `@repo/types`, `@repo/validation`.
- **Tasks**: Migrate generic UI elements, extract Types to DTOs, extract Zod schemas.

### Phase 8: Update Imports & Switch Frontend to API
- **Objectives**: Connect the apps to the packages and backend.
- **Tasks**: Replace relative imports in `web` and `admin` with `@repo/*`. Switch the frontend data fetching from the old Server Actions to the new Express API using `@repo/api-client`.
- **Validation**: TypeScript compiles cleanly. Both Web and Admin successfully fetch and mutate data via the Express API.

### Phase 9: Testing
- **Objectives**: Full system test.
- **Tasks**: Run unit tests, manually verify Login, Product Creation, and Web display.

### Phase 10: Cleanup
- **Objectives**: Remove legacy root files, redundant code, and the old Server Actions that are no longer used.
- **Tasks**: Safely delete the old Server Actions from `apps/admin` now that the Express API is fully verified.
- **Rollback**: None, once verified.

### Phase 11: Documentation
- **Objectives**: Finalize developer guides, deployment steps, and environment variable requirements.

---

## 20. Risk Analysis

- **Medium Risk**: Migrating Next.js Server Actions to Express routes entails paradigm shifts (req/res vs function calls). By keeping the old Server Actions intact during the transition and only removing them after verifying the new Express API works, the risk of downtime or data loss is heavily minimized.
- **Medium Risk**: Extracting UI components may break complex styling in the Admin app. Strict adherence to generic component extraction mitigates this.
- **Low Risk**: Turborepo setup is standard and well-documented.

---

## 21. Rollback Plan

- Throughout Phases 1 to 9, the original code remains untouched in previous Git commits.
- If Phase 8 (Update Imports) fails catastrophically, we revert the commit and branch off Phase 7 to resolve integration issues iteratively.
- Deployment rollback relies on Vercel's instant rollback feature and database backups.

---

## 22. Validation Checklist

- [ ] `pnpm build` succeeds for all 3 apps and all packages.
- [ ] User web app correctly fetches products from the Express API.
- [ ] Admin app can successfully login and receive an HttpOnly cookie.
- [ ] Admin app can create a product (validates via `@repo/validation`, uploads via Storage Adapter, saves via Prisma).
- [ ] No Prisma or database imports exist in `apps/web` or `apps/admin`.
- [ ] Shared generic components in `@repo/ui` render correctly in both Next.js apps.

---

## 23. Future Scalability Plan

- **Microservices**: The layered backend allows for easy extraction of the Auth or Image processing services into separate microservices if traffic scales heavily.
- **Caching**: Introduce Redis to `apps/server` for caching heavy read operations (`/api/v1/products`).
- **CDN Integration**: Frontends natively utilize Vercel's CDN. Storage Adapter ensures assets are CDN-delivered.

---

## 24. Final Recommendation

This enterprise architecture enforces strict separation of concerns, ensuring maximum security (database isolated behind Express), unparalleled reusability (via pnpm workspaces), and high performance. **I highly recommend proceeding with this architecture.**

*Awaiting explicit approval to begin Phase 2: Monorepo Setup.*
