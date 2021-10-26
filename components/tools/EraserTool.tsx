import Vec from "@tldraw/vec"
import { ToolType } from "types"
import { Tool } from "./Tool"

type State =
  | {
      type: "idle"
    }
  | {
      type: "dragging"
      origin: number[]
    }

export class EraserTool extends Tool {
  type = ToolType.Rect as const

  state: State = { type: "idle" }

  Icon() {
    return <span>Eraser</span>
  }

  onSelect(path: SVGPathElement) {
    this.state = { type: "idle" }
    path.setAttribute("fill", "none")
    path.setAttribute("stroke-width", "3")
    path.setAttribute("stroke", "black")
  }

  onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    switch (this.state.type) {
      case "idle": {
        const point = Vec.round([e.clientX, e.clientY])
        this.state = {
          type: "dragging",
          origin: point,
        }

        this.actions.deleteShapesAtPoint(point)
      }
    }
  }

  onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const point = Vec.round([e.clientX, e.clientY])

    switch (this.state.type) {
      case "idle": {
        return
      }
      case "dragging": {
        this.state = {
          ...this.state,
          type: "dragging",
        }

        this.actions.deleteShapesAtPoint(point)
        break
      }
    }
  }

  onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    this.state = { type: "idle" }
  }
}
