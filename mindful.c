/* --- style.css --- */
/* ===================================================
   BuyIt — Global Styles
   =================================================== */

/* ---------- Google Fonts (loaded in HTML) ---------- */
/* Inter: 400, 500, 600, 700 */

/* ---------- Design Tokens ---------- */
:root {
  /* Brand Colors */
  --color-primary: #22c55e;
  --color-primary-dark: #047857;
  --color-primary-light: #dcfce7;
  --color-accent: #f26522;
  --color-accent-dark: #d4520e;

  /* Neutrals */
  --color-bg: #f5f7fa;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #1a1a2e;
  --color-text-muted: #64748b;
  --color-text-light: #94a3b8;

  /* Footer */
  --color-footer-bg: #1a1a2e;
  --color-footer-text: #94a3b8;
  --color-footer-heading: #ffffff;

  /* Danger */
  --color-danger: #e53e3e;
  --color-danger-light: #fee2e2;

  /* Typography */
  --font-primary: 'Inter', system-ui, -apple-system, sans-serif;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.06);
  --shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-dropdown: 0 8px 24px rgba(0, 0, 0, 0.25);

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}

/* ---------- Reset ---------- */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

html,
body {
  overflow-x: hidden;
}

body {
  font-family: var(--font-primary);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

button {
  font-family: var(--font-primary);
  cursor: pointer;
  border: none;
  outline: none;
}

button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

button:disabled,
button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Unified Button System */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-family: var(--font-primary);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
  white-space: nowrap;
  outline: none;
}

.btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled,
.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Button Sizes */
.btn-lg {
  padding: 14px 24px;
  font-size: 1rem;
}

.btn-md {
  padding: 11px 20px;
  font-size: 0.95rem;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.85rem;
}

.btn-xs {
  padding: 6px 12px;
  font-size: 0.75rem;
}

/* Button Variants */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn-primary:active {
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.2);
}

.btn-secondary {
  background: var(--color-border);
  color: var(--color-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.btn-secondary:hover {
  background: var(--color-text-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-secondary:active {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.btn-accent {
  background: var(--color-accent);
  color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(242, 101, 34, 0.2);
}

.btn-accent:hover {
  background: var(--color-accent-dark);
  box-shadow: 0 4px 12px rgba(242, 101, 34, 0.3);
}

.btn-accent:active {
  box-shadow: 0 2px 6px rgba(242, 101, 34, 0.2);
}

.btn-danger {
  background: var(--color-danger);
  color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.2);
}

.btn-danger:hover {
  background: #c41e1e;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.btn-danger:active {
  box-shadow: 0 2px 6px rgba(229, 62, 62, 0.2);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
}

.btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(34, 197, 94, 0.05);
}

.btn-ghost:active {
  background: rgba(34, 197, 94, 0.08);
}

input,
textarea {
  font-family: var(--font-primary);
}

/* ---------- Layout Wrapper ---------- */
.design {
  width: 90%;
  max-width: 1400px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.06);
}

/* ===================================================
   HEADER
   =================================================== */
.site-header {
  background-color: var(--color-surface);
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--color-border);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

/* Logo */
.logo {
  color: var(--color-text);
  font-size: 1.6rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: -0.5px;
}

.logo::first-letter {
  color: var(--color-primary);
}

.logo span {
  color: var(--color-accent);
}

/* Hamburger */
.menu-toggle {
  display: none;
  font-size: 0;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: var(--space-sm);
  width: 28px;
  height: 28px;
  position: relative;
  z-index: 201;
}

.menu-toggle .hamburger-line {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform var(--transition-normal), opacity var(--transition-fast);
  position: absolute;
  left: 3px;
}

.menu-toggle .hamburger-line:nth-child(1) { top: 6px; }
.menu-toggle .hamburger-line:nth-child(2) { top: 13px; }
.menu-toggle .hamburger-line:nth-child(3) { top: 20px; }

.menu-toggle.active .hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}
.menu-toggle.active .hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Active nav link */
.main-nav a.active {
  color: var(--color-accent);
  font-weight: 700;
}

/* Nav overlay */
.nav-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  /* z-index: 99; */
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.nav-overlay.visible {
  display: block;
  opacity: 1;
}

/* Main Navigation */
.main-nav {
  background-color: var(--color-surface);
  display: flex;
  justify-content: flex-end;
  flex: 1;
}

.main-nav ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.main-nav li {
  position: relative;
  margin-left: var(--space-sm);
}

.main-nav a {
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.9rem;
  padding: var(--space-sm) var(--space-md);
  display: block;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.main-nav a:hover {
  color: var(--color-accent);
  background-color: rgba(242, 101, 34, 0.06);
}

.caty {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md, 20px);
}

.caty h1{
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: underline;
  color: rgb(80, 235, 80);
}
/* ===================================================
   VISUAL CATEGORIES GRID SYSTEM
   =================================================== */
.categories_section {
  padding: var(--space-2xl) var(--space-xl);
  background: var(--color-bg, #f4f4f6);
  max-width: 1200px;
  margin: 0 auto;
}

.categories_section h1 {
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: var(--space-xl);
  color: var(--color-text, #222);
  letter-spacing: -0.4px;
}

/* Responsive Adaptive Track Layout Columns */
.categories_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-lg, 20px);
  width: 100%;
}

/* Make entire container card clickable with custom vars */
.category_card {
  background-color: var(--color-surface, #ffffff);
  border-radius: var(--radius-md, 16px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none; /* Strip hyperlink underline links styling out */
  border: 1px solid var(--color-border, #e5e7eb);
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
  transition: transform var(--transition-normal, 0.2s ease), 
              box-shadow var(--transition-normal, 0.2s ease);
}

/* Elevated Hover Effects */
.category_card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover, 0 10px 20px rgba(0,0,0,0.06));
}

.category_card:hover .category_image img {
  transform: scale(1.06); /* Dynamic subtle inner image scale */
}

/* Forces structural uniform container aspect bounding boxes */
.category_image {
  width: 100%;
  height: 140px; /* Constrains card uniform image heights */
  overflow: hidden;
  background-color: #ededf0;
}

.category_image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Auto crops dimensions dynamically */
  transition: transform 0.3s ease;
}

/* Core typography labels placement elements definitions */
.category_card h2 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text, #333);
  text-align: center;
  padding: var(--space-md, 15px) var(--space-xs, 5px);
  margin: 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* Aligns text row perfectly if cards row height shifts */
}

