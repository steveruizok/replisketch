import styled from "styled-components"
import * as React from "react"
import { Shape, ShapeType } from "types"
import { usePusher } from "frontend/usePusher"
import { getShapeUtils } from "frontend/shapes"
import { getSvgPathFromStroke } from "utils/getSvgPathFromStroke"
import getStroke from "perfect-freehand"
import Vec from "@tldraw/vec"
import { Canvas } from "./Canvas"
import { rep } from "frontend/replicache"
import {
  boundsCollide,
  getBoundsFromTwoPoints,
  pointInBounds,
} from "utils/bounds"

type States =
  | {
      type: "idle"
    }
  | {
      type: "pointing"
      origin: number[]
    }
  | {
      type: "dragging"
      origin: number[]
      points: number[][]
    }

export function Editor() {
  const rState = React.useRef<States>({ type: "idle" })
  const rCurrentPath = React.useRef<SVGPathElement>()

  // Initialize Pusher
  usePusher("default")

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (rState.current.type === "idle") {
        const point = Vec.round([e.clientX, e.clientY])
        rState.current = {
          type: "pointing",
          origin: point,
        }
      } else {
        rState.current = { type: "idle" }
      }
    },
    []
  )

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const point = Vec.round([e.clientX, e.clientY])
      const currentPath = rCurrentPath.current
      const state = rState.current

      if (state.type === "idle") {
        return
      } else if (state.type === "pointing") {
        if (Vec.dist(point, state.origin) < 3) return

        rState.current = {
          ...state,
          type: "dragging",
          points: [state.origin, point],
        }

        currentPath.setAttribute(
          "d",
          getSvgPathFromStroke(getStroke(rState.current.points))
        )
      } else if (state.type === "dragging") {
        state.points.push(point)
        currentPath.setAttribute(
          "d",
          getSvgPathFromStroke(getStroke(state.points))
        )
      }
    },
    []
  )

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const state = rState.current
      const point = Vec.round([e.clientX, e.clientY])

      if (state.type === "idle") {
        return
      } else if (state.type === "pointing") {
        if (e.ctrlKey || e.metaKey) {
          deleteShapesAtPoint(point)
        } else {
          getShapeUtils(ShapeType.Dot).create({
            x: e.clientX,
            y: e.clientY,
          })
        }
      } else {
        getShapeUtils(ShapeType.Line).create({
          points: state.points.reduce((acc, cur) => {
            acc.push(cur[0], cur[1])
            return acc
          }, [] as number[]),
        })
      }

      // Clear the client path
      const currentPath = rCurrentPath.current
      currentPath!.setAttribute("d", "")

      // Reset the state
      rState.current = { type: "idle" }
    },
    []
  )

  return (
    <Container
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <Canvas>
        <path ref={rCurrentPath} fill="black" />
      </Canvas>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

async function deleteShapesAtPoint(point: number[]) {
  const eraser = getBoundsFromTwoPoints(
    Vec.sub(point, [16, 16]),
    Vec.add(point, [16, 16])
  )

  const shapes = await rep.scan({ prefix: "shape/" }).values().toArray()

  shapes
    .filter((shape: Shape) => {
      const utils = getShapeUtils(shape)
      const bounds = utils.getBounds(shape)
      return boundsCollide(bounds, eraser) || pointInBounds(point, bounds)
    })
    .forEach((shape: Shape) => {
      rep.mutate.deleteShape(shape.id)
    })
}
