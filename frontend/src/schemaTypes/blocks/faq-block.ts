import {defineType, defineField, defineArrayMember} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faqBlockType = defineType({
  name: 'faqBlock',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
            }),
          ],
          preview: {
            select: {title: 'question'},
            prepare({title}: {title?: string}) {
              return {title: title || 'FAQ Item'}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'enableSchema',
      title: 'Enable FAQ Schema (JSON-LD)',
      type: 'boolean',
      description: 'Outputs FAQPage structured data for SEO',
      initialValue: true,
    }),
    defineField({
      name: 'allowMultipleOpen',
      title: 'Allow Multiple Open',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'firstOpenByDefault',
      title: 'First Item Open by Default',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'blockStyles',
      title: 'Block Styles',
      type: 'blockStyles',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare({title, items}: {title?: string; items?: Array<unknown>}) {
      return {
        title: title || 'FAQ',
        subtitle: `${items?.length ?? 0} questions`,
        media: HelpCircleIcon,
      }
    },
  },
})
