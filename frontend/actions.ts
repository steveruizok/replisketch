import Vec from "@tldraw/vec"
import { Shape } from "types"
import { rep } from "./replicache"
import { getShapeUtils } from "../components/shapes"
import {
  boundsCollide,
  getBoundsFromTwoPoints,
  pointInBounds,
} from "utils/bounds"

export async function deleteAllShapes() {
  const shapes = await rep.scan({ prefix: "shape/" }).values().toArray()

  shapes.forEach((shape: Shape) => {
    rep.mutate.deleteShape(shape.id)
  })
}

export async function deleteShapesAtPoint(point: number[]) {
  const eraser = getBoundsFromTwoPoints(
    Vec.sub(point, [16, 16]),
    Vec.add(point, [16, 16])
  )

  const shapes = await rep.scan({ prefix: "shape/" }).values().toArray()

  shapes
    .filter((shape: Shape) => {
      const utils = getShapeUtils(shape.type)
      const bounds = utils.getBounds(shape)
      return boundsCollide(bounds, eraser) || pointInBounds(point, bounds)
    })
    .forEach((shape: Shape) => {
      rep.mutate.deleteShape(shape.id)
    })
}
