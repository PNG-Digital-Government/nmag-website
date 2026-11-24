# NMAG Website

Website for the **National Museum & Art Gallery (NMAG) of Papua New Guinea**, built with **Next.js** and **AWS Amplify Gen 2**, following the GPHA website blueprint.

The approved clickable demo is kept in [`demo/index.html`](demo/index.html). Open it in any browser to see the agreed design and Admin features.

## What's built so far (stage 1)

- **Design:** Night & Ochre theme (light mode only), Bricolage Grotesque and Source Sans 3 fonts, national emblem and NMAG seal.
- **Site shell:** official banner with English / Tok Pisin switch, masthead with search, sticky menu, announcement bar, footer, help chat (one answer at a time) and back-to-top button.
- **Pages:** Home, About, Exhibitions (with status filter), Collections (search and type filter), Plan a Visit, Learning, News, Contact (opens the visitor's email app) and Search.
- **Homepage:** hero slider (with optional picture per slide), key facts, Director's welcome (with optional portrait), exhibitions, collections, visit info and news, in an order the CMS controls.
- **Site Mode:** Live, Maintenance or Coming Soon ("Closed for Rehanging" screen with countdown).
- **Backend (Amplify):**
  - Staff sign-in with three roles: Administrator, Editor, Contributor (`amplify/auth`)
  - Content models: site settings, hero slides, exhibitions, collection areas, learning cards, news posts (`amplify/data`)
  - Picture storage for uploads (`amplify/storage`)
- **Admin:** `/admin` has staff sign-in with two-step sign-in (see below) and the start of the Admin dashboard (stage 2, below).

## Stage 2: staff sign-in and the Admin dashboard

### Staff sign-in

- **Invite only.** There is no self sign-up: it is switched off in the user pool (`amplify/backend.ts`), not just hidden on the screen.
- **Two-step sign-in (MFA) is required** for every account, with an authenticator app (Google Authenticator, Microsoft Authenticator, Authy). On their first sign-in each person sets a new password, then scans a QR code to link their app. After that, every sign-in asks for the 6-digit code.
- **Passwords:** at least 12 characters with upper and lower case, a number and a symbol. Invitations expire after 3 days.
- **Forgotten password:** reset by email code from the sign-in screen.
- **Idle sign-out:** staff are signed out after 30 minutes without activity.
- Branded sign-in screen in Night & Ochre, with the NMAG seal.

### Adding staff

1. In the AWS console open **Cognito → User pools →** the NMAG pool **→ Users → Create user**.
2. Choose **Send an email invitation**, enter their email, and let Cognito generate the temporary password.
3. Open the user and **Add user to group**: `ADMINISTRATOR`, `EDITOR` or `CONTRIBUTOR`.
4. They receive an email with the temporary password and sign in at `/admin`.

To remove someone, disable or delete their user. If a person loses their phone, an Administrator can delete and re-invite them so they can link a new authenticator app.

### Two-step sign-in on a backend that was already deployed

Cognito only lets a user pool *require* MFA when the pool is first created. If the backend was deployed before this change, the deploy may fail on the MFA setting. In that case change `mode: "REQUIRED"` to `mode: "OPTIONAL"` in `amplify/auth/resource.ts` and deploy again. The Admin still won't open for anyone until they've linked an authenticator app (`app/admin/MfaSetup.tsx` walks them through it), so staff get the same experience. For full enforcement at the Cognito level, the pool can be recreated with `REQUIRED` later (staff would need to be invited again).

### Admin dashboard

Same layout, sections and role access as the demo: a sidebar grouped into Site, Design and System, showing each person only the screens their role allows.

| Screen | Who | Status |
|---|---|---|
| Homepage | Administrator, Editor | Section order and visibility, key facts, Director's welcome text. Hero slides and portrait upload come next. |
| Content | Everyone | Coming next: exhibitions, collections, learning, news and hero slides with picture uploads. |
| Pages & Visit Info | Administrator, Editor | Done: address, phone, email, opening hours, entry fees. |
| Identity & Colors | Administrator | Site title, short name, tagline. Colour presets come next. |
| Header & Menu | Administrator | Done: banner text, menu items with Tok Pisin labels, show/hide and order. |
| Footer | Administrator | Done. |
| Widgets | Administrator, Editor | Done: announcement bar, back-to-top, help chat and its quick-question buttons. |
| Site Mode | Administrator | Done: Live / Maintenance / Coming Soon with the screen texts and launch date (Port Moresby time). |
| Backup | Administrator | Download a backup of all settings and content. Restore comes next. |

Each screen keeps an unsaved copy until **Save changes**; **Discard** puts the saved values back, and the Admin warns before leaving a screen with unsaved changes. Saving refreshes the public site straight away (`app/admin/actions.ts`); otherwise it rebuilds every 5 minutes.

Brand, header, footer and Site Mode are Administrator-only at the API level too (`amplify/data/resource.ts`), so an Editor can't change them by going around the dashboard.

Until staff add content in the CMS, the site shows the sample content from the demo (`lib/seed.ts`). All sample content still needs confirming with NMAG.

## Next stage

Content editing with picture uploads (exhibitions, collections, learning, news, hero slides, Director's portrait), colour presets, and restoring from a backup.

## Running it locally

You need Node.js 20 or newer and an AWS account set up for Amplify.

```bash
npm install
npx ampx sandbox   # creates a personal backend and writes amplify_outputs.json
npm run dev        # in a second terminal; open http://localhost:3000
```

Without `npx ampx sandbox`, `npm run dev` still works and shows the sample content.

## Deploying on AWS Amplify Hosting

1. In the AWS Amplify console, choose **Create new app → GitHub**, and pick this repository and the `main` branch.
2. Amplify reads `amplify.yml`, deploys the backend, then builds the site.
3. After the first deploy, add the first Administrator as described in **Adding staff** above.

After the first successful install, commit the generated `package-lock.json` so builds stay consistent.

**Public API key:** visitors read content through an API key that lasts 365 days. Redeploying the backend before it expires renews it.

## Project layout

```
app/(site)/        public pages and the site shell
app/admin/         staff sign-in, two-step sign-in and the Admin dashboard
app/admin/sections/ one file per Admin screen
lib/roles.ts       staff roles and which Admin screens each can open
components/        header, footer, hero, help chat, cards, filters, Site Mode screen
lib/content.ts     loads content from Amplify, falls back to sample content
lib/seed.ts        sample content from the demo
amplify/           backend: auth, data, storage
demo/index.html    the approved clickable demo
```
