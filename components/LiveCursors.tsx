import { useCtx } from "components/hooks/useCtx"
import React from "react"
import styled from "styled-components"
import { Client, Shape } from "types"

interface LiveCursorsProps {
  shapes: [string, Shape][]
}

export function LiveCursors({ shapes }: LiveCursorsProps) {
  const { roomId, channel } = useCtx()

  const [clients, setClients] = React.useState<Record<string, Client>>({})

  React.useEffect(() => {
    let clients: Record<string, Client> = {}

    channel.members.each((member: { id: string; info: Client }) => {
      clients[member.id] = member.info
    })

    setClients(clients)

    return () => {}
  }, [channel, roomId])

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {},
    []
  )

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
    </CursorOverlay>
  )
}

const CursorOverlay = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  touch-action: none;
`
