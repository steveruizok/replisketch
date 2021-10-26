import { useCtx } from "components/hooks/useCtx"
import React from "react"
import styled from "styled-components"
import { Shape } from "types"
import { usePresence } from "./hooks/usePresence"
import { RenderedShape } from "./RenderedShape"

export const LiveCursors = React.memo(function LiveCursors() {
  const { room } = useCtx()
  const clients = usePresence()

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      room.updatePresence({
        point: [e.clientX, e.clientY],
      })
    },
    [room]
  )

  return (
    <CursorOverlay onPointerMove={handlePointerMove}>
      {clients.map((client) => {
        if (!client.presence) return null
        return (
          <React.Fragment key={client.id}>
            <circle
              cx={client.presence.point[0]}
              cy={client.presence.point[1]}
              r={3}
              fill={client.presence.color}
            />
            {client.presence.tempShape && (
              <RenderedShape shape={client.presence.tempShape} />
            )}
          </React.Fragment>
        )
      })}
    </CursorOverlay>
  )
})

const CursorOverlay = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  touch-action: none;
`
