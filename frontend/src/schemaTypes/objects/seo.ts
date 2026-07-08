import {defineType, defineField} from 'sanity'

const META_TITLE_MAX = 60
const META_DESC_MAX = 160

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: `Recommended max ${META_TITLE_MAX} characters`,
      validation: (rule) => rule.max(META_TITLE_MAX).warning(`Should be under ${META_TITLE_MAX} characters`),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: `Recommended max ${META_DESC_MAX} characters`,
      validation: (rule) => rule.max(META_DESC_MAX).warning(`Should be under ${META_DESC_MAX} characters`),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Recommended 1200x630px',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Hide this page from search engines',
      initialValue: false,
    }),
  ],
})
