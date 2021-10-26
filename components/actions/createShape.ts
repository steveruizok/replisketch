import { ActionCtx, Shape } from "types"

export async function createShape(this: ActionCtx, shape: Shape) {
  this.rep.mutate.createShape({ roomId: this.roomId, shape })
  return shape
}
