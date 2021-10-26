import Vec from "@tldraw/vec"
import { ShapeType, ToolType } from "types"
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
    }

export class RectTool extends Tool {
  type = ToolType.Rect as const

  state: State = { type: "idle" }

  Icon() {
    return <span>Rect</span>
  }

  onSelect(path: SVGPathElement) {
    this.state = { type: "idle" }
    path.setAttribute("fill", "none")
    path.setAttribute("stroke-width", "5")
    path.setAttribute("stroke", "black")
    path.setAttribute("stroke-line-join", "round")
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

  onPointerMove(e: React.PointerEvent<HTMLDivElement>, path: SVGPathElement) {
    const point = Vec.round([e.clientX, e.clientY])

    switch (this.state.type) {
      case "idle": {
        return
      }

      case "pointing": {
        if (Vec.dist(point, this.state.origin) < 3) return

        this.state = {
          ...this.state,
          type: "dragging",
          point,
        }

        this.drawRect(path)
        break
      }
      case "dragging": {
        this.state = {
          ...this.state,
          type: "dragging",
          point,
        }

        this.drawRect(path)
        break
      }
    }
  }

  onPointerUp(e: React.PointerEvent<HTMLDivElement>, path: SVGPathElement) {
    switch (this.state.type) {
      case "idle": {
        return
      }
      case "pointing": {
        const point = Vec.round([e.clientX, e.clientY])
        const bounds = getBoundsAtPoint(point, 100)

        this.getShapeUtils(ShapeType.Rect).create({
          point: [bounds.minX, bounds.minY],
          size: [bounds.width, bounds.height],
        })
        break
      }
      case "dragging": {
        const bounds = getBoundsFromTwoPoints(
          this.state.origin,
          this.state.point
        )

        this.getShapeUtils(ShapeType.Rect).create({
          point: [bounds.minX, bounds.minY],
          size: [bounds.width, bounds.height],
        })
      }
    }

    // Clear the client path
    path.setAttribute("d", "")

    // Reset the state
    this.state = { type: "idle" }
  }

  private drawRect(path: SVGPathElement) {
    if (this.state.type !== "dragging") return

    const bounds = getBoundsFromTwoPoints(this.state.origin, this.state.point)

    const { minX: x, minY: y, width: w, height: h } = bounds

    path.setAttribute("d", `M ${x},${y} h ${w} v ${h} h ${-w} Z`)
  }
}
