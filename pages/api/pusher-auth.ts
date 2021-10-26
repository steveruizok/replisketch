import { pusher } from "backend/pusher"
import { nanoid } from "nanoid"
import { NextApiHandler, NextApiRequest } from "next"
import { Client } from "types"

interface PushAuthRequest extends NextApiRequest {
  body: {
    socket_id: string
    channel_name: string
  }
}

const PushAuthHandler: NextApiHandler = (req: PushAuthRequest, res) => {
  const { socket_id, channel_name } = req.body

  const client: Client = {
    id: nanoid(),
    color: "black",
    point: [0, 0],
    tempShape: null,
  }

  res.send(
    pusher.authenticate(socket_id, channel_name, {
      user_id: client.id,
      user_info: client,
    })
  )
}

export default PushAuthHandler
