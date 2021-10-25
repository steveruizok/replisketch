import styled from "styled-components"
import * as React from "react"
import { useShapes } from "frontend/useShapes"
import { RenderedShape } from "./RenderedShape"

interface CanvasProps {
  children: React.ReactNode
}

export const Canvas = React.memo(function Canvas({ children }: CanvasProps) {
  const { shapes } = useShapes()

  return (
    <Svg>
      <g transform={`translate(0,0)`}>
        <g id="shapes">
          {shapes.map(([k, v]) => (
            <RenderedShape key={k} shape={v} />
          ))}
        </g>
        <g id="others">{children}</g>
      </g>
    </Svg>
  )
})

const Svg = styled.svg`
  background-color: rgb(248, 249, 250);
  width: 100%;
  height: 100%;
`
