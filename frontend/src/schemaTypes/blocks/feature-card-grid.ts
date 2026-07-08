import {defineType, defineField, defineArrayMember} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

const COLUMN_OPTIONS = [
  {title: '2 Columns', value: '2'},
  {title: '3 Columns', value: '3'},
  {title: '4 Columns', value: '4'},
] as const

const STYLE_OPTIONS = [
  {title: 'Simple', value: 'simple'},
  {title: 'Bordered', value: 'bordered'},
  {title: 'Shadow', value: 'shadow'},
  {title: 'Highlighted', value: 'highlighted'},
] as const

export const featureCardGridType = defineType({
  name: 'featureCardGrid',
  title: 'Feature Card Grid',
  type: 'object',
  icon: ThLargeIcon,
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
      name: 'cards',
      title: 'Cards',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureCard',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'cta',
              title: 'Link',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'href', title: 'URL', type: 'string'}),
              ],
            }),
          ],
          preview: {
            select: {title: 'title', media: 'icon'},
            prepare({title, media}: {title?: string; media?: React.ReactNode}) {
              return {title: title || 'Feature Card', media}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'string',
      initialValue: '3',
      options: {list: [...COLUMN_OPTIONS], layout: 'radio'},
    }),
    defineField({
      name: 'style',
      title: 'Card Style',
      type: 'string',
      initialValue: 'simple',
      options: {list: [...STYLE_OPTIONS], layout: 'radio'},
    }),
    defineField({
      name: 'blockStyles',
      title: 'Block Styles',
      type: 'blockStyles',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {title: 'title', cards: 'cards'},
    prepare({title, cards}: {title?: string; cards?: Array<unknown>}) {
      return {
        title: title || 'Feature Card Grid',
        subtitle: `${cards?.length ?? 0} cards`,
        media: ThLargeIcon,
      }
    },
  },
})
