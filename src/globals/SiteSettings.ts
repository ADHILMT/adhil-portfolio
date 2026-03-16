import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'tagline', type: 'text', required: true },
    { name: 'bio', type: 'textarea', required: true },
    { name: 'aboutText', type: 'richText', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'location', type: 'text', required: true },
    {
      name: 'stats',
      type: 'group',
      fields: [
        { name: 'yearsExperience', type: 'text', required: true },
        { name: 'projectsDone', type: 'text', required: true },
        { name: 'happyClients', type: 'text', required: true },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'behance', type: 'text' },
        { name: 'dribbble', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
