import { WriteTransaction } from "replicache"
import { Mutation, Shape } from "types"

type Mutators = {
  [K in Mutation["name"]]: (
    tx: WriteTransaction,
    args: Mutation["args"]
  ) => Promise<void>
}

export const mutators: Mutators = {
  createShape: async (tx, shape: Shape) => {
    await tx.put(`shape/${shape.id}`, shape)
  },

  deleteShape: async (tx, id: string) => {
    await tx.del(`shape/${id}`)
  },

  updateShape: async (tx, changes: Partial<Shape>) => {
    const prev = (await tx.get(`shape/${changes.id}`)) as Shape
    await tx
      .put(`shape/${changes.id}`, { ...prev, ...changes })
      .catch(console.warn)
  },
}
