# AI Context For Heartland Soapworks Website

This file is written for AI agents working in this repository. It is not a human-facing README, marketing document, or public site page. Keep it current whenever code, copy, assets, navigation, product data, contact details, or site behavior changes during this chat or any later AI-assisted editing session.

## Primary Purpose

This repository is a static marketing and ordering website for Heartland Soapworks, a small-batch handmade soap brand. The site exists to:

- Present Heartland Soapworks as a simple, approachable handmade soap business.
- Show the current soap collection with product images and pricing.
- Funnel buyers toward contacting the business by email because there is no live cart or checkout flow.
- Provide basic brand pages: home, products, about, and contact.
- Support simple static hosting with plain HTML assets and no build step.

The current business email used throughout the active site is `heartlandsoapworks.shop@gmail.com`.

## Current Architecture

The live site is currently implemented as standalone HTML pages using Tailwind CSS from the CDN:

- `index.html`: Home page with header, hero banner, featured products, and contact CTA.
- `products.html`: Product listing page with the full current soap collection.
- `about.html`: About page with placeholder copy and brand/value sections.
- `contact.html`: Contact/order page with email CTA, ordering instructions, social/store placeholders, location, and shipping time.

All active pages include Tailwind with:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

The active pages do not currently link `styles.css` or `app.js`. Those two files appear to be from an earlier or alternate richer version of the site and should be treated as inactive unless future code explicitly imports them.

There is no package manifest, bundler, framework, server, or test runner in the repository. The pages can be opened directly in a browser, although Tailwind styling requires network access to the Tailwind CDN at runtime.

## Shared Page Pattern

The active HTML pages share this structure:

- `<!doctype html>` and `html lang="en"`.
- Head metadata with responsive viewport and favicons.
- Header with logo image at `assets/heartland_logo.png`.
- Desktop navigation hidden below `md`.
- Mobile menu button using inline SVG and `data-menu-button`.
- Mobile navigation with id `mobile-menu`.
- Main content in either a full-width hero plus constrained content or a `max-w-6xl mx-auto px-6` wrapper.
- Footer with dynamic year in `<span id="y"></span>`.
- Inline JavaScript at the bottom for current year and mobile menu toggling.

When changing navigation, update both desktop and mobile nav on every HTML page. The active page receives `font-medium` in both nav variants.

## Active Behavior

Each active HTML page contains a small inline script:

- Sets `#y` to the current year via `new Date().getFullYear()`.
- Finds `[data-menu-button]` and `#mobile-menu`.
- Toggles the Tailwind `hidden` class on the mobile menu.
- Updates `aria-expanded`.

`products.html` also contains a configurable `OUT_OF_STOCK_PRODUCTS` array near the bottom of the page. Add exact visible product names to that array, such as `'Bay Rum'`, to mark matching product cards out of stock. Product names that start with `//` are only comments and do not activate the out-of-stock state. The script normalizes name casing/spacing, adds an out-of-stock badge beside the price, lightly mutes the card background, and disables the matching Buy button by removing its `href`, setting `aria-disabled="true"`, and changing the button text to `Out of stock`.

There is no cart logic, no form submission logic, no checkout, no product detail routing, and no analytics in the active pages.

## Brand And Content State

Current brand identity:

- Brand name: `Heartland Soapworks`.
- Email: `heartlandsoapworks.shop@gmail.com`.
- Logo asset: `assets/heartland_logo.png`.
- Banner/hero asset: `assets/banner.png`.
- Price shown for every product and featured product: `$10`.

Current active product names and image assets:

- Freshwater Rapids: `assets/soap-freshwater_rapids.jpg`
- Bay Rum: `assets/soap-bay_rum.jpg`
- Beach Bum: `assets/soap-beach_bum.jpg`
- Bourbon Wood: `assets/soap-bourbon_wood.jpg`
- Calacatta: `assets/soap-calacatta.jpg`
- Citrus Sun: `assets/soap-citrus_sun.jpg`
- Summer Melon: `assets/soap-horseshoe_melon.jpg`
- Just Soap: `assets/soap-just_soap.jpg`
- Oat Milk & Honey: `assets/soap_oat_milk_and_honey.jpg`
- Prairie Sage: `assets/soap-sage_and_sunlight.jpg`
- Sea Salt Bloom: `assets/soap-sea_salt_bloom.jpg`
- Timber: `assets/soap-timber.jpg`

Current active product descriptions on `products.html`:

- Freshwater Rapids: "Fresh water, crisp air, and citrus for a clean, waterfall-bright bar."
- Bay Rum: "Warm rum, citrus, jasmine, and hearty spice with a classic aftershave feel."
- Beach Bum: "Sea spray and salt drift into jasmine, mandarin, and warm sand."
- Bourbon Wood: "Rich bourbon, charred oak, and vanilla with cozy whiskey-barrel warmth."
- Calacatta: "Cooling aquatic notes, soothing aloe vera, and clean green florals."
- Citrus Sun: "Sparkling citrus and yuzu with mint, amber, and soft hinoki woods."
- Summer Melon: "Fresh watermelon with the cool sweetness of a summer slice."
- Just Soap: "Unscented and straightforward for a simple everyday clean."
- Oat Milk & Honey: "Warm oatmeal and sweet milk over honey, vanilla bean, musk, and almond."
- Prairie Sage: "Crisp cypress, calming lavender, and sage like a warm mountain breeze."
- Sea Salt Bloom: "Tropical orchid, jasmine, white musk, sea salt, ozone, and soft tonka."
- Timber: "Fresh pine, smoky notes, and citrus zest for a rugged woodsy bar."

