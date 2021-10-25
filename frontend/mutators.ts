import { WriteTransaction } from "replicache"
import { Mutation, Shape } from "types"

type MutMap = {
  [K in Mutation["name"]]: (
    tx: WriteTransaction,
    args: Extract<Mutation, { name: K }>["args"]
  ) => Promise<void>
}

export const mutators: MutMap = {
  createShape: async (tx, shape) => {
    await tx.put(`shape/${shape.id}`, shape)
  },

  updateShape: async (tx, changes: Partial<Shape>) => {
    const prev = (await tx.get(`shape/${changes.id}`)) as Shape
    await tx
      .put(`shape/${changes.id}`, { ...prev, ...changes })
      .catch(console.warn)
  },

  deleteShape: async (tx, id: string) => {
    await tx.del(`shape/${id}`)
  },
}
