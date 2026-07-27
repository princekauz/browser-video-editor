import { create } from 'zustand'
import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'

// Project interface (inline to avoid import issues)
interface Project {
  id: string
  name: string
  version: string
  schemaVersion: number
  timeline: {
    fps: number
    currentFrame: number
    zoom: number
    tracks: Record<string, {
      id: string
      name: string
      type: 'video' | 'audio'
      clips: string[]
      locked: boolean
      visible: boolean
      height: number
      blendMode: string
      createdAt: number
      updatedAt: number
    }>
    selectedClipIds: string[]
  }
  canvas: {
    width: number
    height: number
    preset: string
    backgroundType: 'solid' | 'gradient' | 'image' | 'blur'
    backgroundColor: string
    backgroundGradient: { from: string; to: string; direction: number } | null
    backgroundImage: string | null
    backgroundBlur: number
    transform: { zoom: number; panX: number; panY: number }
  }
  settings: {
    theme: 'dark' | 'light' | 'system'
    timelineFps: number
    autosaveInterval: number
    exportDefaults: {
      format: string
      resolution: { width: number; height: number }
      fps: number
      bitrate: number
      codec: string
      quality: string
      filename: string
    }
    keyboardShortcuts: Record<string, string>
    thumbnailInterval: number
    waveformEnabled: boolean
    hardwareAcceleration: boolean
  }
  mediaAssets: Record<string, {
    id: string
    type: 'video' | 'audio' | 'image' | 'text'
    url: string
    metadata: {
      width: number
      height: number
      frameRate: number
      durationFrames: number
      codec?: string
      channels?: number
      sampleRate?: number
      bitrate?: number
      format?: string
    }
    durationFrames: number
    createdAt: number
  }>
  createdAt: number
  updatedAt: number
}

interface ProjectStore {
  currentProject: Project | null
  recentProjects: { id: string; name: string; updatedAt: number }[]
  isDirty: boolean
  autosaveTimer: ReturnType<typeof setInterval> | null
  
  newProject: () => void
  saveProject: () => Promise<void>
  saveProjectAs: (name: string) => Promise<void>
  loadProject: (id: string) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  exportProject: () => Promise<void>
  importProject: (file: File) => Promise<Project>
  setDirty: (dirty: boolean) => void
  startAutosave: () => void
  stopAutosave: () => void
  
  // Internal
  _db: IDBPDatabase<ProjectDBSchema> | null
  _initDB: () => Promise<void>
}

interface ProjectDBSchema extends DBSchema {
  projects: {
    key: string
    value: Project
    indexes: { 'by-updatedAt': number }
  }
  autosave: {
    key: string
    value: Project
  }
  settings: {
    key: string
    value: unknown
  }
}

// Database initialization
const initDB = async (): Promise<IDBPDatabase<ProjectDBSchema>> => {
  return openDB<ProjectDBSchema>('video-editor', 1, {
    upgrade(db) {
      const projectStore = db.createObjectStore('projects', { keyPath: 'id' })
      projectStore.createIndex('by-updatedAt', 'updatedAt')
      db.createObjectStore('autosave', { keyPath: 'id' })
      db.createObjectStore('settings', { keyPath: 'key' })
    },
  })
}

