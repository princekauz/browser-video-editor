export enum CommandType {
  // Clip operations
  SPLIT_CLIP = 'split_clip',
  JOIN_CLIPS = 'join_clips',
  DELETE_CLIP = 'delete_clip',
  DELETE_REGION = 'delete_region',
  TRIM_CLIP = 'trim_clip',
  MOVE_CLIP = 'move_clip',
  DUPLICATE_CLIP = 'duplicate_clip',
  SET_CLIP_PROPERTY = 'set_clip_property',

  // Track operations
  ADD_TRACK = 'add_track',
  REMOVE_TRACK = 'remove_track',
  REORDER_TRACKS = 'reorder_tracks',
  SET_TRACK_PROPERTY = 'set_track_property',

  // Canvas operations
  CANVAS_RESIZE = 'canvas_resize',
  SET_CANVAS_BACKGROUND = 'set_canvas_background',
  SET_CANVAS_TRANSFORM = 'set_canvas_transform',

  // Timeline operations
  SET_CURRENT_FRAME = 'set_current_frame',
  SET_ZOOM = 'set_zoom',
  SET_IN_POINT = 'set_in_point',
  SET_OUT_POINT = 'set_out_point',

  // Project operations
  NEW_PROJECT = 'new_project',
  LOAD_PROJECT = 'load_project',
  SAVE_PROJECT = 'save_project',
}

// Payload types for each command
export interface SplitClipPayload {
  clipId: string;
  splitFrame: number;
  allClips?: boolean;
  interval?: number;
  parts?: number;
}

export interface JoinClipsPayload {
  clipIds: string[];
  trackId: string;
}

export interface DeleteClipPayload {
  clipIds: string[];
  ripple?: boolean;
  trackId?: string;
}

export interface DeleteRegionPayload {
  startFrame: number;
  endFrame: number;
  trackIds?: string[];
  ripple?: boolean;
}

export interface TrimClipPayload {
  clipId: string;
  trimStartFrame?: number;
  trimEndFrame?: number;
}

export interface MoveClipPayload {
  clipId: string;
  newTimelineStartFrame: number;
  newTrackId?: string;
}

export interface DuplicateClipPayload {
  clipId: string;
  newTimelineStartFrame?: number;
  newTrackId?: string;
}

export interface SetClipPropertyPayload {
  clipId: string;
  property: string;
  value: unknown;
  previousValue: unknown;
}

export interface AddTrackPayload {
  trackId: string;
  name: string;
  type: 'video' | 'audio';
  index?: number;
}

export interface RemoveTrackPayload {
  trackId: string;
}

export interface ReorderTracksPayload {
  trackIds: string[];
}

export interface SetTrackPropertyPayload {
  trackId: string;
  property: string;
  value: unknown;
  previousValue: unknown;
}

export interface CanvasResizePayload {
  oldWidth: number;
  oldHeight: number;
  newWidth: number;
  newHeight: number;
  maintainAspectRatio: boolean;
}

export interface SetCanvasBackgroundPayload {
  type: 'solid' | 'gradient' | 'image' | 'blur';
  color?: string;
  gradient?: { from: string; to: string; direction: number };
  image?: string;
  blur?: number;
}

export interface SetCanvasTransformPayload {
  zoom: number;
  panX: number;
  panY: number;
}

export interface SetCurrentFramePayload {
  frame: number;
  previousFrame: number;
}

export interface SetZoomPayload {
  zoom: number;
  previousZoom: number;
}

export interface SetInPointPayload {
  frame: number;
  previousFrame: number | null;
}

export interface SetOutPointPayload {
  frame: number;
  previousFrame: number | null;
}
