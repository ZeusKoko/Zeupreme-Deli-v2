# Zeupreme Deli — Where Flavor Meets Passion 🍗🌮🍕

> An artisanal restaurant web experience and digital storefront for **Zeupreme Deli** in Westlands, Nairobi, Kenya. Upgraded from the original static HTML showcase into a high-performance, interactive React application powered by Three.js, Tailwind CSS, and client-side ordering with live kitchen order tracking.

---

## 🌟 Overview & Heritage

Zeupreme Deli began as a passion project celebrating bold culinary comfort food. This version elevates the experience into a modern digital flagship featuring:
* **Storefront Orange Illumination**: Warm ambient lighting inspired by the restaurant's physical storefront (`#FA7D09` / `#FF9F1C`).
* **Subtle 3D Floating Ingredients**: Procedural 3D heirloom tomatoes, butterhead lettuce, Swiss Gruyère cheese wedges, and toasted hearth bread pieces floating gently with smooth scroll parallax.
* **Full Online Ordering**: Instant item customization, a slide-out cart drawer with free perks milestones, and a simulated live kitchen order tracker.

---

## 🚀 Key Features

### 1. Ambient Hero Experience with Supporting 3D Canvas
* **Ambient Culinary Reel**: Looping video stream with fallback to 8K commercial photography.
* **Storefront Lighting**: Warm orange radial scrim and directional lighting inspired by the deli counter.
* **Zero-G Floating Deli Ingredients (`HeroFloatingIngredientsCanvas.tsx`)**:
  * Heirloom tomato slices with translucent seed segments
  * Ruffled butterhead lettuce leaves
  * Swiss Gruyère cheese triangles with characteristic hole voids
  * Toasted artisan caraway rye croutons
  * Crisp dill pickle planks
  * **Smooth Scroll Parallax**: Ingredients float leisurely upward at varying depths as the visitor scrolls through the hero into the menu (`pointer-events-none` ensuring zero click obstruction).
* **Audio Synthesis**: Gentle kitchen skillet sizzle synthesized in real-time via the Web Audio API without any external audio file dependencies.

### 2. Specialties & Limited-Time Offers
* **Our Specialties**:
  * **Crispy Fried Chicken** ($12.99) — Marinated 24 hours in spiced buttermilk and fried to golden crunch perfection.
  * **Zesty Street Tacos** ($10.99) — Authentic street-style with spiced protein, fresh cilantro, salsa fresca, and house lime crema.
  * **Supreme Pizza** ($15.99) — Hand-tossed sourdough crust loaded with premium artisan toppings, bubbling mozzarella, and fresh basil.
* **Current Offers**:
  * **Family Feast Deal** ($29.99, was $42.99) `[HOT]` — 2 Large Pizzas, 8-Piece Chicken, Fries & 4 Drinks.
  * **Taco Tuesday Fiesta** ($9.99, was $14.99) `[TUESDAY SPECIAL]` — 3 Tacos + Drink + Chips.
  * **Express Lunch Combo** ($8.99, was $12.99) `[30% OFF]` — Half Sandwich + Soup/Salad + Drink (11am–2pm).

### 3. Interactive Item Customizer & Cart Drawer
* **Item Customizer Modal (`ItemCustomizerModal.tsx`)**:
  * Select hearth breads (Sourdough, Seeded Caraway Rye, Brioche, Corn Tortillas).
  * Choose heat/toast finish.
  * Add artisanal modifiers (Double Cheese, Extra Crispy Tenders, Fresh Pico, Hot Honey Drizzle).
  * Special kitchen notes field.
* **Slide-Out Cart Drawer (`CartDrawer.tsx`)**:
  * Free House Pickle Jar milestone progress bar ($35 threshold).
  * Itemized quantities, price recalculation, and instant item removal.
  * Fulfillment mode switcher: **Counter Pickup** (15 mins) vs. **Westlands Courier Delivery** (30 mins).
  * Subtotal, NYC/local sales tax, and courier fee breakdown.

### 4. Live Kitchen Order Tracker (`OrderTrackerModal.tsx`)
* Realistic kitchen step progression:
  1. **Order Confirmed** (Ticket printed at 123 Flavor St Westlands counter)
  2. **Kitchen Craft & Fryer** (Chefs preparing 24-hr crispy chicken, street tacos & dough)
  3. **Stone Oven & Basting** (Melting mozzarella, blistering crusts, and boxing hot orders)
  4. **Ready for Pickup / Out for Delivery** (Celebratory confetti trigger with `canvas-confetti`)
* Speed-up controls for rapid demonstration.

