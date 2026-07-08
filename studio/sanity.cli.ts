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
  project : {
    basepath: '/studio'
  },
  api: {
    projectId: 'oog21pok',
    dataset: 'production',
  },
  studioHost: process.env.SANITY_STUDIO_STUDIO_HOST || "",
  deployment: {
    appId: 'b1htg2yoktluzts1cfqcl8tx',
    autoUpdates: true,
  },
  typegen: {
    path: '../frontend/src/**/*.{ts,tsx}',
    generates: '../frontend/src/sanity/types.ts',
  },
});
