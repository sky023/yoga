import {defineType, defineField} from 'sanity'
import {MenuIcon} from '@sanity/icons'

export const tocBlockType = defineType({
  name: 'tocBlock',
  title: 'Table of Contents',
  type: 'object',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Table of Contents',
    }),
    defineField({
      name: 'blockStyles',
      title: 'Block Styles',
      type: 'blockStyles',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Table of Contents',
        subtitle: 'TOC Block',
        media: MenuIcon,
      }
    },
  },
})
