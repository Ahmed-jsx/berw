import { defineType, defineField } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Internal title for this hero section (not displayed on frontend)',
      validation: (Rule) => Rule.required(),
      initialValue: 'Homepage Hero',
    }),
    defineField({
      name: 'slides',
      title: 'Hero Slides',
      type: 'array',
      description: 'Add and manage hero slides',
      of: [{ type: 'reference', to: [{ type: 'heroSlide' }] }],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'autoRotateInterval',
      title: 'Auto Rotate Interval (seconds)',
      type: 'number',
      description: 'Time in seconds before automatically switching to the next slide',
      validation: (Rule) => Rule.required().integer().min(3).max(30),
      initialValue: 5,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slideCount: 'slides.length',
    },
    prepare({ title, slideCount }) {
      return {
        title: title || 'Hero Section',
        subtitle: `${slideCount || 0} slide${slideCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
