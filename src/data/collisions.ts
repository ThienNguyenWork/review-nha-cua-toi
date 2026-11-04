import { AABB2D } from '../types/apartment';

/**
 * Exact 2D Collision Map for the Reference Floor Plan (18.0m × 13.0m, X: -9..+9, Z: -6.5..+6.5):
 * - Bedroom 1 (Studio, Upper-Left): X -9.0..-2.6, Z -6.5..0.0 | Door at X = -2.6, Z = -1.45..-0.25
 * - Balcony (Upper-Middle): X -2.6..+3.0, Z -6.5..-4.2 | Glass Sliding Door at Z = -4.2, X = -1.5..+1.5
 * - Bedroom 2 (Upper-Right): X +3.0..+9.0, Z -6.5..-1.0 | Door at Z = -1.0, X = +3.3..+4.45
 * - Bedroom 3 (Lower-Left): X -9.0..-2.6, Z 0.0..+6.5 | Door at X = -2.6, Z = +0.4..+1.55
 * - Living Room (Central): X -2.6..+3.0, Z -4.2..+6.5
 * - Kitchen & Dining (Lower-Right): X +2.6..+9.0, Z -1.0..+6.5
 */
export const WALL_COLLIDERS: AABB2D[] = [
  // Outer Perimeter Bounds
  { minX: -9.2, maxX: -2.55, minZ: -6.68, maxZ: -6.4, label: 'Bedroom 1 North Wall' },
  { minX: -2.65, maxX: 3.05, minZ: -6.68, maxZ: -6.42, label: 'Balcony North Glass Railing' },
  { minX: 2.95, maxX: 9.2, minZ: -6.68, maxZ: -6.4, label: 'Bedroom 2 North Wall' },

  { minX: -9.2, maxX: -8.88, minZ: -6.68, maxZ: 6.68, label: 'West Exterior Wall' },
  { minX: 8.88, maxX: 9.2, minZ: -6.68, maxZ: 6.68, label: 'East Exterior Wall' },
  { minX: -9.2, maxX: 9.2, minZ: 6.4, maxZ: 6.68, label: 'South Exterior Wall' },

  // Balcony Glass Partition Wall (Z = -4.2, X: -2.6..+3.0) with Wide Open Sliding Door at X = -1.5..+1.5
  { minX: -2.65, maxX: -1.5, minZ: -4.3, maxZ: -4.1, label: 'Balcony Glass Wall West' },
  { minX: 1.5, maxX: 3.05, minZ: -4.3, maxZ: -4.1, label: 'Balcony Glass Wall East' },

  // West Wing Spine Wall (X = -2.6, Z: -6.5..+6.5)
  // Door 1 (Studio): Z = -1.45 .. -0.25
  // Door 3 (Bedroom 3): Z = +0.40 .. +1.55
  { minX: -2.7, maxX: -2.5, minZ: -6.5, maxZ: -1.45, label: 'Studio East Wall' },
  { minX: -2.7, maxX: -2.5, minZ: -0.25, maxZ: 0.4, label: 'West Spine Center Pier' },
  { minX: -2.7, maxX: -2.5, minZ: 1.55, maxZ: 6.5, label: 'Bedroom 3 East Wall' },

  // Partition Between Bedroom 1 (Upper-Left) & Bedroom 3 (Lower-Left) at Z = 0.0 (X: -9.0..-2.6)
  { minX: -9.0, maxX: -2.6, minZ: -0.09, maxZ: 0.09, label: 'Bedroom 1 / Bedroom 3 Partition' },

  // Bedroom 2 West Wall (X = +3.0, Z: -6.5..-1.0)
  { minX: 2.91, maxX: 3.09, minZ: -6.5, maxZ: -1.0, label: 'Bedroom 2 West / Living Media Wall' },

  // Bedroom 2 South Wall (Z = -1.0, X: +3.0..+9.0) with Doorway at X = +3.3..+4.45
  { minX: 3.0, maxX: 3.3, minZ: -1.09, maxZ: -0.91, label: 'Bedroom 2 Door Pier West' },
  { minX: 4.45, maxX: 9.0, minZ: -1.09, maxZ: -0.91, label: 'Bedroom 2 / Kitchen Partition' },
];

