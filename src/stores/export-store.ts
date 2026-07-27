import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ExportState {
  format: 'mp4' | 'webm' | 'gif' | 'png-sequence'
  resolution: { width: number; height: number }
  fps: number
  bitrate: number
  codec: 'h264' | 'hevc' | 'vp9' | 'av1'
  quality: 'low' | 'medium' | 'high' | 'lossless'
  filename: string
  isExporting: boolean
  progress: number
  stage: string
  eta: number
  currentFrame: number
  totalFrames: number
  error: string | null
  
  setFormat: (format: 'mp4' | 'webm' | 'gif' | 'png-sequence') => void
  setResolution: (width: number, height: number) => void
  setFps: (fps: number) => void
  setBitrate: (bitrate: number) => void
  setCodec: (codec: 'h264' | 'hevc' | 'vp9' | 'av1') => void
  setQuality: (quality: 'low' | 'medium' | 'high' | 'lossless') => void
  setFilename: (filename: string) => void
  setExporting: (exporting: boolean) => void
  setProgress: (progress: number, stage?: string, eta?: number, currentFrame?: number, totalFrames?: number) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useExportStore = create<ExportState>()(
  persist(
    (set) => ({
      format: 'mp4',
      resolution: { width: 1920, height: 1080 },
      fps: 30,
      bitrate: 10000000,
      codec: 'h264',
      quality: 'high',
      filename: 'export',
      isExporting: false,
      progress: 0,
      stage: '',
      eta: 0,
      currentFrame: 0,
      totalFrames: 0,
      error: null,
      
      setFormat: (format) => set({ format }),
      setResolution: (width, height) => set({ resolution: { width, height } }),
      setFps: (fps) => set({ fps }),
      setBitrate: (bitrate) => set({ bitrate }),
      setCodec: (codec) => set({ codec }),
      setQuality: (quality) => set({ quality }),
      setFilename: (filename) => set({ filename }),
      setExporting: (exporting) => set({ isExporting: exporting, progress: exporting ? 0 : 0, error: null }),
      setProgress: (progress, stage, eta, currentFrame, totalFrames) => set({ 
        progress, 
        stage: stage ?? '', 
        eta: eta ?? 0, 
        currentFrame: currentFrame ?? 0, 
        totalFrames: totalFrames ?? 0 
      }),
      setError: (error) => set({ error, isExporting: false }),
      reset: () => set({
        format: 'mp4',
        resolution: { width: 1920, height: 1080 },
        fps: 30,
        bitrate: 10000000,
        codec: 'h264',
        quality: 'high',
        filename: 'export',
        isExporting: false,
        progress: 0,
        stage: '',
        eta: 0,
        currentFrame: 0,
        totalFrames: 0,
        error: null,
      }),
    }),
    {
      name: 'export-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)