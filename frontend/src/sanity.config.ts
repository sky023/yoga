import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "default",
  title: "My Studio",
  basePath: "/studio",   
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool()],
  schema: {
    types: [],
  },
});