/* Extra optimization support scaling triggers for narrow displays */
@media (max-width: 480px) {
  .categories_grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--space-md, 12px);
  }
  .category_image {
    height: 110px;
  }
  .category_card h2 {
    font-size: 0.85rem;
    padding: 10px 4px;
  }
}

/* Header Actions: Search + Cart */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-left: var(--space-md);
}

.srch form {
  display: flex;
  align-items: center;
  background: var(--color-bg);
  border-radius: var(--radius-full);
  padding: 4px 6px;
  border: 1px solid transparent;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.srch form:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
  background: var(--color-surface);
}

.srch .search-icon {
  color: var(--color-text-light);
  font-size: 14px;
  padding: 0 8px;
}

.srch input[type="search"] {
  border: none;
  display: block;
  width: 120px;
  outline: none;
  background: transparent;
  padding: 8px 4px;
  font-size: 0.85rem;
  width: 150px;
  color: var(--color-text);
}

.srch input[type="search"]::placeholder {
  color: var(--color-text-light);
}

.srch button {
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  display:none;
  border-radius: var(--radius-full);
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all var(--transition-normal);
  white-space: nowrap;
  outline: none;
}

.srch button:hover {
  background: var(--color-primary-dark);
}

.srch button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.srch button:active {
  transform: scale(0.98);
}

/* --- Seamless Search UI Enhancements --- */

/* The main section wrapper alignment */

/* Hidden utility state */
.search-results-container.hidden {
  display: none !important;
}

/* Styled container for specific item hits */
#search-results {
  background-color: #f9f9f9;
  border-left: 4px solid rgb(80, 235, 80);
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.results-heading {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

/* Flex rows/Grid for showing specific goods results */
.results-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  min-width: 220px;
  flex-grow: 1;
  transition: transform 0.2s, box-shadow 0.2s;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-color: rgb(80, 235, 80);
}

.item-name {
  font-weight: 500;
}
/* ===========================
   LIVE SEARCH DROPDOWN
=========================== */

.srch form{
  position: relative;
}

#search-suggestions{
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  overflow: hidden;
  display: none;
  z-index: 9999;
  max-height: 400px;
  overflow-y: auto;
}

.search-item{
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  text-decoration: none;
  color: var(--color-text);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  transition: background .2s ease;
}

.search-item:last-child{
  border-bottom: none;
}

.search-item:hover{
  background: rgba(34, 197, 94, 0.08);
}

.search-item img{
  width: 55px;
  height: 55px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.search-item-info{
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.search-item-name{
  font-size: .9rem;
  font-weight: 600;
  color: var(--color-text);
}

.search-item-price{
  font-size: .8rem;
  color: var(--color-primary);
  font-weight: 600;
}

.search-empty{
  padding: 15px;
  text-align: center;
  color: var(--color-text-light);
  font-size: .9rem;
}
/* Miniature subtle category pill badge */
.item-cat-badge {
  font-size: 0.75rem;
  background-color: rgba(80, 235, 80, 0.15);
  color: #226622;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.no-results {
  color: #666;
  font-style: italic;
  padding: 0.5rem 0;
}

/* Cart Icon */
.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--color-text);
  font-size: 1.25rem;
  padding: 6px;
  transition: color var(--transition-fast);
}

.cart-link:hover {
  color: var(--color-accent);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: var(--color-accent);
  color: var(--color-surface);
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.cart-badge.hidden {
  display: none;
}
.wishlist-badge {
    position: absolute;
    top: -8px;
    right: -10px;
    background: #ec4899; /* Smooth attention-grabbing pink-red */
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    border-radius: 50%;
    padding: 2px 6px;
    min-width: 15px;
    text-align: center;
}
.wishlist-badge.hidden { display: none; }

/* ===================================================
   HERO SECTION
   =================================================== */
.hero {
  background-image: url(../images/background\ image.png);
  background-position: center;
  background-size: cover;
  min-height: 55vh;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl) var(--space-xl);
  text-align: center;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.6) 100%);
}

.hero > * {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-weight: 800;
  font-size: 2.2rem;
  line-height: 1.3;
  max-width: 700px;
  margin-bottom: var(--space-md);
  letter-spacing: -0.5px;
}

.hero h1 i {
  color: var(--color-accent);
}

.hero h2 {
  font-weight: 400;
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 600px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.shopping {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-primary);
  color: var(--color-surface);
  padding: 0.75rem 2rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 1rem;
  transition: all var(--transition-normal);
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
  border: none;
  outline: none;
  cursor: pointer;
  text-decoration: none;
}

.shopping:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.shopping:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.shopping:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.hero img {
  height: auto;
  width: 80px;
  max-width: 100%;
}

/* ===================================================
   PRODUCT SECTION (SHOP GRID VIEW)
   =================================================== */
.product_section {
  padding: var(--space-2xl) var(--space-xl);
  background: var(--color-bg);
}

.product_section > h1 {
  font-weight: 700;
  font-size: 1.6rem;
  margin-bottom: var(--space-lg);
  letter-spacing: -0.3px;
}

