# Project Documentation

## 1. Project Overview

- **Project Name**: Big4 OVLs Admin (Big4 Tiles & Sanitary)
- **Purpose**: A comprehensive content management and administration panel designed to manage the catalog, inventory, and brands for Big4 Tiles & Sanitary.
- **Main Features**: 
  - Secure authentication (JWT, HttpOnly Cookies, refresh token rotation).
  - Full CRUD operations for Products, Categories, and Brands.
  - Image upload and management via Cloudinary.
  - Role-based dashboard (Admin only).
  - Rate limiting and CSRF protection.
- **Target Users**: Internal administrators and staff of Big4 Tiles & Sanitary.
- **Business Logic**: Administrators log in securely to manage the e-commerce/catalog database. They can create categories, define brands, and add products with specifications (SKU, price, stock, images).
- **Problem it Solves**: Eliminates manual database modifications by providing a secure, user-friendly, responsive web interface to manage catalog inventory in real-time.

---

## 2. Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 19, Tailwind CSS v4. Used for fast server-rendered UI, powerful routing, and rapid styling without writing complex custom CSS.
- **Backend**: Next.js Server Actions & API Routes. Server actions handle form submissions securely without needing REST boilerplate, while API routes are used for external integrations and complex auth flows.
- **Database**: PostgreSQL (hosted on Neon Serverless). Used for strong relational data integrity, ACID compliance, and scalability.
- **ORM**: Prisma (v7.8.0). Provides type-safe database access, automated migrations, and a readable schema definition.
- **Authentication**: Custom JWT implementation with HttpOnly cookies, `bcryptjs` for password hashing. Avoids third-party lock-in and provides full control over the session lifecycle.
- **Storage**: Cloudinary. Used for storing and serving optimized product images, relieving the Next.js server of heavy image processing.
- **Libraries**: `zod` for robust schema validation, `react-easy-crop` for image cropping, `nodemailer` for password reset emails.
- **Build Tools**: Turbopack, TypeScript, ESLint.

---

## 3. Project Architecture

The project follows a **Layered Architecture** within the Next.js App Router paradigm.

- **Folder Structure**: Separates concerns into UI (`components`, `app`), Business Logic (`services`, `actions`), Data Access (`repositories`), and Cross-cutting concerns (`lib`, `utils`).
- **Layer Architecture**:
  - **Controller/Action Layer**: Next.js Server Actions (`src/actions`) and API Routes (`src/app/api`). They parse requests and delegate to services.
  - **Service Layer**: (`src/services`). Contains pure business logic (e.g., auth logic, image uploading logic, validation orchestration).
  - **Repository Layer**: (`src/repositories`). Handles all direct Prisma database operations. Keeps the service layer database-agnostic.
- **Request Flow**: Client -> Server Action -> Zod Validation -> Service -> Repository -> Database.
- **Data Flow**: One-way data flow via React Server Components fetching data from Repositories and passing to Client Components.
- **Authentication Flow**: Credential login -> JWT generation -> Set HttpOnly Cookies -> Client redirect.
- **State Management**: URL state (for search/pagination), React `useState` for transient UI state (modals, forms), Server Components for data state.
- **File Upload Flow**: Client selects image -> API Route `/api/upload` -> Cloudinary -> URL saved in Database.

---

## 4. Complete Folder Structure

