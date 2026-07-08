import {defineType, defineField} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons'

export const socialEmbedType = defineType({
  name: 'socialEmbed',
  title: 'Social Embed',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Instagram', value: 'instagram'},
          {title: 'TikTok', value: 'tiktok'},
          {title: 'Twitter / X', value: 'twitter'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'embedUrl',
      title: 'Post URL',
      type: 'url',
      description: 'Full URL of the social media post.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional text below the embed.',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      initialValue: 'auto',
      options: {
        list: [
          {title: 'Auto', value: 'auto'},
          {title: 'Square (1:1)', value: 'square'},
          {title: 'Portrait (4:5)', value: 'portrait'},
          {title: 'Landscape (16:9)', value: 'landscape'},
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
    select: {platform: 'platform', embedUrl: 'embedUrl'},
    prepare({platform, embedUrl}: {platform?: string; embedUrl?: string}) {
      const labels: Record<string, string> = {
        instagram: 'Instagram',
        tiktok: 'TikTok',
        twitter: 'Twitter / X',
        facebook: 'Facebook',
        other: 'Embed',
      }
      return {
        title: labels[platform ?? 'other'] ?? 'Social Embed',
        subtitle: embedUrl ?? 'No URL',
        media: EarthGlobeIcon,
      }
    },
  },
})
