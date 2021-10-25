import { nanoid } from "nanoid"
import { DotShape, ShapeType } from "types"
import { ShapeUtil } from "./ShapeUtil"
import { rep } from "frontend/replicache"
import { getBoundsAtPoint } from "utils/bounds"

export class Dot extends ShapeUtil<DotShape> {
  type = ShapeType.Dot as const

  defaultShape() {
    const order = rep.scan({ prefix: "shape/" }).keys.length

    return {
      id: nanoid(),
      type: this.type,
      x: 0,
      y: 0,
      order,
      childIndex: order,
    }
  }

  render({ shape }: { shape: DotShape }) {
    const { x, y } = shape

    return <circle cx={x} cy={y} r={8} fill="black" />
  }

  getBounds(shape: DotShape) {
    return getBoundsAtPoint([shape.x, shape.y], 16)
  }
}
