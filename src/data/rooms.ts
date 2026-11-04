import { RoomDestination, RoomId } from '../types/apartment';

/**
 * Exact 7 Room Navigation Destinations matching the reference floor plan:
 * - Upper-Left: Bedroom 1 – Studio (X: -9.0..-2.6, Z: -6.5..0.0)
 * - Upper-Middle: Balcony (X: -2.6..+3.0, Z: -6.5..-4.2)
 * - Upper-Right: Bedroom 2 (X: +3.0..+9.0, Z: -6.5..-1.0)
 * - Lower-Left: Bedroom 3 (X: -9.0..-2.6, Z: 0.0..+6.5)
 * - Central Area: Living Room (X: -2.6..+3.0, Z: -4.2..+6.5)
 * - Lower-Right: Kitchen and Dining Area (X: +2.6..+9.0, Z: -1.0..+6.5)
 */
export const ROOM_DESTINATIONS: RoomDestination[] = [
  {
    id: 'overview',
    label: 'Full Apartment Overview',
    shortLabel: 'Overview',
    areaSqm: 234.0,
    subtitle: 'Three-Bedroom Residence · Complete Spatial Layout',
    labelCenter: [0, 0.2, 0],
    cameraPosition: [0.2, 15.2, 13.8],
    cameraTarget: [0.0, 0.5, -0.2],
    walkPosition: [-1.2, 1.65, 2.2],
    walkTarget: [0.2, 1.5, -2.5],
  },
  {
    id: 'studio',
    label: 'Studio Bedroom',
    shortLabel: 'Studio',
    areaSqm: 41.6,
    subtitle: 'Bedroom 1 (Upper-Left) · Dual White PC Studio & 85" TV',
    labelCenter: [-5.8, 1.35, -3.2],
    cameraPosition: [-3.25, 2.05, -0.85],
    cameraTarget: [-6.35, 1.18, -3.85],
    walkPosition: [-3.4, 1.65, -0.9],
    walkTarget: [-6.4, 1.45, -3.9],
  },
  {
    id: 'balcony',
    label: 'Balcony',
    shortLabel: 'Balcony',
    areaSqm: 12.9,
    subtitle: 'Upper-Middle Loggia · Between Bedroom 1 & Bedroom 2',
    labelCenter: [0.2, 1.25, -5.35],
    cameraPosition: [-1.65, 1.85, -4.65],
    cameraTarget: [1.35, 1.15, -5.65],
    walkPosition: [0.0, 1.65, -5.1],
    walkTarget: [0.5, 1.45, -6.2],
  },
  {
    id: 'bedroom2',
    label: 'Bedroom 2',
    shortLabel: 'Bedroom 2',
    areaSqm: 33.0,
    subtitle: 'Upper-Right Suite · Minimalist Queen Bed & Indirect Light',
    labelCenter: [6.0, 1.35, -3.75],
    cameraPosition: [3.65, 1.98, -1.65],
    cameraTarget: [6.85, 1.1, -4.2],
    walkPosition: [3.85, 1.65, -1.75],
    walkTarget: [6.8, 1.4, -4.2],
  },
  {
    id: 'bedroom3',
    label: 'Bedroom 3',
    shortLabel: 'Bedroom 3',
    areaSqm: 41.6,
    subtitle: 'Lower-Left Suite · Japandi Oak Bed & Bouclé Reading Nook',
    labelCenter: [-5.8, 1.35, 3.25],
    cameraPosition: [-3.25, 1.98, 1.15],
    cameraTarget: [-6.45, 1.1, 4.15],
    walkPosition: [-3.4, 1.65, 1.1],
    walkTarget: [-6.4, 1.4, 4.1],
  },
  {
    id: 'living',
    label: 'Living Room',
    shortLabel: 'Living Room',
    areaSqm: 56.9,
    subtitle: 'Central Salon · Connects Balcony, Bedrooms & Kitchen',
    labelCenter: [0.2, 1.35, -1.2],
    cameraPosition: [-1.45, 2.05, 1.35],
    cameraTarget: [1.35, 1.15, -2.35],
    walkPosition: [-1.3, 1.65, 0.9],
    walkTarget: [1.4, 1.4, -2.4],
  },
  {
    id: 'kitchen',
    label: 'Kitchen and Dining Area',
    shortLabel: 'Kitchen & Dining',
    areaSqm: 48.0,
    subtitle: 'Lower-Right Culinary Hall · Marble Island & 6-Seater Dining',
    labelCenter: [5.8, 1.35, 2.8],
    cameraPosition: [2.15, 2.1, 0.65],
    cameraTarget: [6.45, 1.1, 3.85],
    walkPosition: [2.5, 1.65, 1.2],
    walkTarget: [6.4, 1.35, 3.8],
  },
];

export const DOLLHOUSE_CAMERA = {
  position: [12.5, 14.8, 14.2] as [number, number, number],
  target: [0.0, 0.4, 0.2] as [number, number, number],
};

export function getRoomById(id: RoomId): RoomDestination {
  return ROOM_DESTINATIONS.find((r) => r.id === id) || ROOM_DESTINATIONS[0];
}
