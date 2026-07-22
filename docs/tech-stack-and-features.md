# Big4 Tiles & Sanitary — Tech Stack & Features

This document provides a comprehensive overview of the technology stack and feature sets for both the Admin Panel (`apps/admin`) and the Storefront (`apps/web`).

## Core Technology Stack (Monorepo)

Both applications run on a modern JavaScript ecosystem within a unified monorepo structure.

- **Framework**: Next.js 16.2 (App Router, React Server Components)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Package Manager**: npm workspaces (`apps/web` and `apps/admin`)

---

## 1. Storefront (`apps/web`)

The Storefront is highly optimized for performance, SEO, and visual fidelity, utilizing Server-Side Rendering (SSR) and advanced animation libraries.

### Tech Stack Additions
- **Animations & Micro-interactions**: GSAP (GreenSock), Framer Motion, and `tw-animate-css`.
- **UI Primitives**: Radix UI, shadcn/ui components, and Lucide React icons.
- **State & Routing**: Next.js native `searchParams` for URL-driven state.

### Full Feature Set
- **High-Performance Catalog**: Server-rendered product listings that load instantly.
- **Advanced Filtering & Sorting**: 
  - URL-parameter driven filtering system (shareable links).
  - Filter by Category, Brand, Material, Finish, Size, Color, Price Range, and Availability (In Stock).
  - Sorting options (Newest, Price High/Low, Name A-Z/Z-A).
- **Responsive Mobile Controls**: Dedicated inline mobile controls with bottom-sheet slide-outs for filtering on smaller screens.
- **Rich Product Detail Pages**:
  - Image gallery with thumbnail navigation and full-screen lightbox.
  - **Smart Quantity Calculator**: Automatically computes the required number of boxes or area (m²) based on a specific product's coverage per box, including an optional "+10% Wastage" toggle.
  - Accordion specifications and highlight bullet points.
- **Enquiry & Sampling**: "Get a Sample" flow that pre-fills forms with product details and SKUs.
- **Design System**: Strict design tokens for typography (Inter + Zoom Pro Extended), spacing, and theme-adaptive colors (Light/Dark mode compatible).
- **SEO Optimization**: Fully SSR pages with JSON-LD structured data and dynamic metadata.
- **Instant Cache Sync**: Seamlessly consumes revalidation Webhooks from the Admin panel to keep data fresh without sacrificing SSR speed.

---

## 2. Admin Panel (`apps/admin`)

The Admin Panel is a secure, data-intensive dashboard focused on inventory control, database interactions, and secure Server Actions.

### Tech Stack Additions
- **Database**: PostgreSQL (via Neon Database Serverless).
- **ORM (Object Relational Mapping)**: Prisma v7 with `@prisma/adapter-pg`.
- **Authentication**: Custom JWT-based auth (`jsonwebtoken`), `bcryptjs` for password hashing, HTTP-only cookies.
- **Validation**: Zod v4 (Strict schema validation for all Server Actions).
- **Image Processing**: 
  - Client-side: `browser-image-compression` and `react-easy-crop`.
  - Server-side/Storage: Cloudinary API integration.
- **Emails**: Nodemailer for transactional emails.

### Full Feature Set
- **Secure Authentication**: 
  - Login system with rate-limiting and account locking after failed attempts.
  - "Forgot Password" flow with secure JWT email tokens.
- **Inventory & Product Management**:
  - Full CRUD (Create, Read, Update, Delete).
  - Granular product attributes: Price, Cost Price, Sale Price, Pricing Units (Per SQM/Piece/Box), Stock levels, Coverage per box.
  - Soft-delete support (Archive / Restore) to prevent breaking historical orders or linked data.
- **Advanced Image Handling**:
  - Drag-and-drop image uploads.
  - Automatic client-side image compression before upload to save bandwidth.
  - Image cropping tools directly in the browser.
  - Direct integration with Cloudinary for fast CDN delivery.
- **Category & Brand Management**:
  - Manage product taxonomies.
  - Safe-delete protection (prevents deleting categories/brands that have active products assigned to them).
- **Quick Actions**: "Instant Stock Update" modals and quick toggle badges in the data tables.
- **Data Table Features**: Search, pagination, and status filters built right into the URLs for easy navigation.
- **Cross-App Communication**: Automatically fires an awaited `x-revalidate-secret` Webhook to the Storefront whenever inventory, pricing, or product data changes, guaranteeing instant data freshness for customers.
