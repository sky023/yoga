import {defineType, defineField, defineArrayMember} from 'sanity'
import {DashboardIcon, ImageIcon} from '@sanity/icons'
import {LayoutPickerInput} from '../../components/LayoutPickerInput'
import {ColumnsInput} from '../../components/ColumnsInput'


const LAYOUT_OPTIONS = [
  {title: 'Full Width', value: 'full'},
  {title: '50 / 50', value: '50-50'},
  {title: '33 / 66', value: '33-66'},
  {title: '66 / 33', value: '66-33'},
  {title: '25 / 75', value: '25-75'},
  {title: '75 / 25', value: '75-25'},
  {title: '33 / 33 / 33', value: '33-33-33'},
  {title: '25 / 50 / 25', value: '25-50-25'},
  {title: '25 / 25 / 25 / 25', value: '25-25-25-25'},
] as const

export const gridRowType = defineType({
  name: 'gridRow',
  title: 'Grid Row',
  type: 'object',
  icon: DashboardIcon,
  groups: [
    {name: 'columns', title: 'Columns', default: true},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'columns',
      description: 'Pick a column layout, then add content to each column below.',
      validation: (rule) => rule.required(),
      initialValue: '50-50',
      components: {
        input: LayoutPickerInput,
      },
    }),

    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      group: 'columns',
      validation: (rule) => rule.required().min(1),
      components: {
        input: ColumnsInput,
      },
      of: [
        defineArrayMember({
          type: 'object',
          name: 'gridColumn',
          title: 'Column',
          fields: [
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                // Rich text & media
                defineArrayMember({type: 'richTextBlock'}),
                defineArrayMember({type: 'imageBlock'}),
                defineArrayMember({type: 'callToAction'}),
                defineArrayMember({type: 'externalVideo'}),
                defineArrayMember({type: 'youtubeVideo'}),
                // Interactive
                defineArrayMember({type: 'tabbedContent'}),
                defineArrayMember({type: 'accordion'}),
                defineArrayMember({type: 'spacerDivider'}),
                defineArrayMember({type: 'countdownTimer'}),
                // Display
                defineArrayMember({type: 'iconText'}),
                defineArrayMember({type: 'buttonGroup'}),
                defineArrayMember({type: 'statMetric'}),
                defineArrayMember({type: 'testimonialQuote'}),
                defineArrayMember({type: 'alertNotice'}),
                defineArrayMember({type: 'pricingCard'}),
                // Embeds & data
                defineArrayMember({type: 'socialEmbed'}),
                defineArrayMember({type: 'logoRow'}),
                defineArrayMember({type: 'mapEmbed'}),
                defineArrayMember({type: 'codeBlock'}),
                defineArrayMember({type: 'dataTable'}),
                defineArrayMember({type: 'lottieAnimation'}),
                // Forms & FAQ
                defineArrayMember({type: 'formBlock'}),
                defineArrayMember({type: 'faqBlock'}),
                // Grids & galleries
                defineArrayMember({type: 'featureCardGrid'}),
                defineArrayMember({type: 'testimonialCarousel'}),
                defineArrayMember({type: 'imageGallery'}),
                defineArrayMember({type: 'tocBlock'}),
              ],
              options: {
                insertMenu: {
                  views: [{name: 'grid'}],
                },
              },
            }),
            defineField({
              name: 'verticalAlign',
              title: 'Vertical Align',
              type: 'string',
              description: 'Controls how content aligns when columns have different heights.',
              initialValue: 'top',
              options: {
                list: [
                  {title: 'Top', value: 'top'},
                  {title: 'Center', value: 'center'},
                  {title: 'Bottom', value: 'bottom'},
                ],
              },
            }),
            defineField({
              name: 'blockStyles',
              title: 'Column Styles',
              type: 'blockStyles',
              options: {collapsible: true, collapsed: true},
            }),
          ],
          preview: {
            select: {content: 'content'},
            prepare({content}: {content?: Array<unknown>}) {
              const blockCount = content?.length ?? 0
              return {
                title: 'Column',
                subtitle: `${blockCount} block${blockCount !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
    }),

    // --- Style tab ---
    defineField({
      name: 'gap',
      title: 'Column Gap',
      type: 'string',
      group: 'style',
      description: 'Space between columns.',
      initialValue: 'md',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'Extra Large', value: 'xl'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'reverseOnMobile',
      title: 'Reverse order on mobile',
      type: 'boolean',
      group: 'style',
      description:
        'Reverses the column stacking order on small screens. Useful when you want text above image on mobile.',
      initialValue: false,
    }),
    defineField({
      name: 'paddingY',
      title: 'Vertical Padding',
      type: 'string',
      group: 'style',
      initialValue: 'md',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'Extra Large', value: 'xl'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'string',
      group: 'style',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Narrow (768px)', value: 'narrow'},
          {title: 'Default (1200px)', value: 'default'},
          {title: 'Wide (1400px)', value: 'wide'},
          {title: 'Full Width', value: 'full'},
        ],
      },
    }),
    defineField({
      name: 'blockStyles',
      title: 'Advanced Layout',
      type: 'blockStyles',
      group: 'style',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {layout: 'layout', columns: 'columns'},
    prepare({
      layout,
      columns,
    }: {
      layout?: string
      columns?: Array<unknown>
    }) {
      const colCount = columns?.length ?? 0
      const label =
        LAYOUT_OPTIONS.find((o) => o.value === layout)?.title ?? layout ?? '—'
      return {
        title: `Grid Row — ${label}`,
        subtitle: `${colCount} column${colCount !== 1 ? 's' : ''}`,
        media: DashboardIcon,
      }
    },
  },
})