/* Product Grid */
.product_wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: var(--space-lg);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Product Card */
.product {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.product:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.product img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: var(--color-bg);
}

.product h1 {
  font-size: 0.95rem;
  font-weight: 600;
  padding: var(--space-md) var(--space-md) var(--space-xs);
  line-height: 1.4;
  color: var(--color-text);
}

.product p {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  padding: 0 var(--space-md);
}

.product a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin: var(--space-md);
  padding: 0.6rem var(--space-md);
  background-color: var(--color-primary);
  color: var(--color-surface);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all var(--transition-normal);
  text-align: center;
  border: none;
  outline: none;
  cursor: pointer;
  text-decoration: none;
}

.product a:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.product a:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.product a:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(34, 197, 94, 0.1);
}

/* ===================================================
   SINGLE PRODUCT PAGE COMPACT CONTAINER VIEW (NEW FIX)
   =================================================== */
.product_page {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr; /* Balanced split layout */
  gap: var(--space-xl);
  align-items: center; /* Keeps text fields balanced side-by-side */
  max-width: 1100px;
  margin: var(--space-2xl) auto;
  padding: 0 var(--space-xl);
}

/* Fixed size box constraint to stop vertical image blowout */
.product_gallery {
  width: 100%;
  height: 420px; /* Forces picture framework to maintain uniform desktop height */
  overflow: hidden;
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

/* Crop logic for high-res source files */
#product-image {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  object-position: center;
}

.product_details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Responsive Adaptive Sizing Mixins */
@media (max-width: 768px) {
  .product_page {
    grid-template-columns: 1fr; /* Stacks layout on small displays */
    gap: var(--space-lg);
    margin: var(--space-xl) auto;
  }

  .product_gallery {
    height: 300px; /* Lowers picture container height on handheld viewports */
  }
}

@media (max-width: 480px) {
  .product_gallery {
    height: 230px; /* Snug height optimization for mobile displays */
  }
}
/* ===================================================
   FOOTER
   =================================================== */
footer {
  background-color: var(--color-footer-bg);
  padding: var(--space-2xl) var(--space-xl);
  color: var(--color-footer-text);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-2xl);
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer_brand p {
  font-size: 0.9rem;
  line-height: 1.7;
  margin-top: var(--space-md);
  color: var(--color-footer-text);
  max-width: 300px;
}

.footer_brand .logo {
  color: var(--color-footer-heading);
  font-size: 1.4rem;
}

footer h2 {
  color: var(--color-footer-heading);
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer_categories ul li,
.footer_contact ul li {
  margin-bottom: var(--space-sm);
}

.footer_categories ul li a,
.footer_contact ul li a {
  color: var(--color-footer-text);
  font-size: 0.88rem;
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
}

.footer_categories ul li a:hover,
.footer_contact ul li a:hover {
  color: var(--color-surface);
}

.footer_contact ul li a i {
  width: 18px;
  text-align: center;
  color: var(--color-text-light);
}

footer h3 {
  text-align: center;
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--color-text-light);
  padding-top: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
}

/* ===================================================
   CONTACT PAGE
   =================================================== */
.n {
  padding: var(--space-2xl) var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.n > h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: var(--space-lg);
}

.get {
  display: flex;
  gap: var(--space-xl);
  flex-wrap: wrap;
}

.adress {
  flex: 1;
  min-width: 280px;
}

.adress > p {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: var(--space-md);
}

.get1,
.get2,
.get3 {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
}

.get1 {
  background: var(--color-primary-dark);
  color: var(--color-surface);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.get2 {
  background: #059669;
  color: var(--color-surface);
}

.get3 {
  background: #34d399;
  color: var(--color-text);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.get1 h4,
.get2 p,
.get3 p {
  font-size: 0.9rem;
}

.get1 i,
.get2 i,
.get3 i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.handles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.handles img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
  transition: transform var(--transition-fast);
}

.handles img:hover {
  transform: scale(1.1);
}

/* Message / Contact Form */
.message {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
}

.message form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
}

.message input,
.message textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: border-color var(--transition-fast);
}

.message input:focus,
.message textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.message button {
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color var(--transition-normal);
}

.message button:hover {
  background: var(--color-primary-dark);
}

/* ===================================================
   AUTH FORMS (Login & Register)
   =================================================== */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: var(--space-2xl) var(--space-md);
}

.auth-form {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
}

.auth-title {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--space-xs);
  color: var(--color-text);
}

.auth-subtitle {
  text-align: center;
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 0.85rem;
  color: var(--color-text);
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: border-color var(--transition-fast);
}

.form-group input:focus {
  outline: nonall var(--transition-normal);
  margin-top: var(--space-sm);
  outline: none;
  cursor: pointer;
}

.auth-btn:hover {
  background-color: var(--color-primary-dark);
}

.auth-btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.auth-btn:active {
  transform: scale(0.98);
}

.auth-btn:hover {
  background-color: var(--color-primary-dark);
}

.auth-switch {
  text-align: center;
  margin-top: var(--space-lg);
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.auth-switch a {
  color: var(--color-accent);
  font-weight: 600;
}

.auth-switch a:hover {
  text-decoration: underline;
}

/* ===================================================
   ABOUT PAGE
   =================================================== */
.about-section {
  padding: var(--space-2xl) var(--space-xl);
  max-width: 1000px;
  margin: 0 auto;
}

.about_h1 {
  font-weight: 700;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: var(--space-sm);
}

.about-section hr {
  border: none;
  height: 1px;
  background-color: var(--color-border);
  margin-bottom: var(--space-lg);
}

.about_nav {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-bottom: var(--space-xl);
}

.about_nav a {
  font-size: 0.9rem;
  font-weight: 500;
  padding: var(--space-sm) var(--space-lg);
  color: var(--color-text-muted);
  border-right: 1px solid var(--color-border);
  transition: color var(--transition-fast);
}

.about_nav a:last-child {
  border-right: none;
}

.about_nav a:hover {
  color: var(--color-accent);
}

.about_vision {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg) var(--space-xl);
  margin-bottom: var(--space-md);
  background-color: var(--color-surface);
  transition: box-shadow var(--transition-normal);
}

