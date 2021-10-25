import { nanoid } from "nanoid"
import { DrawShape, ShapeType } from "types"
import { ShapeUtil } from "./ShapeUtil"
import { rep } from "frontend/replicache"
import { getSvgPathFromStroke } from "utils/getSvgPathFromStroke"
import getStroke from "perfect-freehand"
import { getBoundsFromPoints } from "utils/bounds"

export class Draw extends ShapeUtil<DrawShape> {
  type = ShapeType.Draw as const

  defaultShape() {
    const order = rep.scan({ prefix: "shape/" }).keys.length

    return {
      id: nanoid(),
      type: this.type,
      points: [],
      childIndex: order,
    }
  }

  Component({ shape }: { shape: DrawShape }) {
    return (
      <path
        d={getSvgPathFromStroke(getStroke(this.getPairs(shape)))}
        fill="black"
      />
    )
  }

  getBounds(shape: DrawShape) {
    return getBoundsFromPoints(this.getPairs(shape))
  }

  private getPairs(shape: DrawShape) {
    const { points } = shape

    const pairs: number[][] = []

    for (let i = 0; i < points.length; i += 2) {
      pairs.push([points[i], points[i + 1]])
    }

    return pairs
  }
}
