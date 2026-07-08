import {defineType, defineField, defineArrayMember} from 'sanity'
import {ChevronDownIcon} from '@sanity/icons'

export const accordionType = defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  icon: ChevronDownIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'Optional heading above the accordion.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'content',
      description: 'Optional subtitle below the heading.',
    }),
    defineField({
      name: 'panels',
      title: 'Panels',
      type: 'array',
      group: 'content',
      description: 'Expandable panels. Each has a visible title and collapsible content.',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'accordionPanel',
          title: 'Panel',
          fields: [
            defineField({
              name: 'title',
              title: 'Panel Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description: 'Optional icon next to the panel title.',
              options: {hotspot: false},
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'blockContent',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}: {title?: string}) {
              return {
                title: title || 'Panel',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'allowMultipleOpen',
      title: 'Allow Multiple Open',
      type: 'boolean',
      group: 'style',
      description: 'When enabled, multiple panels can be expanded at the same time.',
      initialValue: false,
    }),
    defineField({
      name: 'firstOpenByDefault',
      title: 'First Panel Open by Default',
      type: 'boolean',
      group: 'style',
      description: 'Automatically expand the first panel when the page loads.',
      initialValue: false,
    }),
    defineField({
      name: 'blockStyles',
      title: 'Block Styles',
      type: 'blockStyles',
      group: 'style',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {title: 'title', panels: 'panels'},
    prepare({title, panels}: {title?: string; panels?: Array<unknown>}) {
      const panelCount = panels?.length ?? 0
      return {
        title: title || 'Accordion',
        subtitle: `${panelCount} panel${panelCount !== 1 ? 's' : ''}`,
        media: ChevronDownIcon,
      }
    },
  },
})
