import styled from "styled-components"
import * as React from "react"
import Vec from "@tldraw/vec"
import getStroke from "perfect-freehand"
import { Shape, ShapeType } from "types"
import { usePusher } from "frontend/usePusher"
import { getShapeUtils } from "frontend/shapes"
import { getSvgPathFromStroke } from "utils/getSvgPathFromStroke"
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
      e.currentTarget.setPointerCapture(e.pointerId)

      const state = rState.current
      switch (state.type) {
        case "idle": {
          const point = Vec.round([e.clientX, e.clientY])
          rState.current = {
            type: "pointing",
            origin: point,
          }
        }
      }
    },
    []
  )

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const point = Vec.round([e.clientX, e.clientY])
      const currentPath = rCurrentPath.current
      const state = rState.current

      switch (state.type) {
        case "idle": {
          return
        }
        case "pointing": {
          if (Vec.dist(point, state.origin) < 3) return

          const points = [state.origin, point]

          rState.current = {
            ...state,
            type: "dragging",
            points,
          }

          const stroke = getSvgPathFromStroke(getStroke(points))
          currentPath.setAttribute("d", stroke)

          break
        }
        case "dragging": {
          state.points.push(point)
          const stroke = getSvgPathFromStroke(getStroke(state.points))
          currentPath.setAttribute("d", stroke)
          break
        }
      }
    },
    []
  )

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId)

      const state = rState.current
      const point = Vec.round([e.clientX, e.clientY])

      switch (state.type) {
        case "idle": {
          return
        }
        case "pointing": {
          if (e.ctrlKey || e.metaKey) {
            deleteShapesAtPoint(point)
          } else {
            getShapeUtils(ShapeType.Dot).create({
              x: e.clientX,
              y: e.clientY,
            })
          }
          break
        }
        case "dragging": {
          getShapeUtils(ShapeType.Line).create({
            points: state.points.reduce((acc, cur) => {
              acc.push(cur[0], cur[1])
              return acc
            }, [] as number[]),
          })
        }
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
