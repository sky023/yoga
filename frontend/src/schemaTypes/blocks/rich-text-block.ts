import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const richTextBlockType = defineType({
  name: 'richTextBlock',
  title: 'Rich Text',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blockStyles',
      title: 'Block Styles',
      type: 'blockStyles',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {content: 'content'},
    prepare({content}: {content?: Array<{children?: Array<{text?: string}>}>}) {
      const firstBlock = content?.[0]
      const text = firstBlock?.children?.map((c) => c.text).join('') || 'Rich Text'
      return {title: text, media: DocumentTextIcon}
    },
  },
})
