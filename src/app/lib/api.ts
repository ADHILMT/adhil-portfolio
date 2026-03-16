// ─────────────────────────────────────────────
//  lib/api.ts  —  All Payload CMS API helpers
// ─────────────────────────────────────────────

const CMS = process.env.CMS_URL || process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

// ── Types ────────────────────────────────────

export type Media = {
  id: string
  url: string
  filename: string
  alt: string
  sizes?: {
    thumbnail?: { url: string }
    card?: { url: string }
  }
}

export type Project = {
  id: string
  title: string
  slug: string
  category: string
  year: string
  description: string
  coverImage?: Media
  client?: string
  projectUrl?: string
  featured: boolean
  order: number
  status: 'published' | 'draft'
}

export type Experience = {
  id: string
  company: string
  role: string
  startYear: string
  endYear: string
  type: string
  order: number
}

export type ContactMessage = {
  id?: string
  name: string
  email: string
  projectType?: string
  message: string
  read?: boolean
  createdAt?: string
}

export type SiteSettings = {
  name: string
  title: string
  tagline: string
  bio: string
  aboutText: string
  email: string
  location: string
  stats: {
    yearsExperience: string
    projectsDone: string
    happyClients: string
  }
  socials: {
    behance?: string
    dribbble?: string
    instagram?: string
    linkedin?: string
  }
  photo?: Media
}

// ── Fetch helpers ─────────────────────────────

async function fetchAPI<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS}/api${path}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    console.error(`[API] Failed to fetch ${path}`)
    return null
  }
}

// ── Public API functions ──────────────────────

/** Get all published projects sorted by order */
export async function getProjects(): Promise<Project[]> {
  const data = await fetchAPI<{ docs: Project[] }>(
    '/projects?where[status][equals]=published&sort=order&limit=20&depth=1'
  )
  return data?.docs ?? []
}

/** Get a single project by slug */
export async function getProject(slug: string): Promise<Project | null> {
  const data = await fetchAPI<{ docs: Project[] }>(
    `/projects?where[slug][equals]=${slug}&depth=1&limit=1`
  )
  return data?.docs?.[0] ?? null
}

/** Get all experience entries sorted by order */
export async function getExperience(): Promise<Experience[]> {
  const data = await fetchAPI<{ docs: Experience[] }>(
    '/experience?sort=order&limit=20'
  )
  return data?.docs ?? []
}

/** Get site-wide settings */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return fetchAPI<SiteSettings>('/globals/site-settings')
}

/** Submit contact form — returns true on success */
export async function submitContactForm(form: ContactMessage): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/contact-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    return res.ok
  } catch {
    return false
  }
}

// ── Admin API functions ───────────────────────

/** Login — returns token on success */
export async function loginAdmin(email: string, password: string): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.token ?? null
  } catch {
    return null
  }
}

/** Create a new project */
export async function createProject(
  token: string,
  project: Partial<Project>
): Promise<Project | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(project),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.doc ?? null
  } catch {
    return null
  }
}

/** Update an existing project */
export async function updateProject(
  token: string,
  id: string,
  project: Partial<Project>
): Promise<Project | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(project),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.doc ?? null
  } catch {
    return null
  }
}

/** Delete a project */
export async function deleteProject(token: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `JWT ${token}` },
    })
    return res.ok
  } catch {
    return false
  }
}

/** Upload an image to media */
export async function uploadMedia(token: string, file: File, alt: string): Promise<Media | null> {
  try {
    const form = new FormData()
    form.append('file', file)
    form.append('alt', alt)
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/media`, {
      method: 'POST',
      headers: { Authorization: `JWT ${token}` },
      body: form,
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.doc ?? null
  } catch {
    return null
  }
}

/** Get all contact messages (admin only) */
export async function getMessages(token: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_URL}/api/contact-messages?sort=-createdAt&limit=50`,
      { headers: { Authorization: `JWT ${token}` } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data?.docs ?? []
  } catch {
    return []
  }
}

/** Get all media files */
export async function getMediaFiles(token: string): Promise<Media[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_URL}/api/media?limit=50`,
      { headers: { Authorization: `JWT ${token}` } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data?.docs ?? []
  } catch {
    return []
  }
}

/** Helper: get full media URL */
export function mediaUrl(url?: string): string {
  if (!url) return '/assets/placeholder.jpg'
  if (url.startsWith('http')) return url
  return `${process.env.NEXT_PUBLIC_CMS_URL}${url}`
}
