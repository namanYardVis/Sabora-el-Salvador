# Button and navigation audit — 2026-10-13

## Changes
- Added Home / Inicio to the main navigation and a visible small-screen Home link.
- Made Home, logo, menu, checkout, and privacy page links use consistent direct browser navigation. Homepage section links scroll locally; links from other pages return to the corresponding homepage section.
- Added a WhatsApp order action to the review step, with the complete order prefilled. The customer must send the message in WhatsApp.
- Prevented sold-out items from being added through their detail view.
- Cleared stale Undo actions after adding items or after the removal notice expires.
- Rejected corrupt stored topping selections; guarded storage writes so storage restrictions do not crash the interface.
- Prevented duplicate in-flight submissions and tied retry identifiers to the submitted order contents.

## Completed checks
`node tests/controls-audit.cjs`: 24 component-level checks passed using simulated React hooks, browser APIs, and a mocked failed order service. This is not a browser renderer or an end-to-end test.

Covered in English and Spanish: Home/Menu/Order Now targets; mobile menu open/close; section handlers; language toggle; menu category anchors; add/increase/decrease; cart persistence; mixed topping totals; cart subtotal; delete/Undo; detail open/close; pickup/delivery selection; checkout next/back; phone validation; WhatsApp order content. Additional checks cover corrupt stored data, blocked storage, sold-out detail actions, and failed-submission data retention with duplicate-submit prevention.

Live authenticated HTTP checks returned 200 HTML for /, /menu, /checkout, /confirmation, /privacy, and /admin. This checks page availability, not browser interactions.

TypeScript and the production build are checked before deployment.

## Limits and setup still needed
- Browser clicking, keyboard/focus behavior, visual layout, physical iOS/Android, and external dialer/WhatsApp launching are not verified. The available Sites workflow does not provide its required browser QA integration.
- Automatic order submission requires owner email and email/SMS provider credentials. No real test order or owner notification was sent.
- Admin sign-in requires ADMIN_PASSWORD. Admin order status changes require authenticated live testing after configuration.
- Business hours, notice, delivery details and payment methods remain unconfigured. Pickup/delivery time is arranged by phone rather than using invented time slots.
