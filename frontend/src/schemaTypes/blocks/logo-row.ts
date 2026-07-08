import {defineType, defineField, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const logoRowType = defineType({
  name: 'logoRow',
  title: 'Logo Row',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      description: 'Add 2-8 logos.',
      validation: (rule) => rule.required().min(2).max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'logoItem',
          title: 'Logo',
          fields: [
            defineField({
              name: 'image',
              title: 'Logo',
              type: 'image',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'url',
              description: 'Optional — clicking the logo opens this URL.',
            }),
          ],
          preview: {
            select: {media: 'image', alt: 'alt'},
            prepare({media, alt}) {
              return {title: alt || 'Logo', media}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'grayscale',
      title: 'Grayscale',
      type: 'boolean',
      description: 'Display logos in grayscale.',
      initialValue: false,
    }),
    defineField({
      name: 'size',
      title: 'Logo Size',
      type: 'string',
      initialValue: 'medium',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'blockStyles',
      title: 'Block Styles',
      type: 'blockStyles',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {logos: 'logos'},
    prepare({logos}: {logos?: Array<unknown>}) {
      const count = logos?.length ?? 0
      return {
        title: 'Logo Row',
        subtitle: `${count} logo${count !== 1 ? 's' : ''}`,
        media: ImageIcon,
      }
    },
  },
})
