import { nanoid } from "nanoid"
import { DrawShape, ShapeType } from "types"
import { ShapeUtils } from "./ShapeUtils"
import { getSvgPathFromStroke } from "utils/getSvgPathFromStroke"
import getStroke from "perfect-freehand"
import { getBoundsFromPoints } from "utils/bounds"

export class DrawUtils extends ShapeUtils<DrawShape> {
  type = ShapeType.Draw as const

  defaultShape() {
    return {
      id: nanoid(),
      type: this.type,
      point: [],
      points: [],
      childIndex: 1,
    }
  }

  Component({ shape }: { shape: DrawShape }) {
    return (
      <path d={getSvgPathFromStroke(getStroke(shape.points))} fill="black" />
    )
  }

  getBounds(shape: DrawShape) {
    return getBoundsFromPoints(shape.points)
  }
}
