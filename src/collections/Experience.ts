import type { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experience',
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['company', 'role', 'startYear', 'endYear', 'type'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'startYear', type: 'text', required: true },
    { name: 'endYear', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      options: ['Full-time', 'Part-time', 'Contract', 'Freelance'],
      defaultValue: 'Full-time',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
  timestamps: true,
}
