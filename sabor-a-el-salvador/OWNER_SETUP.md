# Sabor a El Salvador — owner setup

The private website includes generated illustrative food imagery, the original flyer logo displayed with a CSS crop, a bilingual menu, cart, topping quantities, checkout, WhatsApp fallback, database order storage, and a server-side notifications integration.

## Required business details
Fill in actual hours, minimum notice, delivery area/fee/minimum order, payment methods, and expected confirmation time. These remain visibly marked placeholders. Checkout currently arranges time by phone, since inventing open days would be misleading. Add the configured scheduling UI before enabling online order submission.

## Notifications
Configure OWNER_EMAIL, RESEND_API_KEY, RESEND_FROM (verified sender), TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM and optionally OWNER_PHONE as server secrets. No secrets belong in source. Sending stays blocked until all required notification secrets exist. The WhatsApp action opens a prefilled message that the customer must send. No test notification has been sent to the actual owner.

When enabled, submissions use server-calculated prices and D1 persistence before provider requests. Orders with incomplete notifications remain stored and are clearly flagged. /admin lists recent orders and changes statuses. Set ADMIN_PASSWORD to a strong password of at least 16 characters. Do not expose this password in source or browser storage.

## Editing content
lib/menu.ts contains menu prices, descriptions, photos, availability flags, special flags and unconfigured operational settings. lib/i18n/es.json and en.json contain the primary interface copy. About copy can be personalized in those files. Supplementary bilingual FAQ/section copy is in app/shop.tsx. The admin is for order management; menu editing uses the data file fallback.

## Verification
TypeScript and the production build are checked. Browser/device QA, Lighthouse scores, real iOS/Android testing and live provider delivery have not been verified in this environment. The site is owner-private, not yet publicly available to customers.

## Image assets
public/images/yuca.webp, papas.webp, bananos.webp: generated via the built-in image tool. Brief: realistic editorial food photography on warm wood, text-free, depicting the exact three listed dishes. No additional menu items. Full original flyers are not displayed as menu photos.
