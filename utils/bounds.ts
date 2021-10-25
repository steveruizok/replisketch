import Vec from "@tldraw/vec"
import { Bounds } from "types"

/**
 * Create a bounding box at a point with a given dimension.
 * @param A
 * @param r
 */
export function getBoundsAtPoint(A: number[], r: number): Bounds {
  return getBoundsFromTwoPoints(Vec.sub(A, [r, r]), Vec.add(A, [r, r]))
}

/**
 * Find a bounding box from two points.
 * @param A
 * @param B
 */
export function getBoundsFromTwoPoints(A: number[], B: number[]): Bounds {
  const minX = Math.min(A[0], B[0]),
    minY = Math.min(A[1], B[1]),
    maxX = Math.max(A[0], B[0]),
    maxY = Math.max(A[1], B[1]),
    width = maxX - minX,
    height = maxY - minY,
    midX = minX + width / 2,
    midY = minX + height / 2

  return {
    minX,
    minY,
    midX,
    midY,
    maxX,
    maxY,
    width,
    height,
  }
}

/**
 * Find a bounding box from an array of points.
 * @param points
 */
export function getBoundsFromPoints(points: number[][]): Bounds {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  if (points.length < 2) {
    minX = 0
    minY = 0
    maxX = 1
    maxY = 1
  } else {
    for (const [x, y] of points) {
      minX = Math.min(x, minX)
      minY = Math.min(y, minY)
      maxX = Math.max(x, maxX)
      maxY = Math.max(y, maxY)
    }
  }

  const width = maxX - minX,
    height = maxY - minY,
    midX = minX + width / 2,
    midY = minX + height / 2

  return {
    minX,
    minY,
    midX,
    midY,
    maxX,
    maxY,
    width,
    height,
  }
}

/**
 * Get whether a point is inside of a bounds.
 * @param A
 * @param b
 * @returns
 */
export function pointInBounds(A: number[], b: Bounds): boolean {
  return !(A[0] < b.minX || A[0] > b.maxX || A[1] < b.minY || A[1] > b.maxY)
}

/**
 * Get whether two bounds collide.
 * @param a Bounds
 * @param b Bounds
 * @returns
 */
export function boundsCollide(a: Bounds, b: Bounds): boolean {
  return !(
    a.maxX < b.minX ||
    a.minX > b.maxX ||
    a.maxY < b.minY ||
    a.minY > b.maxY
  )
}

/**
 * Get whether the bounds of A contain the bounds of B. A perfect match will return true.
 * @param a Bounds
 * @param b Bounds
 * @returns
 */
export function boundsContain(a: Bounds, b: Bounds): boolean {
  return (
    a.minX < b.minX && a.minY < b.minY && a.maxY > b.maxY && a.maxX > b.maxX
  )
}
