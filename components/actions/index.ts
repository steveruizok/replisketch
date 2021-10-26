import { ActionCtx } from "types"
import { createShape } from "./createShape"
import { deleteAllShapes } from "./deleteAllShapes"
import { deleteShapesAtPoint } from "./deleteShapesAtPoint"

export function getActions(actionCtx: ActionCtx) {
  return {
    createShape: createShape.bind(actionCtx),
    deleteAllShapes: deleteAllShapes.bind(actionCtx),
    deleteShapesAtPoint: deleteShapesAtPoint.bind(actionCtx),
  }
}
