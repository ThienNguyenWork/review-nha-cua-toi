export enum CameraMode {
  FreeFly = 'free-fly',
  Walk = 'walk',
  Orbit = 'orbit',
}

export enum QualityLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Ultra = 'Ultra',
}

export type ViewExperience = 'interior' | 'dollhouse' | 'cutaway';

export interface CutawayConfig {
  showCeiling: boolean;
  showExteriorWalls: boolean;
  showInteriorWalls: boolean;
}

export type RoomId =
  | 'overview'
  | 'studio'
  | 'balcony'
  | 'bedroom2'
  | 'bedroom3'
  | 'living'
  | 'kitchen';

export interface RoomDestination {
  id: RoomId;
  label: string;
  shortLabel: string;
  areaSqm: number;
  subtitle: string;
  labelCenter: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  walkPosition: [number, number, number];
  walkTarget: [number, number, number];
}

export interface FurnitureItemInfo {
  id: string;
  name: string;
  category: string;
  room: RoomId;
  roomLabel: string;
  material: string;
  dimensions: string;
  description: string;
  focusTarget: [number, number, number];
  orbitOffset: [number, number, number];
}

export interface CameraTransitionRequest {
  id: number;
  position: [number, number, number];
  target: [number, number, number];
  switchMode?: CameraMode;
}

export interface AABB2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  label?: string;
}

export type LightingMood = 'daylight' | 'golden-hour' | 'evening';