const createDefaultProject = (): Project => ({
  id: generateId(),
  name: 'Untitled Project',
  version: '1.0.0',
  schemaVersion: 1,
  timeline: {
    fps: 30,
    currentFrame: 0,
    zoom: 1,
    tracks: {},
    selectedClipIds: [],
  },
  canvas: {
    width: 1920,
    height: 1080,
    preset: 'landscape',
    backgroundType: 'solid',
    backgroundColor: '#1a1a2e',
    backgroundGradient: null,
    backgroundImage: null,
    backgroundBlur: 0,
    transform: { zoom: 1, panX: 0, panY: 0 },
  },
  settings: {
    theme: 'system',
    timelineFps: 30,
    autosaveInterval: 5000,
    exportDefaults: {
      format: 'mp4',
      resolution: { width: 1920, height: 1080 },
      fps: 30,
      bitrate: 10000000,
      codec: 'h264',
      quality: 'high',
      filename: 'export',
    },
    keyboardShortcuts: {},
    thumbnailInterval: 30,
    waveformEnabled: true,
    hardwareAcceleration: true,
  },
  mediaAssets: {},
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

// Simple generateId for this module
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const useProjectStore = create<ProjectStore>()(
  (set, get) => ({
    currentProject: null,
    recentProjects: [],
    isDirty: false,
    autosaveTimer: null,
    _db: null,
    
    newProject: () => {
      const project = createDefaultProject()
      set({ currentProject: project, isDirty: true })
      get().startAutosave()
    },
    
    _initDB: async () => {
      const db = await initDB()
      set({ _db: db })
      
      // Load recent projects
      const projects = await db.getAllFromIndex('projects', 'by-updatedAt')
      set({ recentProjects: projects.slice(-10).reverse().map(p => ({ id: p.id, name: p.name, updatedAt: p.updatedAt })) })
      
      // Check for autosave
      const autosave = await db.get('autosave', 'current')
      if (autosave) {
        // Offer recovery in UI
        console.log('Autosave found for recovery:', autosave.name)
      }
    },
    
    saveProject: async () => {
      const { currentProject, _db } = get()
      if (!currentProject || !_db) return
      
      const projectToSave = { ...currentProject, updatedAt: Date.now() }
      await _db.put('projects', projectToSave)
      
      // Update recent projects
      const recent = get().recentProjects.filter(p => p.id !== projectToSave.id)
      recent.unshift({ id: projectToSave.id, name: projectToSave.name, updatedAt: projectToSave.updatedAt })
      set({ recentProjects: recent.slice(0, 10), isDirty: false })
    },
    
    saveProjectAs: async (name: string) => {
      const { currentProject } = get()
      if (!currentProject) return
      
      const projectToSave = { ...currentProject, name, updatedAt: Date.now() }
      const { _db } = get()
      if (_db) {
        await _db.put('projects', projectToSave)
        set({ currentProject: projectToSave, isDirty: false })
      }
    },
    
    loadProject: async (id: string) => {
      const { _db } = get()
      if (!_db) return
      
      const project = await _db.get('projects', id)
      if (project) {
        set({ currentProject: project, isDirty: false })
        get().startAutosave()
      }
    },
    
    deleteProject: async (id: string) => {
      const { _db } = get()
      if (!_db) return
      
      await _db.delete('projects', id)
      set(state => ({ recentProjects: state.recentProjects.filter(p => p.id !== id) }))
    },
    
    exportProject: async () => {
      const { currentProject } = get()
      if (!currentProject) return
      
      const blob = new Blob([JSON.stringify(currentProject, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentProject.name}.vep`
      a.click()
      URL.revokeObjectURL(url)
    },
    
    importProject: async (file: File): Promise<Project> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const project = JSON.parse(e.target?.result as string) as Project
            const { _db } = get()
            if (_db) {
              await _db.put('projects', project)
              set({ currentProject: project, isDirty: false })
              get().startAutosave()
            }
            resolve(project)
          } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)))
          }
        }
        reader.readAsText(file)
      })
    },
    
    setDirty: (dirty: boolean) => set({ isDirty: dirty }),
    
    startAutosave: () => {
      const { autosaveTimer, currentProject, _db } = get()
      if (autosaveTimer) clearInterval(autosaveTimer)
      if (!currentProject || !_db) return
      
      const interval = currentProject.settings.autosaveInterval || 5000
      const timer = setInterval(() => {
        void (async () => {
          const { currentProject, isDirty, _db: db } = get()
          if (isDirty && currentProject && db) {
            await db.put('autosave', { ...currentProject, id: 'current', updatedAt: Date.now() })
          }
        })()
      }, interval)
      set({ autosaveTimer: timer })
    },
    
    stopAutosave: () => {
      const { autosaveTimer } = get()
      if (autosaveTimer) {
        clearInterval(autosaveTimer)
        set({ autosaveTimer: null })
      }
    },
  })
)

// Initialize DB on store creation
useProjectStore.getState()._initDB()