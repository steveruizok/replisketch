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

  Icon(): JSX.Element {
    return <span>Eraser</span>
  }

  override onSelect(): void {
    this.state = { type: "idle" }
  }

  override onPointerDown(e: React.PointerEvent<HTMLDivElement>): void {
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

  override onPointerMove(e: React.PointerEvent<HTMLDivElement>): void {
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

  override onPointerUp(e: React.PointerEvent<HTMLDivElement>): void {
    this.state = { type: "idle" }
  }
}