.about_vision:hover {
  box-shadow: var(--shadow-card);
}

.about_vision h2 {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  color: var(--color-primary);
  padding-top: 2px;
}

.about_vision p {
  line-height: 1.7;
  color: var(--color-text-muted);
  font-size: 0.92rem;
}

/* ===================================================
   CART PAGE
   =================================================== */
.cart-container {
  padding: var(--space-2xl) var(--space-xl);
  max-width: 900px;
  margin: 0 auto;
}

.cart-container > h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.cart-empty {
  text-align: center;
  padding: var(--space-3xl) var(--space-md);
  color: var(--color-text-muted);
}

.cart-empty i {
  font-size: 3.5rem;
  color: var(--color-border);
  margin-bottom: var(--space-md);
  display: block;
}

.cart-empty p {
  font-size: 1.1rem;
  margin-bottom: var(--space-md);
}

.cart-empty a {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-surface);
  padding: 10px 24px;
  border-radius: var(--radius-full);
  font-weight: 600;
  transition: background var(--transition-normal);
}

.cart-empty a:hover {
  background: var(--color-primary-dark);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition-fast);
}

.cart-item:hover {
  box-shadow: var(--shadow-card);
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: var(--color-bg);
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.cart-item-info p {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.95rem;
}

.cart-item-remove {
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: 1rem;
  padding: var(--space-sm);
  border-radius: 50%;
  transition: background var(--transition-fast);
}

.cart-item-remove:hover {
  background: var(--color-danger-light);
}

.cart-summary {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
}

.cart-summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  font-size: 0.95rem;
}

.cart-summary-row.total {
  border-top: 2px solid var(--color-border);
  margin-top: var(--space-sm);
  padding-top: var(--space-md);
  font-weight: 700;
  font-size: 1.1rem;
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 0.85rem 1.25rem;
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  border-radius: var(--radius-full);
  font-size: 1rem;
  font-weight: 700;
  transition: all var(--transition-normal);
  outline: none;
  cursor: pointer;
}

.checkout-btn:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.checkout-btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.checkout-btn:active {
  transform: scale(0.98);
}

/* =========================
   UNIVERSAL PRODUCT PAGE
========================= */

.product-page{
    max-width:1200px;
    margin:40px auto;
    padding:20px;
    display:flex;
    gap:40px;
    align-items:flex-start;
}

.product-image-section{
    flex:1;
}

.product-image-section img{
    width:100%;
    height:500px;
    object-fit:cover;
    border-radius:15px;
    background:#f5f5f5;
    box-shadow:0 4px 20px rgba(0,0,0,.08);
}

.product-info-section{
    flex:1;
}

.product-info-section h1{
    font-size:2rem;
    margin-bottom:15px;
    color:#222;
}

.product-rating{
    color:#f4b400;
    margin-bottom:15px;
}

.product-rating span{
    color:#666;
    font-size:.95rem;
}

.product-info-section h2{
    color:#1ea83a;
    font-size:2rem;
    margin-bottom:20px;
}

.product-info-section p{
    color:#555;
    line-height:1.8;
    margin-bottom:25px;
}

.availability{
    color:#1ea83a;
    font-weight:600;
    margin-bottom:25px;
}

.quantity-area{
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom:30px;
}

.qty-btn{
    width:40px;
    height:40px;
    border:none;
    border-radius:8px;
    background:#1ea83a;
    color:#fff;
    cursor:pointer;
    font-size:18px;
}

.quantity-area input{
    width:70px;
    text-align:center;
    padding:10px;
    border:1px solid #ddd;
    border-radius:8px;
}

.product-actions{
    display:flex;
    gap:15px;
    flex-wrap:wrap;
}

.add-cart-btn{
    background:#1ea83a;
    color:white;
    border:none;
    padding:14px 28px;
    border-radius:8px;
    cursor:pointer;
    font-weight:600;
}

.buy-now-btn{
    background:#111827;
    color:white;
    border:none;
    padding:14px 28px;
    border-radius:8px;
    cursor:pointer;
    font-weight:600;
}

.add-cart-btn:hover,
.buy-now-btn:hover{
    transform:translateY(-2px);
    transition:.3s;
}
/* ===================================================
   RESPONSIVE — Tablet (max-width: 1024px)
   =================================================== */
@media (max-width: 1024px) {
  .design {
    width: 95%;
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
  }

  .footer_brand {
    grid-column: 1 / -1;
  }
}
/* ===================================================
   RESPONSIVE — Tablet (max-width: 1024px)
   =================================================== */
@media (max-width: 1024px) {
  .design {
    width: 95%;
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
  }

  .footer_brand {
    grid-column: 1 / -1;
  }
}
/* ===================================================
   RESPONSIVE — Mobile (max-width: 768px)
   =================================================== */
