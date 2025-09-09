# Organic Shop - React Application

A modern, responsive organic food e-commerce website built with React, featuring a navigation bar and hero section with carousel functionality.

## Features

- **Responsive Navigation Bar**
  - Logo and brand name
  - Navigation menu (Home, Shop, About, Contact, Blog)  
  - Login link
  - Search icon
  - Shopping cart with item count and total

- **Hero Section Carousel**
  - Auto-rotating slides every 5 seconds
  - Manual navigation with arrows and dots
  - Three promotional slides with different content
  - Responsive design for all screen sizes

## Components

### Navbar Component
- Fixed position navigation
- Hover effects on menu items
- Cart functionality (counter and total display)
- Mobile-responsive design

### Hero Component  
- Full-screen background images
- Animated slide transitions
- Promotional content with call-to-action buttons
- Navigation controls (arrows and dots)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add images to `public/images/` directory:
   - `logo.png` - Company logo
   - `hero-bg-1.jpg` - First hero background
   - `hero-bg-2.jpg` - Second hero background  
   - `hero-bg-3.jpg` - Third hero background

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view in browser

## Project Structure

```
src/
├── components/
│   ├── Navbar.js        # Navigation component
│   ├── Navbar.css       # Navigation styles
│   ├── Hero.js          # Hero carousel component
│   └── Hero.css         # Hero styles
├── App.js               # Main app component
├── App.css              # Global app styles
├── index.js             # App entry point
└── index.css            # Global styles

public/
├── images/              # Image assets
└── index.html           # HTML template
```

## Styling

- Modern, clean design with organic green theme
- CSS transitions and hover effects
- Fully responsive design
- Mobile-first approach

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps

To extend this application, consider adding:
- Product catalog
- Shopping cart functionality  
- User authentication
- Checkout process
- Blog section
- About/Contact pages
# Gems-of-insight
