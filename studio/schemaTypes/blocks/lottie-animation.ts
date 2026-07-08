import {defineType, defineField} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const lottieAnimationType = defineType({
  name: 'lottieAnimation',
  title: 'Lottie Animation',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      initialValue: 'url',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'URL (LottieFiles CDN)', value: 'url'},
          {title: 'File Upload (.json)', value: 'file'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'url',
      title: 'Animation URL',
      type: 'url',
      description: 'URL to a Lottie JSON file (e.g., from LottieFiles.com).',
      hidden: ({parent}) => parent?.source !== 'url',
      validation: (rule) =>
        rule.custom((val, context) => {
          const parent = context?.parent as Record<string, unknown> | undefined
          if (parent?.source === 'url' && !val) return 'URL is required when source is URL'
          return true
        }),
    }),
    defineField({
      name: 'file',
      title: 'Animation File',
      type: 'file',
      description: 'Upload a .json Lottie file.',
      hidden: ({parent}) => parent?.source !== 'file',
      options: {accept: '.json,application/json'},
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'speed',
      title: 'Speed',
      type: 'number',
      description: 'Playback speed (0.5 = half, 1 = normal, 2 = double).',
      initialValue: 1,
      validation: (rule) => rule.min(0.1).max(3),
    }),
    defineField({
      name: 'trigger',
      title: 'Trigger',
      type: 'string',
      description: 'When the animation plays.',
      initialValue: 'auto',
      options: {
        list: [
          {title: 'Auto (play immediately)', value: 'auto'},
          {title: 'On Hover', value: 'hover'},
          {title: 'On Scroll (when visible)', value: 'scroll'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'alt',
      title: 'Description',
      type: 'string',
      description: 'Accessibility description of the animation.',
    }),
    defineField({
      name: 'blockStyles',
      title: 'Block Styles',
      type: 'blockStyles',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {alt: 'alt', source: 'source', trigger: 'trigger'},
    prepare({
      alt,
      source,
      trigger,
    }: {
      alt?: string
      source?: string
      trigger?: string
    }) {
      return {
        title: alt || 'Lottie Animation',
        subtitle: `${source ?? 'url'} · ${trigger ?? 'auto'}`,
        media: PlayIcon,
      }
    },
  },
})
