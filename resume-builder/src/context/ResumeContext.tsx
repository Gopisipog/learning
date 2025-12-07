import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ExperienceItem = {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  details: string // multi-line; each line is an achievement-focused bullet
}

export type EducationItem = {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export type ProjectItem = {
  id: string
  name: string
  link: string
  description: string
}

export type ResumeData = {
  basics: {
    fullName: string
    headline: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    github: string
  }
  summary: string
  skills: string
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
}

export type ResumeContextValue = {
  data: ResumeData
  setData: (next: ResumeData) => void
  updateSection: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void
}

const LOCAL_STORAGE_KEY = 'resume-builder-data-v1'

const defaultResumeData: ResumeData = {
  basics: {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  skills: '',
  experience: [],
  education: [],
  projects: [],
}

const ResumeContext = createContext<ResumeContextValue | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ResumeData>(() => {
    if (typeof window === 'undefined') return defaultResumeData
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!stored) return defaultResumeData
      return { ...defaultResumeData, ...JSON.parse(stored) } as ResumeData
    } catch (e) {
      console.error('Failed to parse stored resume data', e)
      return defaultResumeData
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to persist resume data', e)
    }
  }, [data])

  const updateSection = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  const value: ResumeContextValue = {
    data,
    setData,
    updateSection,
  }

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}

