# BIG4 Tiles & Sanitary - About Page UI/UX Specification

## Overview
The About page should embody the premium, luxurious, and architectural aesthetic of the BIG4 brand. It should seamlessly blend high-end editorial design with smooth GSAP-driven micro-animations to create an immersive storytelling experience.

## Design System & Theme
- **Theme:** Alternating Dark and Light sections to create rhythm and contrast.
- **Typography:** Large, bold, uppercase sans-serif headings (Inter/Outfit) contrasted with clean, readable body text.
- **Animations:** GSAP ScrollTrigger for text reveals, parallax images, and staggered fade-ins.
- **Aesthetic:** Minimalist, high contrast, subtle glassmorphism, and sharp geometric layouts.

---

## Page Structure & Contents

### 1. Hero Section (Dark Theme)
- **Background:** Deep black (`#000000`) or a very dark, moody, high-resolution close-up of a luxury marble tile with subtle lighting.
- **Content:** 
  - Massive, staggered typography reveal: "CRAFTING SPACES. DEFINING LUXURY."
  - Subtitle (fades in after): "Premium tiles, sanitaryware, and bath fittings since 2017."
- **Animation:** Letters/words animate upward from a masked container (`yPercent: 100` to `0`). A subtle parallax effect on the background image as the user scrolls down.

### 2. Our Story / Heritage (Light Theme)
- **Background:** Clean white (`#FFFFFF`) or off-white.
- **Layout:** 50/50 split layout.
  - **Left Side:** A large, elegant image of a premium bathroom or architectural space. 
    - *Animation:* Image slowly scales down from `1.2` to `1.0` as it enters the viewport, masked by a sleek rectangular container.
  - **Right Side:** Typography-driven content.
    - **Heading:** "OUR JOURNEY"
    - **Body text:** "Since 2017, BIG4 Tiles & Sanitary has been helping homeowners, architects, builders, and interior designers create exceptional spaces. We believe that every space has a story, and the materials you choose are the foundation of that narrative."
    - **Highlight:** A large accented year "2017" in the background (very low opacity, overlapping text).
- **Animation:** FadeInStagger for the text elements.

### 3. Core Philosophy (Dark Theme)
- **Background:** Black (`#000000`).
- **Layout:** A grid of 3 or 4 sleek cards.
- **Heading:** "OUR PILARS OF EXCELLENCE" (Centered, large).
- **Cards Content:**
  1. **Uncompromising Quality:** "We source only the finest materials from trusted global and national brands."
  2. **Design Excellence:** "Curated collections that blend timeless elegance with modern architectural trends."
  3. **Customer Centricity:** "Personalized consultations to bring your unique vision to life."
- **Aesthetic:** Cards use subtle dark-mode glassmorphism (e.g., `bg-white/5` with `backdrop-blur` and a `border-white/10`).
- **Animation:** Cards stagger in from the bottom. Hovering over a card triggers a subtle 3D tilt effect or a soft border glow.

### 4. Brand Partnerships (Light Theme)
- **Layout:** Full width marquee or a refined grid.
- **Content:**
  - **Heading:** "PARTNERED WITH THE BEST"
  - **Description:** "We proudly collaborate with industry leaders to bring you unparalleled quality."
  - **Logos:** Simpolo, Kajaria, Jaquar, Hindware, Somany, etc. (Display as grayscale logos that gain color on hover).
- **Animation:** An infinite horizontal scroll (marquee) for the brand logos, similar to the Home page but styled for the light theme.

### 5. The Showroom Experience (Dark or Light Theme)
- **Layout:** Immersive full-width image gallery.
- **Content:** 
  - **Heading:** "EXPERIENCE IT IN PERSON"
  - A dynamic, masonry or horizontal-scroll gallery showcasing photos of the physical BIG4 showroom.
- **Animation:** Horizontal ScrollTrigger. As the user scrolls down, the gallery moves horizontally (pinning the section until the horizontal scroll is complete).

### 6. Call to Action (Dark Theme)
- **Background:** Black (`#000000`).
- **Content:**
  - **Heading:** "READY TO TRANSFORM YOUR SPACE?"
  - **Buttons:** 
    - [ Primary ] "CONTACT US" (Links to `/contact`, solid white button, black text, hover invert).
    - [ Secondary ] "BROWSE CATALOG" (Links to `/products`, outline button, hover fill).
- **Animation:** Standard fade-in.

---

## Technical Considerations
- **Component Reusability:** Utilize the existing `FadeIn`, `FadeInStagger`, and `Navbar` components.
- **Responsive Design:** Ensure the split layouts stack gracefully on mobile (1 column) and expand to 2 columns on `lg` breakpoints.
- **Performance:** Optimize all high-resolution images used in the Hero and Showroom sections using `next/image` with proper sizing and `priority` on the hero image.
