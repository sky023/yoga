# Sanity Page Builder

The most complete open-source page builder template for **Sanity + Next.js**.

26 content blocks, 16 custom studio inputs, drag-and-drop grid layout, full visual editing.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fogi988%2Fsanity-page-builder&env=NEXT_PUBLIC_SANITY_PROJECT_ID,NEXT_PUBLIC_SANITY_DATASET,SANITY_API_READ_TOKEN&envDescription=Sanity%20project%20credentials&envLink=https%3A%2F%2Fgithub.com%2Fogi988%2Fsanity-page-builder%2Fblob%2Fmain%2Ffrontend%2F.env.example&root-directory=frontend)

![Sanity Page Builder](sanity-page-builder.png)

### Custom Studio Inputs

Visual layout picker, spacing controls, color pickers, and live previews — all built as custom Sanity inputs.

![Studio Layout Picker](docs/studio-layout-picker.png)
![Studio Block Styles](docs/studio-block-styles.png)

## Structure

```
├── studio/       Sanity Studio (standalone, port 3333)
├── frontend/     Next.js app (port 3000)
└── package.json  root workspace orchestrator
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp studio/.env.example studio/.env
cp frontend/.env.example frontend/.env
```

Fill in your Sanity project ID and dataset in both `.env` files.

### 3. Seed demo data (optional)

```bash
npm run seed
```

### 4. Start development

```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Studio:** [http://localhost:3333](http://localhost:3333)

## Content Blocks

Hero Section, Grid Row, Call to Action, Rich Text, Image, Image Gallery, FAQ, Form, Feature Card Grid, Testimonial Carousel, Testimonial Quote, Accordion, Tabbed Content, Button Group, Icon Text, Stat Metric, Pricing Card, Alert Notice, Code Block, Data Table, Social Embed, Logo Row, Map Embed, Countdown Timer, Lottie Animation, Spacer/Divider, Table of Contents.

## Type Safety

GROQ query results are fully typed via [Sanity TypeGen](https://www.sanity.io/docs/sanity-typegen). Regenerate after schema changes:

```bash
npm run typegen
```

Types are generated to `frontend/src/sanity/types.ts` with aliases in `frontend/src/types/sanity.ts`.

## Deployment

### Studio

```bash
npm run deploy:studio
```

### Frontend

Deploy the `frontend/` directory to Vercel, Netlify, or any Node.js host.

Set the **Root Directory** to `frontend` in your hosting provider.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fogi988%2Fsanity-page-builder&env=NEXT_PUBLIC_SANITY_PROJECT_ID,NEXT_PUBLIC_SANITY_DATASET,SANITY_API_READ_TOKEN&envDescription=Sanity%20project%20credentials&envLink=https%3A%2F%2Fgithub.com%2Fogi988%2Fsanity-page-builder%2Fblob%2Fmain%2Ffrontend%2F.env.example&root-directory=frontend)

### Validate Template

```bash
npm run validate
```

Ensures the Sanity CLI can properly read your template configuration.

## Content Revalidation

Pages use ISR with a 24-hour revalidation window. For instant updates when editors publish in Sanity, set up the on-demand webhook:

1. Generate a secret: `openssl rand -hex 32`
2. Add `SANITY_REVALIDATE_SECRET` to your hosting env vars with the generated secret
3. In [Sanity Manage](https://sanity.io/manage) → API → Webhooks, create a webhook:
   - **URL:** `https://your-domain.com/api/revalidate`
   - **Secret:** same secret from step 1
   - **Filter:** `_type in ["homePage", "page", "blogPost", "siteSettings"]`
   - **Projection:** `{_type, slug}`

Published changes will reflect on the site within seconds.

## More Info

- [Create your own Sanity template](https://www.sanity.io/docs/create-your-own-sanity-template)
- [Template validator](https://github.com/sanity-io/template-validator)
- [#template-creators on Sanity Slack](https://slack.sanity.io)

## License

MIT
