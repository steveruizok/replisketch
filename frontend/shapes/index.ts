import { Shape, ShapeType } from "types"
import { Dot } from "./Dot"
import { Line } from "./Line"
import { ShapeUtil } from "./ShapeUtil"

/**
 * A mapping of shape types and their corresponding utilities
 */
export const shapeUtils: Record<ShapeType, ShapeUtil<Shape>> = {
  [ShapeType.Dot]: new Dot(),
  [ShapeType.Line]: new Line(),
}

/**
 * Get a shape utility by type.
 * @param type ShapeType
 */
export function getShapeUtils<T extends Shape>(
  type: T | T["type"]
): ShapeUtil<T> {
  return (
    typeof type === "string" ? shapeUtils[type] : shapeUtils[type["type"]]
  ) as ShapeUtil<T>
}
