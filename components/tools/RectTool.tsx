import Vec from "@tldraw/vec"
import { nanoid } from "nanoid"
import { RectShape, Shape, ShapeType, ToolType } from "types"
import { getBoundsAtPoint, getBoundsFromTwoPoints } from "utils/bounds"
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
      point: number[]
      shape: RectShape
    }

export class RectTool extends Tool {
  type = ToolType.Rect as const

  state: State = { type: "idle" }

  Icon() {
    return <span>Rect</span>
  }

  override onSelect() {
    this.state = { type: "idle" }
  }

  override onPointerDown(e: React.PointerEvent<HTMLDivElement>): void {
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

  override onPointerMove(e: React.PointerEvent<HTMLDivElement>): void {
    const point = Vec.round([e.clientX, e.clientY])

    switch (this.state.type) {
      case "idle": {
        return
      }
      case "pointing": {
        if (Vec.dist(point, this.state.origin) < 3) return

        const bounds = getBoundsFromTwoPoints(this.state.origin, point)
        const { minX: x, minY: y, width: w, height: h } = bounds

        this.state = {
          ...this.state,
          type: "dragging",
          point,
          shape: {
            id: nanoid(),
            type: ShapeType.Rect,
            point: [x, y],
            size: [w, h],
            childIndex: 1,
          },
        }
      }
      case "dragging": {
        const bounds = getBoundsFromTwoPoints(this.state.origin, point)
        const { minX: x, minY: y, width: w, height: h } = bounds

        this.state = {
          ...this.state,
          type: "dragging",
          point,
          shape: {
            ...this.state.shape,
            point: [x, y],
            size: [w, h],
          },
        }
      }
    }
  }

  override onPointerUp(e: React.PointerEvent<HTMLDivElement>): void {
    const point = Vec.round([e.clientX, e.clientY])
    let lastShape: null | Shape = null

    switch (this.state.type) {
      case "idle": {
        return
      }
      case "pointing": {
        const bounds = getBoundsAtPoint(point, 100)
        lastShape = {
          id: nanoid(),
          type: ShapeType.Rect,
          point: [bounds.minX, bounds.minY],
          size: [bounds.width, bounds.height],
          childIndex: 1,
        }
        this.getShapeUtils(ShapeType.Rect).create(lastShape)
        break
      }
      case "dragging": {
        lastShape = this.state.shape
        this.getShapeUtils(ShapeType.Rect).create(this.state.shape)
        break
      }
    }

    this.state = { type: "idle" }
  }
}
