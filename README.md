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
- **Admin:** `/admin` has staff sign-in and shows the signed-in role.

Until staff add content in the CMS, the site shows the sample content from the demo (`lib/seed.ts`). All sample content still needs confirming with NMAG.

## Next stage

The Admin dashboard editing screens, matching the demo: Homepage, Content (with picture uploads), Pages & Visit Info, Header & Menu, Footer, Widgets (including the help chat's quick questions), Site Mode and Backup.

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
3. After the first deploy, open **Authentication → User management** (Cognito) to add staff and put each person in the `ADMINISTRATOR`, `EDITOR` or `CONTRIBUTOR` group. Self sign-up is hidden on the sign-in screen; also turn it off in Cognito so only invited staff can join.

After the first successful install, commit the generated `package-lock.json` so builds stay consistent.

**Public API key:** visitors read content through an API key that lasts 365 days. Redeploying the backend before it expires renews it.

## Project layout

```
app/(site)/        public pages and the site shell
app/admin/         staff sign-in (dashboard screens come next)
components/        header, footer, hero, help chat, cards, filters, Site Mode screen
lib/content.ts     loads content from Amplify, falls back to sample content
lib/seed.ts        sample content from the demo
amplify/           backend: auth, data, storage
demo/index.html    the approved clickable demo
```
