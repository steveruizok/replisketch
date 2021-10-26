import Vec from "@tldraw/vec"
import { nanoid } from "nanoid"
import getStroke from "perfect-freehand"
import { DotShape, DrawShape, Shape, ShapeType, ToolType } from "types"
import { getSvgPathFromStroke } from "utils/getSvgPathFromStroke"
import { Tool } from "./Tool"

type State =
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
      shape: DrawShape
    }

export class DrawTool extends Tool {
  type = ToolType.Draw as const

  state: State = { type: "idle" }

  Icon() {
    return <span>Draw</span>
  }

  onSelect() {
    this.state = { type: "idle" }
  }

  onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    switch (this.state.type) {
      case "idle": {
        const point = Vec.round([e.clientX, e.clientY])
        this.state = {
          type: "pointing",
          origin: point,
        }
      }
    }
  }

  onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const point = Vec.round([e.clientX, e.clientY])

    switch (this.state.type) {
      case "idle": {
        return
      }

      case "pointing": {
        if (Vec.dist(point, this.state.origin) < 3) return

        const points = [this.state.origin, point]

        this.state = {
          ...this.state,
          type: "dragging",
          shape: {
            id: nanoid(),
            type: ShapeType.Draw,
            point: [0, 0],
            points,
            childIndex: 1,
          },
        }

        return this.state.shape
      }
      case "dragging": {
        this.state.shape = {
          ...this.state.shape,
          points: [...this.state.shape.points, point],
        }

        return this.state.shape
      }
    }
  }

  onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const point = Vec.round([e.clientX, e.clientY])
    let lastShape: null | Shape = null

    switch (this.state.type) {
      case "idle": {
        return
      }
      case "pointing": {
        lastShape = {
          id: nanoid(),
          type: ShapeType.Dot,
          point,
          childIndex: 1,
        }
        this.actions.createShape(lastShape)
        break
      }
      case "dragging": {
        lastShape = {
          ...this.state.shape,
          points: [...this.state.shape.points, point],
        }
        this.actions.createShape(lastShape)
        break
      }
    }

    this.state = { type: "idle" }
    return lastShape
  }
}
