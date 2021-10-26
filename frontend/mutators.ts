import { Mutators, Shape } from "types"

export const mutators: Mutators = {
  createShape: async (tx, { roomId, shape }) => {
    await tx.put(`${roomId}/shape/${shape.id}`, shape).catch(console.warn)
  },

  updateShape: async (tx, { id, roomId, changes }) => {
    const prev = (await tx.get(`${roomId}/${changes}`)) as Shape
    await tx
      .put(`${roomId}/shape/${id}`, { ...prev, ...changes })
      .catch(console.warn)
  },

  deleteShape: async (tx, { roomId, id }) => {
    await tx.del(`${roomId}/shape/${id}`).catch(console.warn)
  },
}
