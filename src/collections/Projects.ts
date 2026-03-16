import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'featured', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'category', type: 'text', required: true },
    { name: 'year', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'client', type: 'text' },
    { name: 'projectUrl', type: 'text' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      required: true,
    },
  ],
  timestamps: true,
}
