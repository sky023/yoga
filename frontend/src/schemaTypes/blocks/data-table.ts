import {defineType, defineField, defineArrayMember} from 'sanity'
import {ThListIcon} from '@sanity/icons'

export const dataTableType = defineType({
  name: 'dataTable',
  title: 'Table',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional table title.',
    }),
    defineField({
      name: 'headers',
      title: 'Column Headers',
      type: 'array',
      description: 'Table column headers (2-6).',
      validation: (rule) => rule.required().min(2).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableHeader',
          title: 'Header',
          fields: [
            defineField({
              name: 'text',
              title: 'Header Text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {text: 'text'},
            prepare({text}: {text?: string}) {
              return {title: text || 'Header'}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      description: 'Table data rows.',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'dataTableRow',
          title: 'Row',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              description: 'One cell per column header.',
              validation: (rule) => rule.required().min(2).max(6),
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'tableCell',
                  title: 'Cell',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Cell Text',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {text: 'text'},
                    prepare({text}: {text?: string}) {
                      return {title: text || '—'}
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}: {cells?: Array<{text?: string}>}) {
              const firstCell = cells?.[0]?.text ?? ''
              const cellCount = cells?.length ?? 0
              return {
                title: firstCell || 'Row',
                subtitle: `${cellCount} cell${cellCount !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'striped',
      title: 'Striped Rows',
      type: 'boolean',
      description: 'Alternate row background colors.',
      initialValue: true,
    }),
    defineField({
      name: 'compact',
      title: 'Compact',
      type: 'boolean',
      description: 'Reduce cell padding.',
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
    select: {caption: 'caption', rows: 'rows', headers: 'headers'},
    prepare({
      caption,
      rows,
      headers,
    }: {
      caption?: string
      rows?: Array<unknown>
      headers?: Array<unknown>
    }) {
      const rowCount = rows?.length ?? 0
      const colCount = headers?.length ?? 0
      return {
        title: caption || 'Table',
        subtitle: `${colCount} columns × ${rowCount} rows`,
        media: ThListIcon,
      }
    },
  },
})
