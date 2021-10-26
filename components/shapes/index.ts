import { Shape, ShapeType } from "types"
import { ShapeUtil } from "./ShapeUtil"
import { Dot } from "./Dot"
import { Draw } from "./Draw"
import { Rect } from "./Rect"

/**
 * A mapping of shape types and their corresponding utilities
 */
export const shapeUtils: {
  [K in ShapeType]: ShapeUtil<Extract<Shape, { type: K }>>
} = {
  [ShapeType.Dot]: new Dot(),
  [ShapeType.Draw]: new Draw(),
  [ShapeType.Rect]: new Rect(),
}

/**
 * Get a shape utility by type.
 * @param type ShapeType | Shape
 */
export function getShapeUtils<T extends Shape>(type: T | T["type"]) {
  return (
    typeof type === "string" ? shapeUtils[type] : shapeUtils[type.type]
  ) as ShapeUtil<T>
}