```text
c:/Users/ADMIN/OneDrive/Desktop/Big4 OVLs/Big4-Admin/
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── seed.ts               # Database seeder script
├── public/                   # Static assets (images, SVGs)
├── src/
│   ├── actions/              # Next.js Server Actions (Brand, Category, Product)
│   ├── app/                  # Next.js App Router pages
│   │   ├── (website)/        # Public website routes (if any)
│   │   ├── admin/            # Protected admin dashboard pages
│   │   ├── api/              # REST API Routes (auth, upload)
│   │   ├── globals.css       # Global Tailwind and custom CSS
│   │   ├── layout.tsx        # Root HTML layout
│   │   └── page.tsx          # Root entry point (Redirects to /login)
│   ├── components/           # React UI Components
│   │   ├── admin/            # Admin-specific layouts (Sidebar, Header)
│   │   ├── ui/               # Reusable atomic UI (Buttons, Inputs, Modals)
│   │   └── products/         # Product-specific components (Tables, Forms)
│   ├── config/               # Configuration files
│   ├── constants/            # Application constants (HTTP statuses, ROLES)
│   ├── lib/                  # Core utilities (Prisma client, Auth, Rate Limiter)
│   ├── middleware/           # Route middlewares (CSRF, withAuth)
│   ├── repositories/         # Database access layer (User, Product, Brand)
│   ├── services/             # Business logic layer (AuthService, ProductService)
│   ├── types/                # TypeScript interface definitions
│   ├── utils/                # Helper functions (API response formatters)
│   └── validations/          # Zod schemas for input validation
├── .env                      # Environment variables
├── next.config.ts            # Next.js config
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 5. Database Documentation

### User (users)
- **Purpose**: Stores administrator credentials.
- **Columns**:
  - `id` (String, PK, cuid)
  - `email` (String, Unique)
  - `password` (String)
  - `name` (String)
  - `isActive` (Boolean, Default: true)
  - `failedLoginAttempts` (Int, Default: 0)
  - `lockedUntil` (DateTime, Optional)
  - `lastLoginAt` (DateTime, Optional)

### RefreshToken (refresh_tokens)
- **Purpose**: Stores hashed refresh tokens to allow session rotation.
- **Relationships**: Belongs to `User`.

### PasswordResetToken (password_reset_tokens)
- **Purpose**: Secure tokens for forgotten password flows.
- **Relationships**: Belongs to `User`.

### Category (categories)
- **Purpose**: Product categorizations.
- **Columns**: `id` (PK), `name` (Unique), `slug` (Unique).
- **Relationships**: Has many `Product`.

### Brand (brands)
- **Purpose**: Product manufacturers.
- **Columns**: `id` (PK), `name` (Unique), `slug` (Unique).
- **Relationships**: Has many `Product`.

### Product (products)
- **Purpose**: The core inventory item.
- **Columns**:
  - `id` (String, PK)
  - `name` (String)
  - `slug` (String, Unique)
  - `sku` (String, Unique)
  - `description` (String, Optional)
  - `price` (Float)
  - `costPrice` (Float)
  - `stock` (Int, Default: 0)
  - `imageUrl` (String, Optional)
  - `isActive` (Boolean, Default: true)
- **Relationships**: Belongs to `Category`, Belongs to `Brand`, Has many `ProductImage`.

### ER Diagram

```mermaid
erDiagram
    User ||--o{ RefreshToken : has
    User ||--o{ PasswordResetToken : has
    Category ||--o{ Product : categorizes
    Brand ||--o{ Product : manufactures
    Product ||--o{ ProductImage : contains
    
    User {
        String id PK
        String email UK
        String password
        String name
        Int failedLoginAttempts
        DateTime lockedUntil
    }
    Product {
        String id PK
        String name
        String slug UK
        String sku UK
        Float price
        Int stock
    }
```

---

## 6. Complete API Documentation

### POST `/api/auth/login`
- **Description**: Authenticates admin and sets HTTP-only cookies.
- **Auth Required**: No.
- **Rate Limit**: 5 attempts per 15 mins per IP.
- **Body**: `{ "email": "...", "password": "..." }`
- **Validation**: Zod `loginSchema`.
- **Response**: `200 OK` with User data, or `400/401/423/429` on failure.

### POST `/api/upload`
- **Description**: Uploads a base64 or multipart image to Cloudinary.
- **Auth Required**: Yes.
- **Body**: Form data containing `file`.
- **Response**: `200 OK` with Cloudinary secure URL and public ID.

*(Note: Most other operations use Next.js Server Actions rather than standard REST APIs).*

---

## 7. Authentication System

- **Login Flow**: User submits credentials -> Validated against `User` table via `bcryptjs` -> If valid, generates JWT Access Token (short-lived) and Refresh Token (long-lived) -> Refresh Token is hashed and saved to DB -> Both tokens are attached as HttpOnly, Secure, SameSite=Lax cookies.
- **Session Lifecycle**: Middleware (`middleware.ts`) intercepts requests to `/admin`. It checks the Access Token. If expired, the client must trigger a refresh flow or log in again.
- **Role System**: Currently single-role (`ADMIN` defined in constants).
- **Security Features**: 
  - CSRF protection via Origin header validation.
  - Rate limiting via in-memory IP tracking (`src/lib/rate-limiter.ts`).
  - Account lockout (5 failed attempts locks account for 30 minutes).

---

## 8. Business Logic

### Product Management
- **Creation**: Admin fills product form -> Client converts images to base64 or triggers `/api/upload` -> Server Action `createProduct` is called -> Zod validates uniqueness of SKU/Slug -> `product.service.ts` processes data -> `product.repository.ts` saves to Postgres.
- **Edge Cases**: Duplicate SKUs throw handled validation errors instead of crashing the server. Stock cannot be negative.
- **Validation**: Zod enforces price > 0, strict string lengths, and valid category IDs.

---

## 9. Frontend Documentation

- **Pages**:
  - `/login`: Admin authentication portal.
  - `/admin`: Dashboard statistics.
  - `/admin/products`: Product data grid and filtering.
  - `/admin/categories`, `/admin/brands`: Taxonomy management.
- **State Management**: Zustand is generally avoided in favor of native React 19 `useState`, `useTransition`, and URL search parameters for global filter states.
- **Reusable Components**: `LoadingButton`, `StockModal`, `ImageUploader`.
- **Styling**: Tailwind CSS v4 utilizing CSS variables in `globals.css` for a centralized design system.

---

## 10. Backend Documentation

- **Server Actions** (`src/actions`): Act as the mutation endpoints for the frontend. They execute on the server, validate input, and call Services.
- **Services** (`src/services`): Orchestrate the business logic. Example: `auth.service.ts` handles the complex logic of hashing, comparing passwords, locking accounts, and rotating tokens.
- **Repositories** (`src/repositories`): Wrappers around Prisma Client. They isolate the ORM logic, making the services cleaner and highly testable.
- **Utilities**: `api-response.ts` standardizes Next.js JSON responses. `slugify.ts` generates URL-friendly strings.

---

## 11. Complete API Flow

```mermaid
sequenceDiagram
    participant Client
    participant ServerAction
    participant Zod
    participant Service
    participant Repository
    participant Database

    Client->>ServerAction: Call createProduct(data)
    ServerAction->>Zod: Validate(data)
    alt Invalid
        Zod-->>ServerAction: Error
        ServerAction-->>Client: Return Validation Errors
    else Valid
        ServerAction->>Service: create(validData)
        Service->>Repository: checkSkuExists()
        Repository->>Database: SELECT sku
        Database-->>Repository: null
        Service->>Repository: saveProduct()
        Repository->>Database: INSERT INTO products
        Database-->>Repository: Product Record
        Service-->>ServerAction: Success Data
        ServerAction-->>Client: Revalidate Path & Return Success
    end
```

---

## 12. Database Flow

- **Reads**: Client Components fetch data indirectly via Server Components, which call `repository.findAll()` directly during SSR. This ensures zero layout shift and instant page loads.
- **Writes**: Controlled strictly through Next.js Server Actions. Server Actions update the DB and call `revalidatePath('/admin/products')` to clear the Next.js router cache and reflect new data instantly.

---

## 13. Feature Documentation

### Category Management
- **Purpose**: Grouping products logically.
- **Files**: `app/admin/categories/page.tsx`, `actions/category.actions.ts`, `services/category.service.ts`.
- **Logic**: Simple CRUD. Deleting a category that has products is restricted via Prisma relational constraints (`Restrict` or `Cascade` depending on business needs).

### Image Uploading
- **Purpose**: Handling product media.
- **Files**: `ui/ImageUploader.tsx`, `api/upload/route.ts`, `lib/cloudinary.ts`.
- **Logic**: User selects image -> Local preview generated -> Cropped via `react-easy-crop` -> Pushed to API -> Uploaded to Cloudinary -> Secure URL returned and attached to Product payload.

---

## 14. Environment Variables

| Variable | Purpose | Required | Example |
|---|---|---|---|
| `DATABASE_URL` | Prisma DB Connection | YES | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Signing Access Tokens | YES | `super_secret_key_123` |
| `JWT_REFRESH_SECRET` | Signing Refresh Tokens | YES | `super_secret_refresh_key` |
| `CLOUDINARY_URL` | Cloudinary API access | YES | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` |
| `SMTP_HOST` | Email delivery host | NO | `smtp.gmail.com` |

---

## 15. Third Party Integrations

1. **Neon Serverless PostgreSQL**: Cloud database utilized for instant scaling and branching.
2. **Cloudinary**: Assets CDN and manipulation. Images are transformed on the fly (e.g., resizing, WebP conversion) via URL parameters to save bandwidth.
3. **Nodemailer**: Used for sending "Forgot Password" emails containing secure reset tokens.

---

## 16. Configuration Files

- `next.config.ts`: Configures Turbopack, external image domains (e.g., `res.cloudinary.com`), and experimental features.
- `tailwind.config` / `globals.css`: Tailwind v4 uses standard CSS imports instead of JS configs. The design tokens are CSS variables.
- `prisma/schema.prisma`: The single source of truth for the database schema.
- `tsconfig.json`: Strict TypeScript configuration enforcing strict null checks and path aliases (`@/*`).

---

## 17. Security Analysis

- **Authentication**: JWT stored in HTTP-Only cookies. Inaccessible to client-side JS (prevents XSS theft).
- **SQL Injection**: Prevented globally by Prisma ORM's parameterized queries.
- **CSRF**: Mitigated by SameSite cookie attributes and `withCsrf` middleware checking Origin headers.
- **Rate Limiting**: `rate-limiter.ts` stores IP hits in memory to prevent brute-force attacks on the login endpoint.
- **File Upload Security**: Cloudinary handles malicious file stripping. The API route also validates MIME types.

---

## 18. Performance

- **Caching**: Next.js Data Cache and Full Route Cache aggressively cache admin read operations. Cache is intelligently busted using `revalidatePath`.
- **Image Optimization**: Currently uses `<img>` but planned migration to `next/image` to allow lazy loading and automatic WebP serving.
- **Database Optimization**: Indexes (`@@index`) applied to highly queried fields like `categoryId`, `brandId`, and `slug`.
- **Font Loading**: Relies on System Fonts (`font-sans`) locally to prevent blocking render times, as Google Fonts were restricted on the host network.

---

## 19. Deployment

- **Development**: Run `npm run dev` (Turbopack enabled). Note: Requires standard `PrismaClient` locally to bypass WebSocket firewalls.
- **Production Build**: `npm run build` compiles React Server Components and generates static HTML where possible.
- **Hosting Target**: Vercel. Perfectly integrated with Next.js App Router for Edge caching and serverless functions.
- **Database Target**: Neon Postgres. Automatically scales resources to 0 when inactive to save costs.

---

## 20. Known Issues

- **Network Constraints**: The Neon Serverless WebSockets adapter fails on highly restrictive local corporate networks. *Fix applied:* Local environment falls back to standard TCP Prisma connections.
- **Lint Warnings**: `<img>` tags are currently triggering ESLint warnings in `ProductTable.tsx`. `setStock` inside `useEffect` triggers a React warning in `StockModal.tsx`.
- **Session Invalidations**: If a user is deleted from the DB, their active JWT remains valid until expiry. *Future improvement:* Add a DB-level token blacklist check in middleware.

---

## 21. Complete Sequence Diagrams

### Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant LoginUI
    participant NextJSServer
    participant DB

    User->>LoginUI: Enter Credentials
    LoginUI->>NextJSServer: POST /api/auth/login
    NextJSServer->>DB: Check email & password
    DB-->>NextJSServer: User Record
    NextJSServer->>NextJSServer: Generate JWT & Hash Refresh Token
    NextJSServer->>DB: Save Refresh Token
    NextJSServer-->>LoginUI: Set HttpOnly Cookies
    LoginUI->>User: Redirect to /admin
```

---

## 22. ER Diagram
*(See Section 5 for the primary Mermaid ER Diagram).*

---

## 23. API Relationship Diagram

```mermaid
graph TD
    A[Client] --> B(Server Actions)
    A --> C(/api/auth/login)
    A --> D(/api/upload)
    
    B --> E[Services]
    C --> E
    D --> F[Cloudinary API]
    
    E --> G[Repositories]
    G --> H[(Neon PostgreSQL)]
```

---

## 24. Folder Dependency Diagram

```mermaid
graph LR
    App[app/] --> Actions[actions/]
    App --> Components[components/]
    Actions --> Validations[validations/]
    Actions --> Services[services/]
    Services --> Repositories[repositories/]
    Services --> Lib[lib/]
    Repositories --> Prisma[(Prisma DB)]
```

---

## 25. State Management Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : Submit Form (useTransition)
    Loading --> Success : Server Action Resolves
    Loading --> Error : Validation/DB Error
    Success --> Idle : revalidatePath & Reset Form
    Error --> Idle : Display Error Alert
```

---

## 26. File Dependency Graph

- `src/app/layout.tsx` depends on `globals.css` and Next.js Metadata.
- `src/actions/*.actions.ts` directly depend on `src/services/*.service.ts` and `src/validations/*.ts`.
- `src/services/*.ts` directly depend on `src/repositories/*.ts` (Dependency Injection pattern is manually emulated here).
- `src/repositories/*.ts` are the ONLY files that depend on `src/lib/prisma.ts`.

---

## 27. Integration Guide

To integrate external services (like a public storefront) with this admin database:
- **Database Sharing**: The easiest integration is connecting the public storefront directly to the Neon PostgreSQL database URL. Prisma schema can be copied.
- **API Access**: Currently, all endpoints are protected by `withAuth` and require JWTs intended for Admins. To create a public API, add routes under `src/app/api/public/` that utilize the Repositories layer but do NOT wrap with `withAuth`.
- **Image Serving**: Use the Cloudinary URLs stored in the `ProductImage` table.

---

## 28. Development Guide

- **Install**: `npm install`
- **Environment**: Copy `.env.example` to `.env.local` and populate variables.
- **Database Setup**: `npx prisma db push` to sync schema, then `npm run db:seed` to create the default Admin user.
- **Run**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

*Important Note: If you encounter Prisma `ErrorEvent` timeouts locally, ensure `src/lib/prisma.ts` is using the standard `new PrismaClient()` without the Neon Serverless WebSocket adapter if your network blocks WebSockets.*

---

## 29. AI Context Summary

**Project**: Big4 OVLs Admin
**Stack**: Next.js 15 (App Router), React 19, Prisma 7, Neon DB, Tailwind v4.
**Architecture**: 
- Strict separation of concerns: `Server Actions` -> `Services` -> `Repositories`.
- **Database**: Relational PostgreSQL. Core models: `User`, `Product`, `Category`, `Brand`, `ProductImage`.
- **Auth**: Custom JWT stored in HttpOnly cookies. Managed by `auth.service.ts` and validated via `middleware.ts`.
- **File Upload**: Handled securely via `Cloudinary`.
**Critical Rules for AI Modification**:
- **Do not** write DB queries in Server Actions or Components. Always use the Repository layer.
- **Do not** use `next/font/google` if network constraints exist locally.
- Handle state using React 19 native hooks (`useTransition`, `useActionState`) instead of client-heavy libraries where possible.

---

## 30. Conclusion

The Big4 OVLs Admin Panel is a highly secure, performant, and scalable content management system. By leveraging Next.js React Server Components and Server Actions, it achieves incredibly fast load times and a secure boundary between client and server. The tiered architectural pattern (Action -> Service -> Repository) ensures the codebase remains maintainable as business logic scales. Future scope includes resolving minor linting technical debt (converting native `<img>` to `<Image>`), expanding role-based access control, and potentially adding background worker queues for bulk data imports.
