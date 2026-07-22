# Products Page Details

## Overview
This document details the UI and functionality for the website's Products page (`/products`) and the Product Details page (`/products/[slug]`) for the Big4 Tiles & Sanitary web application.

## 1. Products Listing Page (`/products`)

### UI Details
- **Theme:** Uses a light theme (`light-theme bg-background text-foreground`).
- **Layout:**
  - **Navbar:** Sticky or fixed light-themed Navbar at the top.
  - **Breadcrumbs:** Navigation path displayed at the top (e.g., `Home > Products`).
  - **Header:** Features an uppercase title "Our Products" alongside a dynamic product count (e.g., "Showing 1–12 of X products").
  - **Search & Sort:** A combined row featuring a search bar (sticky on mobile) and a sort dropdown (visible on desktop).
  - **Filter Chips:** Displays active filters as removable chips just below the header.
  - **Main Content Area:** A two-column layout on desktop:
    - **Sidebar (Left):** Product Filters (Categories and Brands).
    - **Product Grid (Right):** Responsive grid displaying product cards, followed by pagination controls.
  - **Mobile Layout:** Incorporates a `MobileProductControls` component to handle filtering and sorting in a mobile-friendly view.
  - **Footer:** Standard SiteFooter.
- **Animations:** Uses a `FadeIn` component to smoothly reveal the page header and breadcrumbs.

### Functionality & Features
- **Server-Side Rendering:** The page fetches categories and products in parallel from the backend (`getCategories`, `getProducts`) on the server.
- **URL Search Parameters:** Extracts filtering and sorting options directly from the URL (`page`, `limit`, `search`, `category`, `brand`, `sort`, `inStock`), making URLs shareable.
- **Filters:**
  - **Search:** Text-based search input (`ProductSearch`).
  - **Category Filter:** Filter products by category slug.
  - **Brand Filter:** Filter products by brand name (dynamically extracted from available products).
  - **Stock Filter:** Option to view only "inStock" items.
- **Sorting:** Provides a sorting dropdown (`SortSelect`), defaulting to "newest".
- **Pagination:** Handles pagination via the `ProductPagination` component (defaulting to 12 items per page).
- **Error Handling:** Displays a clear error message ("Error loading products") if the API is down or returns an error.

---

## 2. Product Details Page (`/products/[slug]`)

### UI Details
- **Layout:**
  - **Breadcrumbs:** Complete path including the product's category (e.g., `Home > Products > Category Name > Product Name`).
  - **Two-Column Grid (Desktop):**
    - **Left Column (`ProductGallery`):** Displays a responsive gallery of product images.
      - Includes a horizontal scrollable view (`snap-x snap-mandatory`) for multiple images.
      - Dot indicators at the bottom to navigate between images.
      - Fallback "No Image Available" state if no images exist.
    - **Right Column:** Product information structure:
      - Small uppercase label for Category & Brand.
      - Large heading for Product Title.
      - Price displayed with a dynamic `StockBadge` (In Stock [Green], Low Stock [Yellow], Out of Stock [Red]).
      - SKU displayed in small gray text.
      - Main Description (supports multi-line whitespace).
  - **Actions:** "Enquire Now" and "Back to Products" buttons.
  - **Specifications Accordion (`ProductSpecsAccordion`):** A collapsible section displaying a table (Category, Brand, and SKU).
    - Features smooth open/close animations using CSS Grid transition (`grid-rows-[1fr]` to `grid-rows-[0fr]`).
    - Alternating row backgrounds for better readability.
  - **Related Products (`RelatedProducts`):** A section below the main product details showing items from the same category.
    - Desktop: Uses the standard `ProductGrid`.
    - Mobile: Implements a horizontal scrollable, snapping list to save vertical space.
  - **Mobile Sticky CTA:** On mobile, a fixed bar appears at the bottom displaying the price and a full-width "Enquire Now" button for quick action.
- **Animations:** Elements fade in sequentially (Image first, then info) using the `FadeIn` component with delays.

### Functionality & Features
- **Dynamic Routing:** Page is generated based on the product `slug` parameter.
- **Metadata & SEO:** 
  - Dynamically generates `<title>` and `<meta description>` based on the product data.
  - Injects **JSON-LD Structured Data** for rich search engine results (Schema.org Product type).
- **Data Fetching:** 
  - Uses `getProductBySlug(slug)` to fetch product data on the server. Returns a `notFound()` 404 page if the product doesn't exist.
  - Related products are fetched dynamically based on the current product's `categorySlug` (excluding the current product from the results).
- **Formatting:** Uses `formatPrice` utility for consistent currency formatting.
- **Stock Indication Logic:** 
  - `stock === 0`: "Out of Stock" (Red)
  - `stock <= 5`: "Low Stock" (Yellow)
  - `stock > 5`: "In Stock" (Green)
