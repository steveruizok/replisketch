import { NextApiHandler } from "next"
import { supabase } from "backend/db"
import { Shape, ShapeData } from "types"

type Patch =
  | {
      op: "put"
      key: string
      value: Partial<Shape>
    }
  | {
      op: "del"
      key: string
    }

const PullHandler: NextApiHandler = async (req, res) => {
  const { clientID, cookie } = req.body

  const version = cookie?.body?.version ?? 0

  try {
    const lastMutationIdRes = await supabase
      .from("replicache_client")
      .select(`last_mutation_id`)
      .eq("id", clientID)
      .single()

    const lastMutationID = lastMutationIdRes.body?.last_mutation_id ?? 0

    let patch: Patch[] = []

    const { body: changedShapes } = await supabase
      .from("shape")
      .select()
      .gt("version", version)

    changedShapes.forEach((result: ShapeData) => {
      const key = `shape/${result.shape.id}`
      if (result.deleted) {
        patch.push({
          op: "del",
          key,
        })
      } else {
        patch.push({
          op: "put",
          key,
          value: result.shape,
        })
      }
    })

    // Get the maximum version from the table as the new cookie.
    const { body } = await supabase
      .from("shape")
      .select("version")
      .order("version", { ascending: false })
      .single()

    // Send the response.
    res.json({
      lastMutationID,
      patch,
      cookie: { version: body?.version || 0 },
    })

    res.end()
  } catch (e) {
    console.error(e)

    res.status(500).send(e.toString())
  }
}

export default PullHandler
