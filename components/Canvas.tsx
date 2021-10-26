import * as React from "react"
import styled from "styled-components"
import { Shape } from "types"
import { useShapes } from "./hooks/useShapes"
import { LiveCursors } from "./LiveCursors"
import { RenderedShape } from "./RenderedShape"

interface CanvasProps {
  tempShape?: Shape | void
  children?: React.ReactNode
}

export const Canvas = React.memo(function Canvas({ tempShape }: CanvasProps) {
  const { shapes } = useShapes()

  return (
    <>
      <Svg>
        <g transform={`translate(0,0)`}>
          <g id="shapes">
            {shapes.map((shape) => (
              <RenderedShape key={shape.id} shape={shape} />
            ))}
          </g>
          {tempShape && <RenderedShape shape={tempShape} />}
        </g>
      </Svg>
      <LiveCursors />
    </>
  )
})

const Svg = styled.svg`
  background-color: rgb(248, 249, 250);
  width: 100%;
  height: 100%;
`
