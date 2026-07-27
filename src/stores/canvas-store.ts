import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CanvasPreset, CANVAS_PRESETS } from '@/types'

interface CanvasState {
  width: number
  height: number
  preset: CanvasPreset
  backgroundType: 'solid' | 'gradient' | 'image' | 'blur'
  backgroundColor: string
  backgroundGradient: { from: string; to: string; direction: number } | null
  backgroundImage: string | null
  backgroundBlur: number
  transform: { zoom: number; panX: number; panY: number }
  
  setPreset: (preset: CanvasPreset) => void
  setCustomSize: (width: number, height: number) => void
  setBackground: (type: 'solid' | 'gradient' | 'image' | 'blur', options?: {
    color?: string
    gradient?: { from: string; to: string; direction: number }
    image?: string
    blur?: number
  }) => void
  setTransform: (transform: { zoom: number; panX: number; panY: number }) => void
  resetTransform: () => void
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      width: 1920,
      height: 1080,
      preset: CanvasPreset.LANDSCAPE,
      backgroundType: 'solid',
      backgroundColor: '#1a1a2e',
      backgroundGradient: null,
      backgroundImage: null,
      backgroundBlur: 0,
      transform: { zoom: 1, panX: 0, panY: 0 },
      
      setPreset: (preset) => {
        const { width, height } = CANVAS_PRESETS[preset]
        set({ preset, width, height })
      },
      
      setCustomSize: (width, height) => {
        set({ preset: CanvasPreset.CUSTOM, width, height })
      },
      
      setBackground: (type, options = {}) => {
        set((state) => ({
          backgroundType: type,
          backgroundColor: options.color ?? state.backgroundColor,
          backgroundGradient: options.gradient ?? state.backgroundGradient,
          backgroundImage: options.image ?? state.backgroundImage,
          backgroundBlur: options.blur ?? state.backgroundBlur,
        }))
      },
      
      setTransform: (transform) => set({ transform }),
      resetTransform: () => set({ transform: { zoom: 1, panX: 0, panY: 0 } }),
    }),
    {
      name: 'canvas-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)