@media (max-width: 768px) {
  
  /* CRITICAL: Force header block relative containment boundaries open */
  .site-header {
    position: relative !important;
    overflow: visible !important;
    /* z-index: 9999; */
  }

  .container {
    display: flex !important;
    flex-wrap: nowrap;
    padding: 0 var(--space-md);
    align-items: center;
    gap: var(--space-sm);
    overflow: visible !important;
  }

  .logo {
    order: 1;
    flex: 0 0 auto;
    min-width: 0;
  }

  .header-actions {
    order: 2;
    width: auto;
    margin-left: auto;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--space-sm);
    z-index: 10001;
    flex-shrink: 0;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 3;
    margin-left: 0;
    z-index: 10002;
    cursor: pointer;
    flex-shrink: 0;
  }

  /* --- VIEWPORT PANNELLING SIDE MENU (DARK THEME & FIXED HIGHEST Z-INDEX) --- */
  .main-nav {
    position: fixed !important;
    top: 0;
    right: -100%;
    left: auto;
    width: min(280px, 85vw);
    height: 100vh !important;
    background: #fff !important;
    border-left: 1px solid rgba(0, 0, 0, 0.08) !important;
    border-top: none !important;
    display: block !important;
    max-height: none !important;
    opacity: 0;
    overflow-y: auto;
    transition: transform .3s ease-in-out, opacity .3s ease-in-out !important;
    box-shadow: -8px 0 24px rgba(0, 0, 0, 0.12);
  }

  /* Triggered Slide Execution Class */
  .main-nav.open {
    transform: translateX(-100%) !important;
    opacity: 1 !important;
  }

  .main-nav ul {
    flex-direction: column;
    padding: var(--space-2xl) 0 var(--space-sm) 0; /* Clear area for mobile screen tops */
    display: flex;
    margin: 0;
    list-style: none;
  }

  .main-nav li {
    margin: 0;
    width: 100%;
  }

  /* Update menu links text visibility for the dark shaded black panel */
  .main-nav a {
    display: block;
    padding: var(--space-md) var(--space-lg);
    border-radius: 0;
    font-size: 0.95rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    color: var(--color-primary);
    text-decoration: none;
  }

  .main-nav li:last-child > a {
    border-bottom: none;
  }

  /* Hover states for the dark mobile menu component panel */
  .main-nav a:hover,
  .main-nav a:focus {
    background-color: #262626 !important; /* Lighter shade of black highlights background */
    color: var(--color-accent) !important;
  }

  .main-nav a.active {
    color: var(--color-accent) !important;
    background-color: rgba(242, 101, 34, 0.12) !important; /* Keeps custom accent highlight pop */
    font-weight: 700;
  }

  /* --- FIXED MOBILE DROP DOWN SEARCH PANEL --- */
  .srch {
    position: absolute !important;
    top: 100% !important; 
    left: 0 !important;
    width: 100% !important;
    background: var(--color-surface, #ffffff) !important;
    border-bottom: 1px solid var(--color-border, #ddd) !important;
    padding: 12px 20px !important;
    z-index: 10000 !important;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    display: none !important; 
  }

  .srch.active {
    display: block !important;
  }

  .srch form {
    display: flex !important;
    align-items: center !important;
    padding: 0 !important;
    background: var(--color-bg, #f5f5f5) !important;
    border: 1px solid var(--color-border, #ccc) !important;
    border-radius: 4px !important;
    width: 100% !important;
    box-shadow: none !important;
  }

  .srch input[type="search"] {
    display: block !important;
    flex: 1 !important;
    border: none !important;
    background: transparent !important;
    padding: 8px var(--space-xs) !important;
    color: var(--color-text);
    outline: none !important;
    font-size: 1rem !important;
    width: 100% !important;
  }

  .srch button {
    display: block !important;
    background: var(--color-accent, #f26522) !important;
    color: #fff !important;
    border: none !important;
    padding: 8px 16px !important;
    margin: 4px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
  }

  .has-dropdown .dropdown {
    position: static;
    border-radius: 0;
    margin-top: 0;
    box-shadow: none;
    background: var(--color-bg);
    padding: 0;
    max-height: none;
  }

  .has-dropdown .dropdown li a {
    padding: 10px 20px 10px 36px;
    color: var(--color-text-muted);
    font-size: 0.88rem;
    border-bottom: 1px solid var(--color-border);
  }

  .has-dropdown .dropdown li:last-child a {
    border-bottom: none;
  }

  .has-dropdown .dropdown li a:hover {
    background-color: var(--color-surface);
    color: var(--color-accent);
  }

  /* Structural Content Formats */
  .hero { min-height: auto; padding: var(--space-2xl) var(--space-md); }
  .hero h1 { font-size: 1.5rem; }
  .hero h2 { font-size: 0.92rem; }
  .product_section { padding: var(--space-xl) var(--space-md); }
  .product_section > h1 { font-size: 1.3rem; }
  .n { padding: var(--space-xl) var(--space-md); }
  .get { flex-direction: column; }
  .adress, .message { min-width: unset; }
  .about-section { padding: var(--space-xl) var(--space-md); }
  .about_h1 { font-size: 1.4rem; }
  .about_nav { flex-wrap: wrap; gap: var(--space-xs); }
  .about_nav a { border-right: none; padding: var(--space-sm) var(--space-md); }
  .about_vision { flex-direction: column; padding: var(--space-md); }
  .footer-content { grid-template-columns: 1fr; gap: var(--space-xl); }
  footer { padding: var(--space-xl) var(--space-md); }
  
  .product-page { flex-direction: column; }
  .product-image-section img { height: 350px; }
  .product-actions { flex-direction: column; }
  .add-cart-btn, .buy-now-btn { width: 100%; }

  /* --- POINTER INTERACTION BACKDROP LAYER FIX --- */
  .nav-overlay {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5) !important;
    /* z-index: 99998 !important; */
    display: none;
    
    /* Ignore click gestures entirely when closed to safeguard lower links */
    pointer-events: none; 
  }

  .nav-overlay.visible {
    display: block !important;
    /* Re-arm interactions while overlay is visible so clicking background closes menu */
    pointer-events: auto !important; 
  }
}
/* ===================================================
   RESPONSIVE — Small Mobile (max-width: 480px)
   =================================================== */
@media (max-width: 480px) {
  .site-header {
    padding: 10px 0;
  }

  .logo {
    font-size: 1.35rem;
  }

  .main-nav {
    width: 100%;
    right: -100%;
  }

  .main-nav.open {
    transform: translateX(-100%) !important;
  }

  .main-nav a {
    padding: var(--space-sm) var(--space-md);
    font-size: 0.9rem;
  }

  .has-dropdown .dropdown li a {
    padding: 8px 16px 8px 28px;
    font-size: 0.82rem;
  }

  .design {
    width: 100%;
    border-radius: 0;
  }

  .hero h1 {
    font-size: 1.3rem;
  }

  .hero h2 {
    font-size: 0.85rem;
  }

  .product_wrapper {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-md);
  }

  .product img {
    height: 150px;
  }

  .product h1 {
    font-size: 0.85rem;
  }

  .product p {
    font-size: 0.9rem;
  }

  .product a {
    font-size: 0.8rem;
    padding: var(--space-sm) var(--space-md);
  }
}

@media (max-width: 1200px) {
  .container {
    padding: 0 20px;
  }

  .hero {
    padding: 60px 20px;
  }

  .categories_section,
  .product_section,
  .about-section,
  .n,
  .get {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 992px) {
  .container {
    padding: 0 16px;
  }

  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 24px;
  }

  .hero-content,
  .hero-visual {
    max-width: 100%;
  }

  .hero .btn,
  .hero .btn-ghost {
    width: 100%;
    max-width: 260px;
  }

  .categories_grid,
  .product-grid,
  .product_wrapper {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .site-header {
    padding: 12px 0;
  }

  .header-actions {
    gap: 10px;
  }

  .search-trigger {
    display: block;
  }

  .categories_grid,
  .product-grid,
  .product_wrapper {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 1.4rem;
  }

  .hero h2 {
    font-size: 0.95rem;
  }

  .product_section > h1,
  .categories_section h1,
  .about_h1 {
    font-size: 1.3rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 12px;
  }

  .logo {
    font-size: 1.3rem;
  }

  .header-actions {
    gap: 8px;
  }

  .cart-link,
  .wishlist-link {
    font-size: 1rem;
  }

  .hero {
    padding: 40px 12px;
  }

  .hero .btn,
  .hero .btn-ghost {
    max-width: none;
  }

  .product-card img {
    height: 180px;
  }

  .category_card h2 {
    font-size: 0.9rem;
  }

  .about-section,
  .product_section,
  .categories_section {
    padding: 24px 12px;
  }
}

/* --- main.js --- */
let cart = JSON.parse(localStorage.getItem("BUYIT_CART")) || [];
let activeDiscount = 0;

document.addEventListener("DOMContentLoaded", async () => {
    // 1. FETCH & INJECT GLOBAL LAYOUT COMPONENTS FIRST
    try {
        await includeComponent("global-header", "./components/header.html");
        await includeComponent("global-footer", "./components/footer.html");
    } catch (err) {
        console.warn("Layout components loading optimization note:", err);
    }

    // 2. INITIALIZE MENUS, SEARCH, CART, ETC.
    initResponsiveComponents();

    if (typeof initCartEngine === "function") {
        initCartEngine();
    }

    // 3. SYNC LOGIN / ADMIN UI AFTER HEADER EXISTS
    if (typeof window.syncHeaderAuthUI === "function") {
        window.syncHeaderAuthUI();
    }

    // 4. DEBUG USER SESSION
    console.log(
        "Current User:",
        JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"))
    );

    // 5. NOTIFY OTHER MODULES THAT LAYOUT IS READY
    document.dispatchEvent(
        new Event("LayoutComponentsLoaded")
    );
});

// 🔄 USE SYNCED LIVE STOCK COUNTERS INSTEAD OF NATIVE FILE REFS
let storedBaseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];

const renderCategoryView = (baseArray) => {
    // Sync local custom additions layer
    const customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
    const completeCatalog = [...baseArray, ...customProducts];

    // Example targeting the "fresh" category page filter:
    // Change "fresh" to match the category string for each specific page file layout
    const pageCategoryTarget = "fresh"; 
    
    const displayItems = completeCatalog.filter(p => p.category === pageCategoryTarget);

    // Call your normal page grid loop generation function here...
    // renderGridCards(displayItems);
};

if (storedBaseProducts.length === 0) {
    fetch("./data/products.json")
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(data));
            renderCategoryView(data);
        });
} else {
    renderCategoryView(storedBaseProducts);
}
// Add this globally so ANY page can access it instantly
window.getLiveInventory = async function() {
    try {
        let storedBase = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
        
        // If local storage is blank, pull from the master file once
        if (storedBase.length === 0) {
            const response = await fetch("./data/products.json");
            storedBase = await response.json();
            localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(storedBase));
        }
        
        const customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
        
        // Return the true, synchronized inventory array
        return [...storedBase, ...customProducts];
    } catch (error) {
        console.error("Inventory pipeline failure:", error);
        return JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
    }
};

