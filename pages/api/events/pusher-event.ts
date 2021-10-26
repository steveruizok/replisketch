import { pusher } from "backend/pusher"
import { NextApiHandler, NextApiRequest } from "next"
import Pusher from "pusher"

interface PusherRequest extends NextApiRequest {
  body: {
    message: string
    sender: string
  }
}

const PusherEventHandler: NextApiHandler = async (req: PusherRequest, res) => {
  const { message, sender } = req.body

  await pusher.trigger("chat", "some-event", {
    message,
    sender,
  })

  res.json({ message: "completed" })
}

export default PusherEventHandler
