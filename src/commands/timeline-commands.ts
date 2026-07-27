import { BaseCommand } from './command';
import { CommandType } from './command-types';
import type {
  SplitClipPayload,
  JoinClipsPayload,
  DeleteClipPayload,
  DeleteRegionPayload,
  TrimClipPayload,
  MoveClipPayload,
  DuplicateClipPayload,
  SetClipPropertyPayload,
  AddTrackPayload,
  RemoveTrackPayload,
  ReorderTracksPayload,
  SetTrackPropertyPayload,
  CanvasResizePayload,
  SetCanvasBackgroundPayload,
  SetCanvasTransformPayload,
  SetCurrentFramePayload,
  SetZoomPayload,
  SetInPointPayload,
  SetOutPointPayload,
} from './command-types';

// Timeline state interface for command operations
export interface TimelineStateAccessor {
  getClip: (id: string) => TimelineClip | undefined;
  setClip: (clip: TimelineClip) => void;
  removeClip: (id: string) => void;
  getTrack: (id: string) => TimelineTrack | undefined;
  setTrack: (track: TimelineTrack) => void;
  removeTrack: (id: string) => void;
  getTracks: () => TimelineTrack[];
  getClips: () => TimelineClip[];
  addTrack: (track: TimelineTrack) => void;
  addClip: (clip: TimelineClip) => void;
  reorderTracks: (trackIds: string[]) => void;
  moveClip: (clipId: string, newTimelineStartFrame: number, newTrackId?: string) => void;
  splitClip: (clipId: string, splitFrame: number) => TimelineClip;
  joinClips: (clipIds: string[]) => TimelineClip;
  deleteClip: (clipId: string, ripple?: boolean) => void;
  deleteRegion: (
    startFrame: number,
    endFrame: number,
    trackIds?: string[],
    ripple?: boolean
  ) => void;
  trimClip: (clipId: string, trimStartFrame?: number, trimEndFrame?: number) => void;
  duplicateClip: (
    clipId: string,
    newTimelineStartFrame?: number,
    newTrackId?: string
  ) => TimelineClip;
  setClipProperty: (clipId: string, property: string, value: unknown) => void;
  setTrackProperty: (trackId: string, property: string, value: unknown) => void;
  setCurrentFrame: (frame: number) => void;
  setZoom: (zoom: number) => void;
  setInPoint: (frame: number) => void;
  setOutPoint: (frame: number) => void;
}

// Re-export types for command usage
export interface TimelineClip {
  id: string;
  sourceId: string;
  durationFrames: number;
  timelineStartFrame: number;
  sourceStartFrame: number;
  sourceEndFrame: number;
  trimStartFrame: number;
  trimEndFrame: number;
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  opacity: number;
  scaleX: number;
  scaleY: number;
  muted: boolean;
  playbackRate: number;
  flipX: boolean;
  flipY: boolean;
  crop: { x: number; y: number; width: number; height: number } | null;
  trackId: string;
  createdAt: number;
  updatedAt: number;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio';
  clips: string[];
  locked: boolean;
  visible: boolean;
  height: number;
  blendMode: string;
  createdAt: number;
  updatedAt: number;
}

// Base Timeline Command
export abstract class TimelineCommand extends BaseCommand {
  protected timeline: TimelineStateAccessor;

  constructor(timeline: TimelineStateAccessor, affectedClipIds: string[] = []) {
    super(affectedClipIds);
    this.timeline = timeline;
  }
}

// Split Clip Command
export class SplitClipCommand extends TimelineCommand {
  private payload: SplitClipPayload;
  private newClipId: string | null = null;

  constructor(timeline: TimelineStateAccessor, payload: SplitClipPayload) {
    super(timeline, [payload.clipId]);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SPLIT_CLIP;
  }

  getPayload(): SplitClipPayload {
    return this.payload;
  }

  execute(): void {
    const clip = this.timeline.getClip(this.payload.clipId);
    if (!clip) return;

    const newClip = this.timeline.splitClip(this.payload.clipId, this.payload.splitFrame);
    this.newClipId = newClip.id;
    this.markExecuted();
  }

