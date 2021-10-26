import { ActionCtx, Shape } from "types"

export async function createShape(this: ActionCtx, shape: Shape) {
  this.live.get("shapes").push(shape)
  return shape
}
