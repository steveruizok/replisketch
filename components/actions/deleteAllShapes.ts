import { ActionCtx, Shape } from "types"

export async function deleteAllShapes(this: ActionCtx) {
  while (this.live.get("shapes").length) {
    this.live.get("shapes").delete(0)
  }
}