// Clean Modular Component Injection Engine
async function includeComponent(targetId, filePath) {
    const element = document.getElementById(targetId);
    if (!element) return;
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            element.innerHTML = await response.text();
        } else {
            console.error(`Failed to fetch component file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error loading HTML layout snippet:`, error);
    }
}

// Group Interface Interactions Securely 
function initResponsiveComponents() {
    
    // ================= ELEMENTS LOOKUP =================
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const navOverlay = document.getElementById("nav-overlay");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search");
    const searchPanel = document.querySelector(".srch");
    const searchTrigger = document.getElementById("mobile-search-trigger");

    // ================= AUTOMATED ACTIVE PAGE LINK HIGHLIGHTS =================
    const currentUrl = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".main-nav a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        
        // 🛑 CRITICAL SAFE GUARD: Skip JavaScript button bindings, null tags, and dummy references
        if (!href || href === "#") return;

        if (href === currentUrl) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // ================= MOBILE NAVIGATION DRAWER TOGGLES =================
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            mainNav.classList.toggle("open");

            if (navOverlay) {
                navOverlay.classList.toggle("visible");
            }
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener("click", () => {
            menuToggle?.classList.remove("active");
            mainNav?.classList.remove("open");
            navOverlay.classList.remove("visible");

            document
                .getElementById("cart-drawer")
                ?.classList.remove("open");
        });
    }

    // ================= RESPONSIVE SEARCH AND SUGGESTIONS (UPDATED) =================
    if (searchForm && searchInput) {
        let products = [];

        (async () => {
            try {
                // Check if our live tracking system already possesses the base catalog
                let storedBaseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
                
                if (storedBaseProducts.length === 0) {
                    const response = await fetch("./data/products.json");
                    storedBaseProducts = await response.json();
                    localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(storedBaseProducts));
                }
                
                // Read custom added items 
                const customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
                
                // Unify into a single search database that respects admin removals!
                products = [...storedBaseProducts, ...customProducts];
            } catch (error) {
                console.error("Failed to load products database:", error);
            }
        })();

        // Handle opening and focusing the mobile search container bar dropdown
        if (searchTrigger && searchPanel) {
            searchTrigger.addEventListener("click", (e) => {
                e.stopPropagation();
                searchPanel.classList.toggle("active");
                
                if (searchPanel.classList.contains("active")) {
                    searchInput.focus();
                }
            });
        }

        const searchBox = document.createElement("div");
        searchBox.id = "search-suggestions";
        searchInput.parentElement.style.position = "relative";
        searchInput.parentElement.appendChild(searchBox);

        function showSuggestions(query) {
            if (!query) {
                searchBox.innerHTML = "";
                searchBox.style.display = "none";
                return;
            }

            const matches = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );

            if (matches.length === 0) {
                searchBox.innerHTML = `
                    <div class="search-empty">
                        No products found
                    </div>
                `;
                searchBox.style.display = "block";
                return;
            }

            searchBox.innerHTML = matches
                .slice(0, 8)
                .map(product => {
                    const parsedPrice = typeof product.price === "number" ? "₦" + product.price.toLocaleString() : product.price;
                    return `
                        <a class="search-item" href="product.html?id=${product.id}">
                            <img src="${product.image}">
                            <div>
                                <strong>${product.name}</strong>
                                <span>${parsedPrice}</span>
                            </div>
                        </a>
                    `;
                }).join("");

            searchBox.style.display = "block";
        }

        searchInput.addEventListener("input", () => {
            showSuggestions(searchInput.value.trim());
        });

        document.addEventListener("click", e => {
            if (
                !searchInput.contains(e.target) &&
                !searchBox.contains(e.target) &&
                (!searchTrigger || !searchTrigger.contains(e.target))
            ) {
                searchBox.style.display = "none";
            }
        });
    }

    // ===================================================
    // SECRET ADMIN EASTER EGG INJECTOR (UPDATED)
    // ===================================================
    const logoElement = document.querySelector(".logo");
    if (logoElement) {
        logoElement.style.cursor = "pointer"; 
        
        logoElement.addEventListener("dblclick", () => {
            const activeUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER")) || 
                               JSON.parse(localStorage.getItem("BUYIT_ADMIN"));
            
            // Dynamic Role check replaces single-string dependency mapping
            if (activeUser && activeUser.role === "admin") {
                alert(`Admin signature recognized (${activeUser.name}). Opening control deck...`);
                window.location.href = "admin.html";
            } else {
                console.log("BuyIt brand signature verified.");
            }
        });
    }
}

