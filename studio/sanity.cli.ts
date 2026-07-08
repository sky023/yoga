/**
 * Sanity CLI Configuration
 * This file configures the Sanity CLI tool with project-specific settings
 * and customizes the Vite bundler configuration.
 * Learn more: https://www.sanity.io/docs/cli
 */

import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: process.env.SANITY_STUDIO_STUDIO_HOST || "",
  deployment: {
    appId: 'kq9mfz8mbjx0fu2h7zf836t4',
    autoUpdates: true,
  },
  typegen: {
    path: '../frontend/src/**/*.{ts,tsx}',
    generates: '../frontend/src/sanity/types.ts',
  },
});