export const FURNITURE_COLLIDERS: AABB2D[] = [
  // 3.1 Bedroom 1 – Studio (Upper-Left)
  { minX: -8.95, maxX: -6.65, minZ: -3.25, maxZ: -1.05, label: 'Studio King Bed' },
  { minX: -8.1, maxX: -4.2, minZ: -6.42, maxZ: -5.55, label: 'Studio Dual White PC Desks' },
  { minX: -6.5, maxX: -4.2, minZ: -0.68, maxZ: -0.05, label: 'Studio Wardrobe' },
  { minX: -3.15, maxX: -2.65, minZ: -3.35, maxZ: -1.6, label: 'Studio TV Console' },

  // 3.2 Balcony (Upper-Middle)
  { minX: 1.35, maxX: 2.75, minZ: -5.95, maxZ: -4.85, label: 'Balcony Lounge Seating' },

  // 3.3 Bedroom 2 (Upper-Right)
  { minX: 6.65, maxX: 8.95, minZ: -4.65, maxZ: -2.75, label: 'Bedroom 2 Queen Bed' },
  { minX: 3.05, maxX: 3.68, minZ: -5.85, maxZ: -3.6, label: 'Bedroom 2 Wardrobe' },

  // 3.4 Bedroom 3 (Lower-Left)
  { minX: -6.95, maxX: -4.85, minZ: 4.2, maxZ: 6.42, label: 'Bedroom 3 Japandi Bed' },
  { minX: -8.95, maxX: -8.3, minZ: 1.0, maxZ: 3.25, label: 'Bedroom 3 Wardrobe' },

  // 3.5 Living Room (Central Area)
  { minX: -1.35, maxX: -0.15, minZ: -3.65, maxZ: -0.85, label: 'Living Room Luxury Sofa' },
  { minX: 0.45, maxX: 1.45, minZ: -3.05, maxZ: -1.75, label: 'Living Room Coffee Table' },
  { minX: 2.38, maxX: 2.95, minZ: -3.75, maxZ: -1.15, label: 'Living Room TV Cabinet' },

  // 3.6 Kitchen & Dining Area (Lower-Right)
  { minX: 8.18, maxX: 8.98, minZ: -0.75, maxZ: 6.45, label: 'Kitchen East Counter & Appliances' },
  { minX: 4.5, maxX: 8.98, minZ: 5.75, maxZ: 6.48, label: 'Kitchen South Counter' },
  { minX: 5.85, maxX: 6.95, minZ: 1.65, maxZ: 4.35, label: 'Kitchen Waterfall Island' },
  { minX: 2.95, maxX: 4.15, minZ: 1.85, maxZ: 4.15, label: 'Dining Table' },
];

const ALL_COLLIDERS: AABB2D[] = [...WALL_COLLIDERS, ...FURNITURE_COLLIDERS];

function collidesAt(x: number, z: number, radius: number): boolean {
  if (x < -8.84 || x > 8.84 || z < -6.36 || z > 6.36) {
    return true;
  }

  for (let i = 0; i < ALL_COLLIDERS.length; i++) {
    const box = ALL_COLLIDERS[i];
    if (
      x + radius > box.minX &&
      x - radius < box.maxX &&
      z + radius > box.minZ &&
      z - radius < box.maxZ
    ) {
      return true;
    }
  }
  return false;
}

export function resolveWalkCollision(
  currentX: number,
  currentZ: number,
  targetX: number,
  targetZ: number,
  radius = 0.27,
): [number, number] {
  let resolvedX = currentX;
  let resolvedZ = currentZ;

  if (collidesAt(currentX, currentZ, radius)) {
    if (!collidesAt(targetX, targetZ, radius)) {
      return [targetX, targetZ];
    }
    return [
      Math.max(-8.6, Math.min(8.6, targetX)),
      Math.max(-6.1, Math.min(6.1, targetZ)),
    ];
  }

  if (!collidesAt(targetX, currentZ, radius)) {
    resolvedX = targetX;
  }
  if (!collidesAt(resolvedX, targetZ, radius)) {
    resolvedZ = targetZ;
  }

  return [resolvedX, resolvedZ];
}
