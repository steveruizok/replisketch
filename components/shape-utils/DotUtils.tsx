import { nanoid } from "nanoid"
import { DotShape, ShapeType } from "types"
import { ShapeUtils } from "./ShapeUtils"
import { getBoundsAtPoint } from "utils/bounds"

export class DotUtils extends ShapeUtils<DotShape> {
  type = ShapeType.Dot as const

  defaultShape() {
    return {
      id: nanoid(),
      type: this.type,
      point: [0, 0],
      childIndex: 1,
    }
  }

  Component({ shape }: { shape: DotShape }) {
    const [x, y] = shape.point

    return <circle cx={x} cy={y} r={8} fill="black" />
  }

  getBounds(shape: DotShape) {
    return getBoundsAtPoint(shape.point, 16)
  }
}
