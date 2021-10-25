import { nanoid } from "nanoid"
import { LineShape, ShapeType } from "types"
import { ShapeUtil } from "./ShapeUtil"
import { rep } from "frontend/replicache"
import { getSvgPathFromStroke } from "utils/getSvgPathFromStroke"
import getStroke from "perfect-freehand"
import { getBoundsFromPoints } from "utils/bounds"

export class Line extends ShapeUtil<LineShape> {
  type = ShapeType.Line as const

  defaultShape() {
    const order = rep.scan({ prefix: "shape/" }).keys.length

    return {
      id: nanoid(),
      type: this.type,
      points: [],
      childIndex: order,
    }
  }

  render({ shape }: { shape: LineShape }) {
    return (
      <path
        d={getSvgPathFromStroke(getStroke(this.getPairs(shape)))}
        fill="black"
      />
    )
  }

  getBounds(shape: LineShape) {
    return getBoundsFromPoints(this.getPairs(shape))
  }

  private getPairs(shape: LineShape) {
    const { points } = shape

    const pairs: number[][] = []

    for (let i = 0; i < points.length; i += 2) {
      pairs.push([points[i], points[i + 1]])
    }

    return pairs
  }
}
