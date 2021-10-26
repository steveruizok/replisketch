import { NextApiHandler, NextApiRequest } from "next"
import { supabase } from "backend/db"
import { Mutation } from "types"
import { pusher } from "backend/pusher"
import { handleMutation } from "backend/mutations"

interface PushRequest extends NextApiRequest {
  body: {
    clientID: string
    mutations: Mutation[]
  }
}

const PushHandler: NextApiHandler = async (req: PushRequest, res) => {
  const { clientID, mutations } = req.body
  const { roomId } = req.query

  try {
    const version = await getMaximumVersion()

    let lastMutationID = await getLastMutationId(clientID)

    for (const mutation of mutations) {
      const expectedMutationID = lastMutationID + 1

      // If the mutation has already been processed, skip it
      if (mutation.id < expectedMutationID) continue

      // If the mutation is from the future, abort
      if (mutation.id > expectedMutationID) break

      // The mutation has not been process and is from the past
      await handleMutation(mutation, version)

      lastMutationID = expectedMutationID
    }

    // Update the last mutation id
    await updateLastMutationID(clientID, lastMutationID)

    // Send a poke via Pusher so that other clients know to pull. We need
    // to await here otherwise, Next.js will frequently kill the request
    // and the poke won't get sent.
    await sendPoke(roomId.toString())

    res.status(200).end()
  } catch (e) {
    console.error(e)
    res.status(500).send(e.toString())
  }
}

async function getMaximumVersion() {
  const { count: version } = await supabase
    .from("shape")
    .select("version", { head: true, count: "exact" })

  return version
}

async function updateLastMutationID(clientID: string, lastMutationID: number) {
  await supabase
    .from("replicache_client")
    .update({ last_mutation_id: lastMutationID })
    .eq("id", clientID)
}

async function getLastMutationId(clientID: string) {
  // Get the last mutation ID
  const { body } = await supabase
    .from("replicache_client")
    .select("last_mutation_id")
    .eq("id", clientID)
    .single()

  if (body?.last_mutation_id) {
    return parseInt(body.last_mutation_id)
  }

  // If there wasn't a last mutation id, create one at zero

  await supabase
    .from("replicache_client")
    .insert({ id: clientID, last_mutation_id: "0" })

  return 0
}

async function sendPoke(roomId: string) {
  await pusher.trigger(roomId, "poke", {})
}

export default PushHandler
