import { z } from 'zod';

// Media Types
export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  TEXT = 'text',
  COMPOSITION = 'composition',
}

// Canvas Presets
export enum CanvasPreset {
  LANDSCAPE = 'landscape',
  VERTICAL = 'vertical',
  SQUARE = 'square',
  K4 = '4k',
  CUSTOM = 'custom',
}

export const CANVAS_PRESETS: Record<
  CanvasPreset,
  { width: number; height: number; label: string }
> = {
  [CanvasPreset.LANDSCAPE]: { width: 1920, height: 1080, label: 'Landscape (1920x1080)' },
  [CanvasPreset.VERTICAL]: { width: 1080, height: 1920, label: 'Vertical (1080x1920)' },
  [CanvasPreset.SQUARE]: { width: 1080, height: 1080, label: 'Square (1080x1080)' },
  [CanvasPreset.K4]: { width: 3840, height: 2160, label: '4K (3840x2160)' },
  [CanvasPreset.CUSTOM]: { width: 1920, height: 1080, label: 'Custom' },
};

// Export Enums
export enum ExportFormat {
  MP4 = 'mp4',
  WEBM = 'webm',
  GIF = 'gif',
  PNG_SEQUENCE = 'png-sequence',
}

export enum ExportCodec {
  H264 = 'h264',
  HEVC = 'hevc',
  VP9 = 'vp9',
  AV1 = 'av1',
}

export enum ExportQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  LOSSLESS = 'lossless',
}

// Command Types
export enum CommandType {
  SPLIT = 'split',
  JOIN = 'join',
  DELETE = 'delete',
  TRIM = 'trim',
  MOVE = 'move',
  RESIZE = 'resize',
  ROTATE = 'rotate',
  PROPERTY_CHANGE = 'property_change',
  CANVAS_RESIZE = 'canvas_resize',
  TRACK_ADD = 'track_add',
  TRACK_REMOVE = 'track_remove',
  TRACK_REORDER = 'track_reorder',
  UNDO = 'undo',
  REDO = 'redo',
  SPLIT_CLIP = 'split_clip',
  JOIN_CLIPS = 'join_clips',
  DELETE_CLIP = 'delete_clip',
  DELETE_REGION = 'delete_region',
  TRIM_CLIP = 'trim_clip',
  MOVE_CLIP = 'move_clip',
  DUPLICATE_CLIP = 'duplicate_clip',
  SET_CLIP_PROPERTY = 'set_clip_property',
  ADD_TRACK = 'add_track',
  REMOVE_TRACK = 'remove_track',
  REORDER_TRACKS = 'reorder_tracks',
  SET_TRACK_PROPERTY = 'set_track_property',
  SET_CANVAS_BACKGROUND = 'set_canvas_background',
  SET_CANVAS_TRANSFORM = 'set_canvas_transform',
  SET_CURRENT_FRAME = 'set_current_frame',
  SET_ZOOM = 'set_zoom',
  SET_IN_POINT = 'set_in_point',
  SET_OUT_POINT = 'set_out_point',
  NEW_PROJECT = 'new_project',
  LOAD_PROJECT = 'load_project',
  SAVE_PROJECT = 'save_project',
}

// Plugin Capabilities
export enum PluginCapability {
  EFFECT = 'effect',
  TRANSITION = 'transition',
  AI_TOOL = 'ai_tool',
  EXPORT_FORMAT = 'export_format',
  MEDIA_HANDLER = 'media_handler',
  RENDERER = 'renderer',
  UI_PANEL = 'ui_panel',
  KEYBOARD_SHORTCUT = 'keyboard_shortcut',
}

// Media Metadata
export const MediaMetadataSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  frameRate: z.number().positive(),
  durationFrames: z.number().nonnegative(),
  codec: z.string().optional(),
  channels: z.number().optional(),
  sampleRate: z.number().optional(),
  bitrate: z.number().optional(),
  format: z.string().optional(),
});

export type MediaMetadata = z.infer<typeof MediaMetadataSchema>;

// Media Asset
export const MediaAssetSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(MediaType),
  url: z.string(),
  metadata: MediaMetadataSchema,
  durationFrames: z.number().nonnegative(),
  createdAt: z.number(),
});

export type MediaAsset = z.infer<typeof MediaAssetSchema>;

// Timeline Clip
export const TimelineClipSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  durationFrames: z.number().positive(),
  timelineStartFrame: z.number().nonnegative(),
  sourceStartFrame: z.number().nonnegative(),
  sourceEndFrame: z.number().nonnegative(),
  trimStartFrame: z.number().nonnegative(),
  trimEndFrame: z.number().nonnegative(),
  zoom: z.number().positive(),
  panX: z.number(),
  panY: z.number(),
  rotation: z.number(),
  opacity: z.number().min(0).max(1),
  scaleX: z.number().positive(),
  scaleY: z.number().positive(),
  muted: z.boolean(),
  playbackRate: z.number().positive(),
  flipX: z.boolean(),
  flipY: z.boolean(),
  crop: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .nullable(),
  trackId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type TimelineClip = z.infer<typeof TimelineClipSchema>;

