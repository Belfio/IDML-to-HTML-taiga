/**
 * PathGeometryParser: Extract dimensions and shape from IDML PathGeometry
 *
 * IDML elements define their actual shape via PathGeometry > PathPointArray > PathPointType
 * The anchor points are in local coordinates (relative to the element's ItemTransform origin)
 *
 * Key Responsibilities:
 * - Parse PathPointArray anchors
 * - Calculate bounding box from anchor points
 * - Handle closed paths (rectangles, polygons) vs open paths (lines)
 * - Support Bezier curves via LeftDirection/RightDirection (future)
 */

import type { ElementProperties } from '../interfaces/spreadInterfaces';

/**
 * ParsedGeometry: Result of parsing PathGeometry
 */
export interface ParsedGeometry {
  // Bounding box (in IDML points, relative to element origin)
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  // Calculated dimensions in points
  width: number;
  height: number;

  // Center offset from element origin (ItemTransform position)
  // IDML PathGeometry is centered around the ItemTransform origin
  centerX: number;
  centerY: number;

  // Raw points for polygon rendering (in points)
  points: Array<{ x: number; y: number }>;

  // Path type
  isOpen: boolean;
}

/**
 * Parse PathGeometry from element Properties to extract dimensions and shape
 *
 * @param properties - The Properties array from an IDML element
 * @returns ParsedGeometry with dimensions and points, or null if no valid geometry
 */
export function parsePathGeometry(
  properties: ElementProperties[] | undefined
): ParsedGeometry | null {
  // Navigate the nested structure: Properties[0].PathGeometry[0].GeometryPathType[0].PathPointArray[0]
  if (!properties || properties.length === 0) {
    return null;
  }

  const pathGeometry = properties[0]?.PathGeometry;
  if (!pathGeometry || pathGeometry.length === 0) {
    return null;
  }

  const geometryPathType = pathGeometry[0]?.GeometryPathType;
  if (!geometryPathType || geometryPathType.length === 0) {
    return null;
  }

  const pathType = geometryPathType[0];
  const pathPointArray = pathType?.PathPointArray;
  if (!pathPointArray || pathPointArray.length === 0) {
    return null;
  }

  const pathPoints = pathPointArray[0]?.PathPointType;
  if (!pathPoints || pathPoints.length === 0) {
    return null;
  }

  // Determine if path is open (line) or closed (shape)
  const isOpen = pathType.$?.PathOpen === 'true';

  // Parse all anchor points
  const points: Array<{ x: number; y: number }> = [];

  for (const pt of pathPoints) {
    const anchorStr = pt.$?.Anchor;
    if (!anchorStr) continue;

    // Anchor format is "x y" (space-separated)
    const parts = anchorStr.split(' ').map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      points.push({ x: parts[0], y: parts[1] });
    }
  }

  if (points.length === 0) {
    return null;
  }

  // Calculate bounding box
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;

  // Center offset from ItemTransform origin
  // This is the geometric center of the shape
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX,
    centerY,
    points,
    isOpen,
  };
}

/**
 * Convert IDML points to Fabric polygon points
 * Normalizes coordinates to be relative to top-left of bounding box
 * This is needed because Fabric.Polygon expects points relative to (0,0)
 *
 * @param geometry - ParsedGeometry from parsePathGeometry
 * @returns Array of points normalized to top-left origin
 */
export function geometryToFabricPoints(
  geometry: ParsedGeometry
): Array<{ x: number; y: number }> {
  return geometry.points.map((pt) => ({
    x: pt.x - geometry.minX, // Shift to 0-based coordinates
    y: pt.y - geometry.minY,
  }));
}

/**
 * Check if a geometry represents a simple rectangle
 * (4 points forming right angles)
 *
 * @param geometry - ParsedGeometry to check
 * @returns true if the geometry is a simple rectangle
 */
export function isRectangularGeometry(geometry: ParsedGeometry): boolean {
  if (geometry.points.length !== 4 || geometry.isOpen) {
    return false;
  }

  // Check if all corners are at the bounding box edges
  // This is a simplified check - could be more thorough
  const { minX, minY, maxX, maxY, points } = geometry;

  const corners = [
    { x: minX, y: minY },
    { x: minX, y: maxY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
  ];

  // Each point should match one corner (allowing for floating point tolerance)
  const tolerance = 0.01;
  for (const pt of points) {
    const matchesCorner = corners.some(
      (c) => Math.abs(c.x - pt.x) < tolerance && Math.abs(c.y - pt.y) < tolerance
    );
    if (!matchesCorner) {
      return false;
    }
  }

  return true;
}

/**
 * Get line endpoints from geometry (for GraphicLine elements)
 *
 * @param geometry - ParsedGeometry from a line element
 * @returns Object with start and end points, or null if not a valid line
 */
export function getLineEndpoints(
  geometry: ParsedGeometry
): { start: { x: number; y: number }; end: { x: number; y: number } } | null {
  if (geometry.points.length < 2) {
    return null;
  }

  return {
    start: geometry.points[0],
    end: geometry.points[geometry.points.length - 1],
  };
}
