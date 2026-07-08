import {defineType, defineField, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const imageGalleryType = defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryImage',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'alt', media: 'image'},
            prepare({title, media}: {title?: string; media?: React.ReactNode}) {
              return {title: title || 'Image', media}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'grid',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Masonry', value: 'masonry'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'string',
      initialValue: '3',
      options: {
        list: [
          {title: '2 Columns', value: '2'},
          {title: '3 Columns', value: '3'},
          {title: '4 Columns', value: '4'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'enableLightbox',
      title: 'Enable Lightbox',
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
    select: {title: 'title', images: 'images'},
    prepare({title, images}: {title?: string; images?: Array<unknown>}) {
      return {
        title: title || 'Image Gallery',
        subtitle: `${images?.length ?? 0} images`,
        media: ImageIcon,
      }
    },
  },
})
