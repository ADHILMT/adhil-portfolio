import { getProjects, getExperience, getSiteSettings } from '../lib/api'
import HeroSection from '../components/HeroSection'
import ProjectsSection from '../components/ProjectsSection'
import ExperienceSection from '../components/ExperienceSection'
import ContactForm from '../components/ContactForm'
import './styles.css'

export default async function HomePage() {
  const [projects, experience, settings] = await Promise.all([
    getProjects(),
    getExperience(),
    getSiteSettings(),
  ])

  return (
    <div className="home">
      {/* <p>CHANGES REFLECTED - RED BACKGROUND</p> */}
      <HeroSection settings={settings} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experience={experience} />
      <ContactForm />
    </div>
  )
}