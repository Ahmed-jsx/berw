import { defineType, defineField } from 'sanity'

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main headline for this slide',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The description/subtitle text',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      description: 'Hero background image',
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the call-to-action button',
      validation: (Rule) => Rule.required().max(50),
      initialValue: 'Order Now',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'Link for the call-to-action button (e.g., /menu or /menu?q=latte)',
      validation: (Rule) => Rule.required().custom((value) => {
        if (!value) return 'Button link is required';
        // Allow relative paths starting with / or full URLs
        if (typeof value === 'string' && (value.startsWith('/') || value.startsWith('http'))) {
          return true;
        }
        return 'Link must start with / or http';
      }),
      initialValue: '/menu',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order of the slide',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
  },
})
