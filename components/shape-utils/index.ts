import { ShapeUtils } from "./ShapeUtils"
import { Shape, ShapeType } from "types"

export * from "./ShapeUtils"
export * from "./DotUtils"
export * from "./DrawUtils"
export * from "./RectUtils"

export type ShapeUtilsMap = {
  [K in ShapeType]: ShapeUtils<Extract<Shape, { type: K }>>
}

export type GetShapeUtils = <T extends Shape>(
  type: T | T["type"]
) => ShapeUtils<T>