  undo(): void {
    if (!this.newClipId) return;
    this.timeline.removeClip(this.newClipId);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Join Clips Command
export class JoinClipsCommand extends TimelineCommand {
  private payload: JoinClipsPayload;
  private originalClips: TimelineClip[] = [];
  private newClip: TimelineClip | null = null;

  constructor(timeline: TimelineStateAccessor, payload: JoinClipsPayload) {
    super(timeline, payload.clipIds);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.JOIN_CLIPS;
  }

  getPayload(): JoinClipsPayload {
    return this.payload;
  }

  execute(): void {
    this.originalClips = this.payload.clipIds
      .map((id) => this.timeline.getClip(id)!)
      .filter(Boolean);
    this.newClip = this.timeline.joinClips(this.payload.clipIds);
    this.markExecuted();
  }

  undo(): void {
    if (!this.newClip) return;
    this.timeline.removeClip(this.newClip.id);
    this.originalClips.forEach((clip) => this.timeline.addClip(clip));
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Delete Clip Command
export class DeleteClipCommand extends TimelineCommand {
  private payload: DeleteClipPayload;
  private deletedClips: TimelineClip[] = [];

  constructor(timeline: TimelineStateAccessor, payload: DeleteClipPayload) {
    super(timeline, payload.clipIds);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.DELETE_CLIP;
  }

  getPayload(): DeleteClipPayload {
    return this.payload;
  }

  execute(): void {
    this.deletedClips = this.payload.clipIds
      .map((id) => this.timeline.getClip(id))
      .filter(Boolean) as TimelineClip[];

    this.payload.clipIds.forEach((id) => this.timeline.deleteClip(id, this.payload.ripple));
    this.markExecuted();
  }

  undo(): void {
    this.deletedClips.forEach((clip) => this.timeline.addClip(clip));
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Delete Region Command
export class DeleteRegionCommand extends TimelineCommand {
  private payload: DeleteRegionPayload;
  private deletedClips: TimelineClip[] = [];

  constructor(timeline: TimelineStateAccessor, payload: DeleteRegionPayload) {
    super(timeline, []);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.DELETE_REGION;
  }

  getPayload(): DeleteRegionPayload {
    return this.payload;
  }

  execute(): void {
    const allClips = this.timeline.getClips();
    this.deletedClips = allClips.filter(
      (clip) =>
        clip.timelineStartFrame < this.payload.endFrame &&
        clip.timelineStartFrame + clip.durationFrames > this.payload.startFrame &&
        (!this.payload.trackIds || this.payload.trackIds.includes(clip.trackId))
    );

    this.timeline.deleteRegion(
      this.payload.startFrame,
      this.payload.endFrame,
      this.payload.trackIds,
      this.payload.ripple
    );
    this.markExecuted();
  }

  undo(): void {
    this.deletedClips.forEach((clip) => this.timeline.addClip(clip));
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Trim Clip Command
export class TrimClipCommand extends TimelineCommand {
  private payload: TrimClipPayload;
  private previousTrimStart: number | null = null;
  private previousTrimEnd: number | null = null;

  constructor(timeline: TimelineStateAccessor, payload: TrimClipPayload) {
    super(timeline, [payload.clipId]);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.TRIM_CLIP;
  }

  getPayload(): TrimClipPayload {
    return this.payload;
  }

  execute(): void {
    const clip = this.timeline.getClip(this.payload.clipId);
    if (!clip) return;

    this.previousTrimStart = clip.trimStartFrame;
    this.previousTrimEnd = clip.trimEndFrame;

    this.timeline.trimClip(
      this.payload.clipId,
      this.payload.trimStartFrame,
      this.payload.trimEndFrame
    );
    this.markExecuted();
  }

  undo(): void {
    if (this.previousTrimStart === null || this.previousTrimEnd === null) return;

    this.timeline.trimClip(this.payload.clipId, this.previousTrimStart, this.previousTrimEnd);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Move Clip Command
export class MoveClipCommand extends TimelineCommand {
  private payload: MoveClipPayload;
  private previousTimelineStartFrame = 0;
  private previousTrackId = '';

  constructor(timeline: TimelineStateAccessor, payload: MoveClipPayload) {
    super(timeline, [payload.clipId]);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.MOVE_CLIP;
  }

  getPayload(): MoveClipPayload {
    return this.payload;
  }

  execute(): void {
    const clip = this.timeline.getClip(this.payload.clipId);
    if (!clip) return;

    this.previousTimelineStartFrame = clip.timelineStartFrame;
    this.previousTrackId = clip.trackId;

    this.timeline.moveClip(
      this.payload.clipId,
      this.payload.newTimelineStartFrame,
      this.payload.newTrackId
    );
    this.markExecuted();
  }

  undo(): void {
    this.timeline.moveClip(
      this.payload.clipId,
      this.previousTimelineStartFrame,
      this.previousTrackId
    );
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Duplicate Clip Command
export class DuplicateClipCommand extends TimelineCommand {
  private payload: DuplicateClipPayload;
  private newClip: TimelineClip | null = null;

  constructor(timeline: TimelineStateAccessor, payload: DuplicateClipPayload) {
    super(timeline, [payload.clipId]);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.DUPLICATE_CLIP;
  }

  getPayload(): DuplicateClipPayload {
    return this.payload;
  }

  execute(): void {
    this.newClip = this.timeline.duplicateClip(
      this.payload.clipId,
      this.payload.newTimelineStartFrame,
      this.payload.newTrackId
    );
    this.markExecuted();
  }

  undo(): void {
    if (!this.newClip) return;
    this.timeline.removeClip(this.newClip.id);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Set Clip Property Command
export class SetClipPropertyCommand extends TimelineCommand {
  private payload: SetClipPropertyPayload;

  constructor(timeline: TimelineStateAccessor, payload: SetClipPropertyPayload) {
    super(timeline, [payload.clipId]);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SET_CLIP_PROPERTY;
  }

  getPayload(): SetClipPropertyPayload {
    return this.payload;
  }

  execute(): void {
    this.timeline.setClipProperty(this.payload.clipId, this.payload.property, this.payload.value);
    this.markExecuted();
  }

  undo(): void {
    this.timeline.setClipProperty(
      this.payload.clipId,
      this.payload.property,
      this.payload.previousValue
    );
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Add Track Command
export class AddTrackCommand extends TimelineCommand {
  private payload: AddTrackPayload;
  private added = false;

  constructor(timeline: TimelineStateAccessor, payload: AddTrackPayload) {
    super(timeline, []);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.ADD_TRACK;
  }

  getPayload(): AddTrackPayload {
    return this.payload;
  }

  execute(): void {
    const track: TimelineTrack = {
      id: this.payload.trackId,
      name: this.payload.name,
      type: this.payload.type,
      clips: [],
      locked: false,
      visible: true,
      height: 80,
      blendMode: 'normal',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.timeline.addTrack(track);
    this.added = true;
    this.markExecuted();
  }

  undo(): void {
    if (!this.added) return;
    this.timeline.removeTrack(this.payload.trackId);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Remove Track Command
export class RemoveTrackCommand extends TimelineCommand {
  private payload: RemoveTrackPayload;
  private removedTrack: TimelineTrack | null = null;

  constructor(timeline: TimelineStateAccessor, payload: RemoveTrackPayload) {
    super(timeline, []);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.REMOVE_TRACK;
  }

  getPayload(): RemoveTrackPayload {
    return this.payload;
  }

  execute(): void {
    this.removedTrack = this.timeline.getTrack(this.payload.trackId) ?? null;
    if (this.removedTrack) {
      this.timeline.removeTrack(this.payload.trackId);
    }
    this.markExecuted();
  }

  undo(): void {
    if (!this.removedTrack) return;
    this.timeline.addTrack(this.removedTrack);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Reorder Tracks Command
export class ReorderTracksCommand extends TimelineCommand {
  private payload: ReorderTracksPayload;
  private previousOrder: string[] = [];

  constructor(timeline: TimelineStateAccessor, payload: ReorderTracksPayload) {
    super(timeline, []);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.REORDER_TRACKS;
  }

  getPayload(): ReorderTracksPayload {
    return this.payload;
  }

  execute(): void {
    this.previousOrder = this.timeline.getTracks().map((t) => t.id);
    this.timeline.reorderTracks(this.payload.trackIds);
    this.markExecuted();
  }

  undo(): void {
    this.timeline.reorderTracks(this.previousOrder);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Set Track Property Command
export class SetTrackPropertyCommand extends TimelineCommand {
  private payload: SetTrackPropertyPayload;

  constructor(timeline: TimelineStateAccessor, payload: SetTrackPropertyPayload) {
    super(timeline, []);
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SET_TRACK_PROPERTY;
  }

  getPayload(): SetTrackPropertyPayload {
    return this.payload;
  }

  execute(): void {
    this.timeline.setTrackProperty(this.payload.trackId, this.payload.property, this.payload.value);
    this.markExecuted();
  }

  undo(): void {
    this.timeline.setTrackProperty(
      this.payload.trackId,
      this.payload.property,
      this.payload.previousValue
    );
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Canvas Resize Command
export class CanvasResizeCommand extends BaseCommand {
  private payload: CanvasResizePayload;
  private canvas: {
    getSettings: () => { width: number; height: number };
    setSettings: (settings: { width: number; height: number }) => void;
  };

  constructor(
    canvas: {
      getSettings: () => { width: number; height: number };
      setSettings: (settings: { width: number; height: number }) => void;
    },
    payload: CanvasResizePayload
  ) {
    super([]);
    this.canvas = canvas;
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.CANVAS_RESIZE;
  }

  getPayload(): CanvasResizePayload {
    return this.payload;
  }

  execute(): void {
    this.canvas.setSettings({ width: this.payload.newWidth, height: this.payload.newHeight });
    this.markExecuted();
  }

  undo(): void {
    this.canvas.setSettings({ width: this.payload.oldWidth, height: this.payload.oldHeight });
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Set Canvas Background Command
export class SetCanvasBackgroundCommand extends BaseCommand {
  private payload: SetCanvasBackgroundPayload;
  private canvas: {
    getSettings: () => {
      backgroundType: string;
      backgroundColor: string;
      backgroundGradient: unknown;
      backgroundImage: string | null;
      backgroundBlur: number;
    };
    setSettings: (settings: {
      backgroundType: string;
      backgroundColor: string;
      backgroundGradient: unknown;
      backgroundImage: string | null;
      backgroundBlur: number;
    }) => void;
  };
  private previousSettings: {
    backgroundType: string;
    backgroundColor: string;
    backgroundGradient: unknown;
    backgroundImage: string | null;
    backgroundBlur: number;
  } | null = null;

  constructor(
    canvas: {
      getSettings: () => {
        backgroundType: string;
        backgroundColor: string;
        backgroundGradient: unknown;
        backgroundImage: string | null;
        backgroundBlur: number;
      };
      setSettings: (settings: {
        backgroundType: string;
        backgroundColor: string;
        backgroundGradient: unknown;
        backgroundImage: string | null;
        backgroundBlur: number;
      }) => void;
    },
    payload: SetCanvasBackgroundPayload
  ) {
    super([]);
    this.canvas = canvas;
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SET_CANVAS_BACKGROUND;
  }

  getPayload(): SetCanvasBackgroundPayload {
    return this.payload;
  }

  execute(): void {
    this.previousSettings = this.canvas.getSettings();
    this.canvas.setSettings({
      backgroundType: this.payload.type,
      backgroundColor: this.payload.color ?? '',
      backgroundGradient: this.payload.gradient ?? null,
      backgroundImage: this.payload.image ?? null,
      backgroundBlur: this.payload.blur ?? 0,
    });
    this.markExecuted();
  }

  undo(): void {
    if (!this.previousSettings) return;
    this.canvas.setSettings(this.previousSettings);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Set Canvas Transform Command
export class SetCanvasTransformCommand extends BaseCommand {
  private payload: SetCanvasTransformPayload;
  private canvas: {
    getSettings: () => { zoom: number; panX: number; panY: number };
    setSettings: (settings: { zoom: number; panX: number; panY: number }) => void;
  };
  private previousSettings: { zoom: number; panX: number; panY: number } | null = null;

  constructor(
    canvas: {
      getSettings: () => { zoom: number; panX: number; panY: number };
      setSettings: (settings: { zoom: number; panX: number; panY: number }) => void;
    },
    payload: SetCanvasTransformPayload
  ) {
    super([]);
    this.canvas = canvas;
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SET_CANVAS_TRANSFORM;
  }

  getPayload(): SetCanvasTransformPayload {
    return this.payload;
  }

  execute(): void {
    this.previousSettings = this.canvas.getSettings();
    this.canvas.setSettings({
      zoom: this.payload.zoom,
      panX: this.payload.panX,
      panY: this.payload.panY,
    });
    this.markExecuted();
  }

  undo(): void {
    if (!this.previousSettings) return;
    this.canvas.setSettings(this.previousSettings);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Set Current Frame Command
export class SetCurrentFrameCommand extends BaseCommand {
  private payload: SetCurrentFramePayload;
  private timeline: { getCurrentFrame: () => number; setCurrentFrame: (frame: number) => void };

  constructor(
    timeline: { getCurrentFrame: () => number; setCurrentFrame: (frame: number) => void },
    payload: SetCurrentFramePayload
  ) {
    super([]);
    this.timeline = timeline;
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SET_CURRENT_FRAME;
  }

  getPayload(): SetCurrentFramePayload {
    return this.payload;
  }

  execute(): void {
    this.timeline.setCurrentFrame(this.payload.frame);
    this.markExecuted();
  }

  undo(): void {
    this.timeline.setCurrentFrame(this.payload.previousFrame);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Set Zoom Command
export class SetZoomCommand extends BaseCommand {
  private payload: SetZoomPayload;
  private timeline: { getZoom: () => number; setZoom: (zoom: number) => void };

  constructor(
    timeline: { getZoom: () => number; setZoom: (zoom: number) => void },
    payload: SetZoomPayload
  ) {
    super([]);
    this.timeline = timeline;
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SET_ZOOM;
  }

  getPayload(): SetZoomPayload {
    return this.payload;
  }

  execute(): void {
    this.timeline.setZoom(this.payload.zoom);
    this.markExecuted();
  }

  undo(): void {
    this.timeline.setZoom(this.payload.previousZoom);
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Set In Point Command
export class SetInPointCommand extends BaseCommand {
  private payload: SetInPointPayload;
  private timeline: { getInPoint: () => number | null; setInPoint: (frame: number) => void };

  constructor(
    timeline: { getInPoint: () => number | null; setInPoint: (frame: number) => void },
    payload: SetInPointPayload
  ) {
    super([]);
    this.timeline = timeline;
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SET_IN_POINT;
  }

  getPayload(): SetInPointPayload {
    return this.payload;
  }

  execute(): void {
    this.timeline.setInPoint(this.payload.frame);
    this.markExecuted();
  }

  undo(): void {
    if (this.payload.previousFrame === null) {
      this.timeline.setInPoint(-1); // Clear in point
    } else {
      this.timeline.setInPoint(this.payload.previousFrame);
    }
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Set Out Point Command
export class SetOutPointCommand extends BaseCommand {
  private payload: SetOutPointPayload;
  private timeline: { getOutPoint: () => number | null; setOutPoint: (frame: number) => void };

  constructor(
    timeline: { getOutPoint: () => number | null; setOutPoint: (frame: number) => void },
    payload: SetOutPointPayload
  ) {
    super([]);
    this.timeline = timeline;
    this.payload = payload;
  }

  getType(): CommandType {
    return CommandType.SET_OUT_POINT;
  }

  getPayload(): SetOutPointPayload {
    return this.payload;
  }

  execute(): void {
    this.timeline.setOutPoint(this.payload.frame);
    this.markExecuted();
  }

  undo(): void {
    if (this.payload.previousFrame === null) {
      this.timeline.setOutPoint(-1); // Clear out point
    } else {
      this.timeline.setOutPoint(this.payload.previousFrame);
    }
    this.markUnExecuted();
  }

  redo(): void {
    this.execute();
  }
}

// Register all commands for deserialization
import { registerCommand } from './history-manager';

registerCommand(
  CommandType.SPLIT_CLIP,
  SplitClipCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.JOIN_CLIPS,
  JoinClipsCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.DELETE_CLIP,
  DeleteClipCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.DELETE_REGION,
  DeleteRegionCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.TRIM_CLIP,
  TrimClipCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.MOVE_CLIP,
  MoveClipCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.DUPLICATE_CLIP,
  DuplicateClipCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.SET_CLIP_PROPERTY,
  SetClipPropertyCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.ADD_TRACK,
  AddTrackCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.REMOVE_TRACK,
  RemoveTrackCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.REORDER_TRACKS,
  ReorderTracksCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.SET_TRACK_PROPERTY,
  SetTrackPropertyCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.CANVAS_RESIZE,
  CanvasResizeCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.SET_CANVAS_BACKGROUND,
  SetCanvasBackgroundCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.SET_CANVAS_TRANSFORM,
  SetCanvasTransformCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.SET_CURRENT_FRAME,
  SetCurrentFrameCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.SET_ZOOM,
  SetZoomCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.SET_IN_POINT,
  SetInPointCommand as unknown as new (...args: unknown[]) => BaseCommand
);
registerCommand(
  CommandType.SET_OUT_POINT,
  SetOutPointCommand as unknown as new (...args: unknown[]) => BaseCommand
);