### 5. Automatic Device Currency Detection & Switcher (`CurrencyContext.tsx`)
* **Instant Device-Based Detection**:
  * Detects user locale and time zone (e.g. `Africa/Nairobi` automatically maps to **Kenyan Shillings `KES` / `KSh`**).
  * Geolocation IP fallback for country detection (`KE` -> `KES`, Europe -> `EUR`, UK -> `GBP`, US & global -> `USD`).
  * Real-time localized pricing across all items, customized modifiers, cart subtotal, 16% VAT, and kitchen receipts.
* **Header Currency Switcher (`CurrencySwitcher.tsx`)**:
  * Displays current currency with country flag (e.g. `🇰🇪 KES (Auto)`).
  * Seamless manual override selector with persistence in `localStorage`.

### 6. Find Us & Follow Us
* **Location Card**:
  * **Address**: `123 Flavor Street, Westlands, Nairobi, Kenya`
  * **Phone**: `+254 712 345 678`
  * **Hours**: Mon – Sat: 10:00 AM – 10:00 PM | Sun: 11:00 AM – 8:00 PM
  * **Parking**: Free dedicated customer parking lot.
* **Stylized Map**: Interactive vector map highlighting Parklands Road, Ojijo Road, Hyatt Regency, and the central Zeupreme Deli location pin.
* **Signature Orange Newsletter Banner**: Follow Us links for Instagram, Facebook, Twitter, and instant newsletter signup.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-driven UI and responsive state management |
| **TypeScript** | Strict typing for menu items, cart state, and order stages |
| **Vite 8** | Modern, lightning-fast bundler and dev server |
| **Three.js (r160+)** | Procedural 3D graphics, PBR lighting, and scroll parallax |
| **Tailwind CSS v4** | Modern utility-first styling with custom typography tokens |
| **Lucide React** | Clean, accessible iconography |
| **Canvas Confetti** | Celebratory particle effects upon order completion |
| **Web Audio API** | Procedural kitchen sizzle synthesis without external audio files |

---

## 📁 Project Architecture

```
├── index.html                           # Entry HTML with Zeupreme Deli metadata & typography
├── package.json                         # Project scripts and dependencies
├── metadata.json                        # Applet metadata configuration
├── src/
│   ├── main.tsx                         # React 19 root entry
│   ├── index.css                        # Tailwind CSS v4 styling & typography layers
│   ├── App.tsx                          # Core application orchestrator and state store
│   ├── types/
│   │   └── deli.ts                      # TypeScript definitions (MenuItem, CartItem, OrderRecord)
│   ├── data/
│   │   └── deliMenu.ts                  # Menu specialties, current offers, and modifiers
│   ├── components/
│   │   ├── Navbar.tsx                   # 3-Zone Top Bar with Cart badge & quick navigation
│   │   ├── HeroVideo.tsx                # Ambient video hero with storefront orange glow
│   │   ├── HeroFloatingIngredientsCanvas.tsx # Three.js supporting floating 3D ingredients
│   │   ├── MenuSection.tsx              # Specialties, Current Offers, and Full Menu
│   │   ├── ItemCustomizerModal.tsx      # Modal for custom bread, sauces, and instructions
│   │   ├── CartDrawer.tsx               # Slide-out cart with fulfillment toggle & order dispatch
│   │   ├── OrderTrackerModal.tsx        # Live kitchen stage tracker & countdown timer
│   │   ├── DeliStorySection.tsx         # Find Us (Westlands map) & Follow Us orange banner
│   │   └── Footer.tsx                   # Original Zeus creator credits and site copyright
│   └── assets/
│       └── images/                      # Generated 8K commercial food photography
```

---

## 💻 Getting Started

### Prerequisites
* **Node.js**: v18+ or v20+ recommended
* **npm**: v9+

### Installation & Run

```bash
# 1. Install all dependencies
npm install

# 2. Start the local development server (runs on port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Run TypeScript checks
npm run lint
```

---

## 🎨 Design Constitution & Guidelines Followed

1. **Anti-Slop Discipline**: No arbitrary pill badges on cards; metadata uses clean inline typographic dots (`·`).
2. **Zero Dead Clicks**: Every button, tab, and customization control is wired to active state handlers.
3. **Ergonomic 3D**: 3D effects are placed as subtle, supporting background ambiance with `pointer-events-none` rather than distracting foreground gimmicks.
4. **Authentic Storytelling**: Preserves Zeus's original vision, Westlands Nairobi location, and warm orange storefront palette.

---

## 👨‍🍳 Credits

* **Concept & Brand**: Zeupreme Deli — *"Where Flavor Meets Passion"*
* **Location**: 123 Flavor Street, Westlands, Nairobi, Kenya
* **Created by**: Zeus with ❤️ for food lovers
