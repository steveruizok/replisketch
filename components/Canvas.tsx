import styled from "styled-components"
import * as React from "react"
import { Shape, ShapeType } from "types"
import { usePusher } from "frontend/usePusher"
import { useShapes } from "frontend/useShapes"
import { getShapeUtils } from "frontend/shapes"
import { nanoid } from "nanoid"
import { getSvgPathFromStroke } from "utils/getSvgPathFromStroke"
import getStroke from "perfect-freehand"
import Vec from "@tldraw/vec"
import { RenderedShape } from "./RenderedShape"

interface CanvasProps {
  children: React.ReactNode
}

export function Canvas({ children }: CanvasProps) {
  const { shapes } = useShapes()

  return (
    <Svg>
      {shapes.map(([k, v]) => (
        <RenderedShape key={k} shape={v} />
      ))}
      {children}
    </Svg>
  )
}

const Svg = styled.svg`
  background-color: rgb(248, 249, 250);
  width: 100%;
  height: 100%;
`
