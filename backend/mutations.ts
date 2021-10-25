import { Mutation } from "types"
import { supabase } from "./db"

export async function handleMutation(mutation: Mutation, version: number) {
  switch (mutation.name) {
    case "createShape": {
      const shape = mutation.args

      await supabase.from("shape").insert({
        id: shape.id,
        shape,
        version,
        deleted: false,
      })

      break
    }
    case "deleteShape": {
      const id = mutation.args

      await supabase
        .from("shape")
        .update({
          deleted: true,
        })
        .match({ id })

      break
    }
    case "updateShape": {
      const partial = mutation.args

      await supabase.from("shape").update(partial).match({ id: partial.id })

      break
    }
    default:
      throw new Error(`Unknown mutation.`)
  }
}
