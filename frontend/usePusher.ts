import * as React from "react"
import Pusher from "pusher-js"
import { rep } from "./replicache"

export function usePusher(channelName = "default") {
  React.useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
    })

    const channel = pusher.subscribe(channelName)

    channel.bind("poke", () => rep.pull())

    return () => {
      pusher.disconnect()
    }
  }, [channelName])
}
