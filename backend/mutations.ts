import { Mutation } from "types"
import { supabase } from "./db"

export async function handleMutation(mutation: Mutation, version: number) {
  switch (mutation.name) {
    case "createShape": {
      const { roomId, shape } = mutation.args

      await supabase.from("shape").insert({
        id: shape.id,
        shape,
        version,
        deleted: false,
        room_id: roomId,
      })

      break
    }
    case "deleteShape": {
      const { roomId, id } = mutation.args

      await supabase
        .from("shape")
        .update({
          deleted: true,
        })
        .match({ room_id: roomId, id })

      break
    }
    case "updateShape": {
      const { roomId, id, changes } = mutation.args

      await supabase
        .from("shape")
        .update(changes)
        .match({ room_id: roomId, id })

      break
    }
    default:
      throw new Error(`Unknown mutation.`)
  }
}