// ===================================================
// CORE SHOPPING CART LOGIC ENGINE
// ===================================================
function initCartEngine() {
    const cartLink = document.querySelector(".cart-link");
    const cartDrawer = document.getElementById("cart-drawer");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const navOverlay = document.getElementById("nav-overlay");
    const applyPromoBtn = document.getElementById("apply-promo-btn");
    const promoInput = document.getElementById("promo-code-input");
    const promoMessage = document.getElementById("promo-message");

    // Toggle Side Cart Panel Drawer
    if (cartLink && cartDrawer) {
        cartLink.addEventListener("click", (e) => {
            e.preventDefault(); 
            cartDrawer.classList.toggle("open");
            if (navOverlay) navOverlay.classList.toggle("visible");
        });
    }

    if (closeCartBtn && cartDrawer) {
        closeCartBtn.addEventListener("click", () => {
            cartDrawer.classList.remove("open");
            if (navOverlay) navOverlay.classList.remove("visible");
        });
    }

    // Handle Sliding Drawer Coupon Validation
    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener("click", () => {
            const code = promoInput.value.trim().toUpperCase();
            if (code === "SAVE10") {
                activeDiscount = 0.10;
                promoMessage.textContent = "Promo Applied! 10% Off.";
                promoMessage.className = "promo-msg success";
            } else if (code === "SUPERBUY") {
                activeDiscount = 0.20;
                promoMessage.textContent = "Mega Code Active! 20% Off.";
                promoMessage.className = "promo-msg success";
            } else {
                activeDiscount = 0;
                promoMessage.textContent = "Invalid Code.";
                promoMessage.className = "promo-msg error";
            }
            updateCartDOM();
        });
    }

    updateCartDOM();
}

window.addToCart = function(id, name, price, image) {
    const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ""));
    
    if (isNaN(numericPrice)) {
        console.error(`Invalid formatting item price match data parsing failed for: ${name}`);
        return;
    }

    // Keep item queries safe across alternate database layer mutations
    const existingProduct = cart.find(item => item.id.toString() === id.toString());

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, price: numericPrice, image, quantity: 1 });
    }
    
    saveAndSyncCart();
    
    document.getElementById("cart-drawer")?.classList.add("open");
    document.getElementById("nav-overlay")?.classList.add("visible");
};

