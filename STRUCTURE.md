# DREAMEARL - Project Structure

## Overview

A modern Next.js ecommerce application for luxury pearl accessories.

## Folder Structure

### `/app`

Next.js 14+ App Router pages

- `page.tsx` - Home page (Hero section)
- `shop/page.tsx` - Products listing page
- `about/page.tsx` - About us page
- `cart/page.tsx` - Shopping cart page
- `contact/page.tsx` - Contact form page
- `layout.tsx` - Root layout with metadata
- `globals.css` - Global styles

### `/components`

Reusable React components organized by category

#### `/components/layout`

Layout components used across pages

- `Navbar.tsx` - Main navigation with menu, user, and cart icons
- `Footer.tsx` - Site footer with links and branding

#### `/components/home`

Home page-specific components

- `Hero.tsx` - Hero section with background image and branding

#### `/components/products`

Product-related components

- `ProductCard.tsx` - Reusable product card for shop listings

#### `/components/ui`

Reusable UI elements

- `Button.tsx` - Customizable button component with variants
- `/icons` - SVG icon components
  - `MenuIcon.tsx` - Hamburger menu icon
  - `UserIcon.tsx` - User account icon
  - `CartIcon.tsx` - Shopping cart icon
  - `index.ts` - Icon exports

### `/public`

Static assets

- `background.jpeg` - Hero section background image

## Component Usage

### Using the Navbar

```tsx
import Navbar from "@/components/layout/Navbar";

<Navbar />;
```

### Using the Hero

```tsx
import Hero from "@/components/home/Hero";

<Hero />;
```

### Using Icons

```tsx
import { MenuIcon, UserIcon, CartIcon } from "@/components/ui/icons";

<MenuIcon className="w-6 h-6" />;
```

### Using Button

```tsx
import Button from "@/components/ui/Button";

<Button variant="primary">Click me</Button>
<Button variant="outline" fullWidth>Full width button</Button>
```

## Routes

- `/` - Home page
- `/shop` - Products listing
- `/about` - About page
- `/cart` - Shopping cart
- `/contact` - Contact form

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Fonts**: Geist Sans & Geist Mono
