import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const imageBlockType = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'blockStyles',
      title: 'Block Styles',
      type: 'blockStyles',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {media: 'image', alt: 'image.alt', caption: 'caption'},
    prepare({media, alt, caption}) {
      return {title: caption || alt || 'Image', media}
    },
  },
})
