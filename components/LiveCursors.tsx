import { useCtx } from "components/hooks/useCtx"
import { PresenceChannel } from "pusher-js"
import React from "react"
import styled from "styled-components"
import { Client, Shape } from "types"
import { throttle } from "utils/throttle"
import { RenderedShape } from "./RenderedShape"

interface ClientMetadata {
  user_id: string
}

const updateOnPointerMove = throttle(
  (channel: PresenceChannel, point: number[]) => {
    channel.trigger("client-moved", {
      point,
    })
  },
  100
)

interface LiveCursorsProps {
  shapes: [string, Shape][]
}

export function LiveCursors({ shapes }: LiveCursorsProps) {
  const { roomId, channel } = useCtx()

  const [tempShapes, setTempShapes] = React.useState<Record<string, Shape>>({})
  const [clients, setClients] = React.useState<Record<string, Client>>({})

  React.useEffect(() => {
    let clients: Record<string, Client> = {}

    channel.members.each((member: { id: string; info: Client }) => {
      clients[member.id] = {
        id: member.id,
        point: [0, 0],
        ...member.info,
      }
    })

    setClients(clients)

    function handleUserMove(
      data: { point: number[] },
      metadata: ClientMetadata
    ) {
      setClients((clients) => ({
        ...clients,
        [metadata.user_id]: {
          ...clients[metadata.user_id],
          point: data.point,
        },
      }))
    }

    function handleUserTempShapeChange(
      data: { tempShape: Shape },
      metadata: ClientMetadata
    ) {
      if (!data.tempShape) return

      setTempShapes((tempShapes) => {
        return {
          ...tempShapes,
          [`${roomId}/shape/${data.tempShape.id}`]: data.tempShape,
        }
      })
    }

    setTempShapes({})

    channel.bind("client-moved", handleUserMove)
    channel.bind("client-changed-temp-shape", handleUserTempShapeChange)

    return () => {
      channel.unbind("client-moved", handleUserMove)
      channel.unbind("client-changed-temp-shape", handleUserTempShapeChange)
    }
  }, [channel, roomId])

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<SVGSVGElement>) =>
      updateOnPointerMove(channel, [e.clientX, e.clientY]),
    [channel]
  )

  React.useEffect(() => {
    setTempShapes((tempShapes) => {
      const next = { ...tempShapes }
      shapes.forEach(([id]) => {
        if (next[id]) delete next[id]
      })

      return next
    })
  }, [shapes])

  return (
    <CursorOverlay onPointerMove={handlePointerMove}>
      {Object.entries(clients).map(([id, client]) => (
        <circle
          key={id + "cursor"}
          cx={client.point[0]}
          cy={client.point[1]}
          r={3}
          fill={client.color}
        />
      ))}
      <g>
        {Object.values(tempShapes).map((shape) => (
          <RenderedShape key={shape.id} shape={shape} />
        ))}
      </g>
    </CursorOverlay>
  )
}

const CursorOverlay = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  touch-action: none;
`