window.changeQuantity = function(id, delta) {
    const product = cart.find(item => item.id.toString() === id.toString());
    if (!product) return;
    
    product.quantity += delta;
    if (product.quantity <= 0) {
        cart = cart.filter(item => item.id.toString() !== id.toString());
    }
    saveAndSyncCart();
};

window.removeProductFromCart = function(id) {
    cart = cart.filter(item => item.id.toString() !== id.toString());
    saveAndSyncCart();
};

function saveAndSyncCart() {
    localStorage.setItem("BUYIT_CART", JSON.stringify(cart));
    updateCartDOM();
}

window.updateCartDOM = function() {
    const itemsContainer = document.getElementById("cart-drawer-items");
    const cartBadge = document.getElementById("cart-badge");
    const cartCountTitle = document.getElementById("cart-count-title");
    const subtotalLabel = document.getElementById("cart-subtotal");
    const discountRow = document.getElementById("discount-row");
    const discountLabel = document.getElementById("cart-discount");
    const totalLabel = document.getElementById("cart-total");

    const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItemsCount;
        totalItemsCount > 0 ? cartBadge.classList.remove("hidden") : cartBadge.classList.add("hidden");
    }
    if (cartCountTitle) cartCountTitle.textContent = totalItemsCount;

    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `<p style="text-align:center; padding: 40px 0; color:#888;">Your cart feels light. Start adding items!</p>`;
        if (subtotalLabel) subtotalLabel.textContent = "₦0";
        if (discountRow) discountRow.style.display = "none";
        if (totalLabel) totalLabel.textContent = "₦0";
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item-card">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">₦${(item.price * item.quantity).toLocaleString()}</span>
                <div class="quantity-controls">
                    <button onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.id}', 1)">+</button>
                    <span style="margin-left: auto;"></span>
                    <button class="remove-item-btn" onclick="removeProductFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        </div>
    `).join("");

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = subtotal * activeDiscount;
    const finalTotal = subtotal - discountAmount;

    if (subtotalLabel) subtotalLabel.textContent = `₦${subtotal.toLocaleString()}`;
    
    if (activeDiscount > 0 && discountRow && discountLabel) {
        discountRow.style.display = "flex";
        discountLabel.textContent = `-₦${discountAmount.toLocaleString()}`;
    } else if (discountRow) {
        discountRow.style.display = "none";
    }

    if (totalLabel) totalLabel.textContent = `₦${finalTotal.toLocaleString()}`;
};

// ===================================================
// USER AUTHENTICATION STATE SYNC (UPDATED)
// ===================================================
window.syncHeaderAuthUI = function() {
    const authContainer = document.getElementById("auth-link-container");
    const adminContainer = document.getElementById("admin-link-container");
    if (!authContainer) return;

    const currentUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
    const activeAdmin = JSON.parse(localStorage.getItem("BUYIT_ADMIN"));
    const loggedInUser = currentUser || activeAdmin;
    
    // Check if user role matches administration permission sets dynamically
    const isAdmin = Boolean(loggedInUser && loggedInUser.role === "admin");

    if (adminContainer) {
        if (isAdmin) {
            adminContainer.style.display = "block";
            adminContainer.innerHTML = `
                <a href="admin.html">
                    <i class="fa-solid fa-unlock-keyhole"></i> Admin Panel
                </a>
            `;
        } else {
            adminContainer.style.display = "none";
            adminContainer.innerHTML = "";
        }
    }

    if (loggedInUser) {
        authContainer.innerHTML = `
            <a href="#" id="logout-trigger" style="color: var(--color-primary);">
                <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </a>
        `;

        document.getElementById("logout-trigger")?.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("BUYIT_CURRENT_USER");
            localStorage.removeItem("BUYIT_ADMIN");
            alert("Logged out successfully.");
            window.location.href = "login.html";
        });
    } else {
        authContainer.innerHTML = `
            <a href="login.html">
                <i class="fa-solid fa-user"></i> Log In
            </a>
        `;
    }
};

// ===================================================
// GLOBAL WISHLIST ENGINE MODULE
// ===================================================
let wishlist = JSON.parse(localStorage.getItem("BUYIT_WISHLIST")) || [];

window.toggleWishlist = function(productId, event) {
    if (event) event.preventDefault(); 
    
    const index = wishlist.indexOf(productId.toString());
    if (index > -1) {
        wishlist.splice(index, 1); 
    } else {
        wishlist.push(productId.toString()); 
    }
    
    localStorage.setItem("BUYIT_WISHLIST", JSON.stringify(wishlist));
    window.updateWishlistUI();
};

window.updateWishlistUI = function() {
    const badge = document.getElementById("wishlist-badge");
    const headerIcon = document.getElementById("wishlist-icon-header");
    
    if (badge) {
        badge.textContent = wishlist.length;
        wishlist.length > 0 ? badge.classList.remove("hidden") : badge.classList.add("hidden");
    }
    
    if (headerIcon) {
        if (wishlist.length > 0) {
            headerIcon.className = "fa-solid fa-heart";
            headerIcon.style.color = "#ec4899";
        } else {
            headerIcon.className = "fa-regular fa-heart";
            headerIcon.style.color = "inherit";
        }
    }
    
    const productHeart = document.getElementById("product-page-heart");
    if (productHeart && window.productId) {
        if (wishlist.includes(window.productId.toString())) {
            productHeart.className = "fa-solid fa-heart";
            productHeart.style.color = "#ec4899";
        } else {
            productHeart.className = "fa-regular fa-heart";
            productHeart.style.color = "inherit";
        }
    }
};