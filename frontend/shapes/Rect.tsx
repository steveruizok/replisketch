import { nanoid } from "nanoid"
import { RectShape, ShapeType } from "types"
import { ShapeUtil } from "./ShapeUtil"
import { rep } from "frontend/replicache"
import { getBoundsFromTwoPoints } from "utils/bounds"
import Vec from "@tldraw/vec"

export class Rect extends ShapeUtil<RectShape> {
  type = ShapeType.Rect as const

  defaultShape() {
    const order = rep.scan({ prefix: "shape/" }).keys.length

    return {
      id: nanoid(),
      type: this.type,
      point: [0, 0],
      size: [100, 100],
      childIndex: order,
    }
  }

  Component({ shape }: { shape: RectShape }) {
    const [x, y] = shape.point
    const [w, h] = shape.size
    return (
      <path
        d={`M ${x},${y} h ${w} v ${h} h ${-w}  Z`}
        stroke="black"
        strokeWidth={5}
        rx={4}
        fill="none"
      />
    )
  }

  getBounds(shape: RectShape) {
    return getBoundsFromTwoPoints(shape.point, Vec.add(shape.point, shape.size))
  }
}
