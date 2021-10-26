import Vec from "@tldraw/vec"
import { ActionCtx, Shape } from "types"
import {
  boundsCollide,
  getBoundsFromTwoPoints,
  pointInBounds,
} from "utils/bounds"

export async function deleteShapesAtPoint(this: ActionCtx, point: number[]) {
  const eraser = getBoundsFromTwoPoints(
    Vec.sub(point, [16, 16]),
    Vec.add(point, [16, 16])
  )

  const shapes = this.live.get("shapes").toArray()

  shapes
    .filter((shape: Shape) => {
      const utils = this.getShapeUtils(shape.type)
      const bounds = utils.getBounds(shape)
      return boundsCollide(bounds, eraser) || pointInBounds(point, bounds)
    })
    .forEach((shape: Shape) => {
      this.live.get("shapes").delete(this.live.get("shapes").indexOf(shape))
    })
}
