import { ActionCtx } from "types"
import { deleteAllShapes } from "./deleteAllShapes"
import { deleteShapesAtPoint } from "./deleteShapesAtPoint"

export function getActions(actionCtx: ActionCtx) {
  return {
    deleteAllShapes: deleteAllShapes.bind(actionCtx),
    deleteShapesAtPoint: deleteShapesAtPoint.bind(actionCtx),
  }
}
