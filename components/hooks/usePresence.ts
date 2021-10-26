import { Presence, User } from "@liveblocks/client"
import React from "react"
import { Client } from "types"
import { useCtx } from "./useCtx"

export function usePresence() {
  const { room } = useCtx()
  const [others, setOthers] = React.useState<User<Client>[]>([])

  React.useEffect(() => {
    function handleOtherChange(client: Presence) {
      setOthers(client.toArray())
    }

    room.subscribe("others", handleOtherChange)

    return () => {
      room.unsubscribe("others", handleOtherChange)
    }
  }, [room])

  return others
}