// Timeline Track
export const TimelineTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['video', 'audio']),
  clips: z.array(z.string()),
  locked: z.boolean(),
  visible: z.boolean(),
  height: z.number().positive(),
  blendMode: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type TimelineTrack = z.infer<typeof TimelineTrackSchema>;

// Timeline State
export interface TimelineState {
  fps: number;
  currentFrame: number;
  zoom: number;
  tracks: Map<string, TimelineTrack>;
  selectedClipIds: string[];
  history: HistoryCommand[];
  future: HistoryCommand[];
}

// Canvas Settings
export const CanvasSettingsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  preset: z.nativeEnum(CanvasPreset),
  backgroundType: z.enum(['solid', 'gradient', 'image', 'blur']),
  backgroundColor: z.string(),
  backgroundGradient: z
    .object({
      from: z.string(),
      to: z.string(),
      direction: z.number(),
    })
    .nullable(),
  backgroundImage: z.string().nullable(),
  backgroundBlur: z.number().min(0).max(100),
  transform: z.object({
    zoom: z.number().positive(),
    panX: z.number(),
    panY: z.number(),
  }),
});

export type CanvasSettings = z.infer<typeof CanvasSettingsSchema>;

// Export Settings
export const ExportSettingsSchema = z.object({
  format: z.nativeEnum(ExportFormat),
  resolution: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  fps: z.number().positive(),
  bitrate: z.number().positive(),
  codec: z.nativeEnum(ExportCodec),
  quality: z.nativeEnum(ExportQuality),
  filename: z.string(),
});

export type ExportSettings = z.infer<typeof ExportSettingsSchema>;

// Project Settings
export const ProjectSettingsSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']),
  timelineFps: z.number().positive(),
  autosaveInterval: z.number().positive(),
  exportDefaults: ExportSettingsSchema,
  keyboardShortcuts: z.record(z.string()),
  thumbnailInterval: z.number().positive(),
  waveformEnabled: z.boolean(),
  hardwareAcceleration: z.boolean(),
});

export type ProjectSettings = z.infer<typeof ProjectSettingsSchema>;

// History Command
export interface HistoryCommand {
  type: CommandType;
  payload: unknown;
  timestamp: number;
  clipIds: string[];
}

// Renderer
export interface Renderer {
  init(): Promise<void>;
  render(timeline: TimelineState, options: RenderOptions): Promise<RenderResult>;
  cancel(): void;
  getProgress(): RenderProgress;
  destroy(): void;
}

export interface RenderOptions {
  format: ExportFormat;
  codec: ExportCodec;
  resolution: { width: number; height: number };
  fps: number;
  bitrate: number;
  quality: ExportQuality;
  outputFileName: string;
}

export interface RenderProgress {
  stage: string;
  progress: number;
  eta: number;
  currentFrame: number;
  totalFrames: number;
}

export interface RenderResult {
  blob: Blob;
  url: string;
  duration: number;
}

// Plugin
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  capabilities: PluginCapability[];
  dependencies: string[];
}

export interface PluginContext {
  timeline: {
    getState: () => TimelineState;
    dispatch: (command: HistoryCommand) => void;
  };
  canvas: {
    getSettings: () => CanvasSettings;
    updateSettings: (settings: Partial<CanvasSettings>) => void;
  };
  media: {
    getAsset: (id: string) => MediaAsset | undefined;
    addAsset: (asset: MediaAsset) => void;
  };
  commands: {
    execute: (command: HistoryCommand) => void;
    undo: () => void;
    redo: () => void;
  };
  settings: {
    get: () => ProjectSettings;
    update: (settings: Partial<ProjectSettings>) => void;
  };
  events: {
    on: (event: string, handler: (...args: unknown[]) => void) => void;
    emit: (event: string, ...args: unknown[]) => void;
    off: (event: string, handler: (...args: unknown[]) => void) => void;
  };
}

// Project Schema for Zod validation
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  schemaVersion: z.number().positive(),
  timeline: z.object({
    fps: z.number().positive(),
    currentFrame: z.number().nonnegative(),
    zoom: z.number().positive(),
    tracks: z.record(TimelineTrackSchema),
    selectedClipIds: z.array(z.string()),
    history: z.array(z.unknown()),
    future: z.array(z.unknown()),
  }),
  canvas: CanvasSettingsSchema,
  settings: ProjectSettingsSchema,
  mediaAssets: z.record(MediaAssetSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Project = z.infer<typeof ProjectSchema>;