These descriptions were written from user-provided fragrance source links. `Just Soap` has no fragrance link and is treated as intentionally unscented/simple unless the user says otherwise.

Featured products on `index.html`:

- Prairie Sage
- Summer Melon
- Timber

Current contact page specifics:

- Location is `Los Angeles, CA`.
- Typical ship time is displayed as `1-3 business days`, although the source currently contains mojibake for the dash.
- Instagram is still placeholder `@yourhandle` with `href="#"`.
- Etsy/store link is still placeholder text with `href="#"`.
- Contact page still includes text suggesting a form could be added later.

## Placeholder And Cleanup Awareness

Several user-facing strings are still placeholders or partially migrated from a template:

- `about.html` title is currently mojibake/template-like: `About ... Your Brand`.
- `contact.html` title is currently mojibake/template-like: `Contact ... Your Brand`.
- `about.html` footer still says `Your Brand`.
- `contact.html` footer still says `Your Brand`.
- `about.html` main copy is placeholder guidance such as "Two or three paragraphs" and "Simple, specific values".
- `contact.html` has placeholder Instagram and Etsy/store links.
- Multiple files show mojibake from encoding problems, including corrupted em dashes, copyright symbols, apostrophes, and quotation marks.

Do not silently assume these placeholders are intentional brand copy. If editing those pages for content polish, replace them with Heartland Soapworks-specific copy and correct HTML entities or ASCII punctuation.

## Styling Direction

The active site visual language is clean, white, minimal, and Tailwind-driven:

- Background: white.
- Text: zinc/neutral tones.
- Layout max width: usually `max-w-6xl`.
- Page padding: usually `px-6`, `py-12`, `py-16`.
- Cards: rounded with zinc borders and subtle hover shadows.
- Buttons: dark zinc primary buttons, white or bordered secondary buttons.
- Product images: square aspect ratio, rounded border container, `object-cover`.

Avoid introducing an unrelated visual system unless explicitly asked. If adding new active UI, prefer matching existing Tailwind utility patterns in the HTML pages.

`styles.css` has a warmer custom "prairie" palette, dark mode, custom layout classes, reveal animation, cards, modal, command palette, and product-detail styles. Since it is currently inactive, changing it will not affect the visible active pages unless links are added.

## Inactive Or Legacy Files

`styles.css`:

- Contains custom CSS variables, warm brand palette, dark mode theme rules, product card styles, contact form styles, command palette styles, reveal animations, and responsive rules.
- Current active HTML pages do not import it.

`app.js`:

- Contains earlier/alternate behavior for theme persistence, sticky topbar, mobile menu, reveal animations, tilt interaction, hero thumbnails, product-page hydration, demo contact form behavior, and Cmd-K navigation.
- References pages and assets that do not match the current active site, such as `shop.html`, `gallery.html`, `ingredients.html`, `markets.html`, `wholesale.html`, and image paths like `assets/soap-oatmilk-honey.jpg`.
- Current active HTML pages do not import it.

When making changes, first decide whether the active Tailwind HTML implementation is still the intended implementation. Do not wire in `styles.css` or `app.js` casually because doing so may introduce stale routes, missing assets, and conflicting design behavior.

## Asset Inventory

Current asset folder:

- `assets/banner.png`
- `assets/favicon.png`
- `assets/heartland_logo.png`
- `assets/soap-bay_rum.jpg`
- `assets/soap-beach_bum.jpg`
- `assets/soap-bourbon_wood.jpg`
- `assets/soap-calacatta.jpg`
- `assets/soap-citrus_sun.jpg`
- `assets/soap-freshwater_rapids.jpg`
- `assets/soap-horseshoe_melon.jpg`
- `assets/soap-just_soap.jpg`
- `assets/soap-sage_and_sunlight.jpg`
- `assets/soap-sea_salt_bloom.jpg`
- `assets/soap-timber.jpg`
- `assets/soap_oat_milk_and_honey.jpg`

There is also a root-level `favicon.png`.

## Constraints For Future AI Changes

Every future AI agent working in this chat should follow these project-specific rules:

- If any code, copy, route, product, asset, price, contact detail, style system, or behavior changes, update this file in the same turn.
- Preserve user edits already present in the worktree unless the user explicitly asks to replace them.
- Keep the site static unless the user asks for a framework, CMS, backend, or checkout integration.
- Update repeated shared markup consistently across all pages, especially header, nav, footer, email, favicon links, and mobile menu behavior.
- If adding a product, update `products.html`, any relevant home featured section, image alt text, and this file's product inventory.
- If changing stock-status behavior, preserve or update the `OUT_OF_STOCK_PRODUCTS` documentation here.
- If changing the business email, update every `mailto:` link and visible email string across all active pages plus this file.
- If changing location, social handles, shipping time, price, or order method, update every visible occurrence and this file.
- If activating `styles.css` or `app.js`, document the migration and remove or reconcile stale references.
- Prefer ASCII punctuation in newly edited files unless there is a specific reason to use non-ASCII characters.
- Watch for mojibake and correct it when editing affected text.

## Likely Next Improvements

Useful future cleanup tasks, if requested:

- Replace `Your Brand` remnants with `Heartland Soapworks`.
- Fix mojibake in page titles, footers, quotes, apostrophes, and dash characters.
- Replace placeholder about-page copy with real brand story and ingredient/process copy.
- Replace placeholder Instagram and Etsy/store links with real URLs or remove them.
- Consider extracting shared header/footer/mobile-menu markup only if the project adopts a build step or template system.
- Decide whether to delete, revive, or ignore inactive `styles.css` and `app.js`.
- Add a simple contact/order form only after deciding on mailto, Netlify Forms, Formspree, or another static form service.
