import { ActionCtx, Shape } from "types"

export async function deleteAllShapes(this: ActionCtx) {
  const shapes = await this.rep
    .scan({ prefix: `${this.roomId}/shape/` })
    .values()
    .toArray()

  shapes.forEach((shape: Shape) => {
    this.rep.mutate.deleteShape({ roomId: this.roomId, id: shape.id })
  })
}
