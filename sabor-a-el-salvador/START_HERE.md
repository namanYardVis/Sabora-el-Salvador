# Sabor a El Salvador — complete source handoff

This is the exact source snapshot of the deployed website, including the latest Home button and button audit fixes. The original source and image files are unchanged. SOURCE_SNAPSHOT.json records the original commit and file hashes.

## Included
- All pages, components, styles, Spanish/English translations and menu data.
- Original logo image and all three generated food images, stored locally under public/images.
- package.json, pnpm-lock.yaml and pnpm-workspace.yaml with dependency versions and installation configuration.
- Build/runtime scripts, vendored support files and their licenses.
- Database schema and migrations; server-side email/SMS integration and admin page.
- .env.example listing setup variables, OWNER_SETUP.md and BUTTON_AUDIT.md.
- Automated component audit tests.

node_modules is intentionally not included: installed packages and native binaries differ by operating system. The install command below downloads the locked dependencies. Internet access is required. Fonts are loaded from Google Fonts just as in the current site.

## 1. Put it on GitHub

Unzip the download. Copy the CONTENTS of the sabor-a-el-salvador folder into your repository root; package.json should be at the root, not inside another folder. Include configuration files/folders such as .openai, .gitignore and .npmrc. Do not upload the ZIP as your only repository file.

For reliable inclusion of every file, run these commands from your existing cloned repository after copying the contents:

    git add .
    git commit -m "Add Sabor a El Salvador website"
    git push

Never upload real API keys or customer data. This download includes neither. GitHub stores the code; uploading it does not automatically create a running website. This full-stack project is not a plain GitHub Pages site and is not intended to open by double-clicking an index.html file.

## 2. Run the same website on your computer

Install Node.js 24 or newer, then open a terminal in the folder containing package.json:

    node prepare-other-host.mjs
    npx pnpm@11.25.0 install --frozen-lockfile
    npx pnpm@11.25.0 dev --hostname 0.0.0.0

Open the address printed in the terminal (normally http://localhost:5173).

Why the first command? The exact deployed source contains absolute links to the existing Sites preview. This OPTIONAL script makes those links relative, so Home, Menu and Checkout stay on your computer or new host. It does not change the design, text, images, prices or interactions. Run it before testing elsewhere; skip it only if you want the untouched original source. The online Sites copy is unaffected.

## 3. Check it on your phone or tablet

Connect both devices to the same trusted Wi-Fi. Keep the terminal running. Find your computer's local IPv4 address (on Windows, run ipconfig). Open this on the phone:

    http://YOUR-COMPUTER-IP:5173

Example: if your computer's address is 192.168.1.25, open http://192.168.1.25:5173. Use your actual address. If Windows asks about Node network access, allow access on your private/home network. Stop the server with Ctrl+C when finished.

An alternative is to open the GitHub repository in a Codespace, run the three commands above, and open its forwarded development port. Sharing that forwarded URL with another device depends on the Codespace's port visibility and your account permissions. This is a development preview, not production hosting.

## 4. Build and audit

    npx pnpm@11.25.0 build
    node tests/controls-audit.cjs

The audit is 24 component-level tests using mocks; it is not a real-browser test. TypeScript and production build checks passed on the original environment. Dependency installation on your own device and real mobile/browser behavior have not been independently verified.

## What still needs setup

The current website's limitations are preserved. Automatic Send Order is not active until OWNER_EMAIL, email/SMS credentials and sender settings are configured. Admin login needs ADMIN_PASSWORD. Opening WhatsApp prepares the message; the customer still presses Send there.

Hours, minimum notice, delivery details and payment methods need real business information. Times are currently arranged by phone. See OWNER_SETUP.md and .env.example. Do not put secret values in GitHub.

The server uses Cloudflare Workers/D1, not a static-only hosting environment. Deploying the backend elsewhere requires a compatible Worker deployment and database bindings/migrations. Merely uploading the repository to GitHub or selecting a static host will not activate the database, admin or notification services.

## Useful pages

/                  Home
/menu              All menu items
/checkout          Three-step order request
/confirmation      Submitted-order summary
/privacy           Privacy note
/admin             Password-protected owner screen (requires setup)

## Editing

lib/menu.ts         Items, prices, photos, availability and settings
lib/i18n/           Main ES/EN interface copy
app/shop.tsx        Page content and interactions
app/globals.css     Design and responsive layout
public/images/      Images
