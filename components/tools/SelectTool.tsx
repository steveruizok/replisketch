import { ToolType } from "types"
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
      points: number[][]
    }

export class SelectTool extends Tool {
  type = ToolType.Rect as const

  state: State = { type: "idle" }

  Icon() {
    return <span>Select</span>
  }

  override onSelect() {
    this.state = { type: "idle" }
  }

  override onPointerDown(e: React.PointerEvent<HTMLDivElement>): void {}

  override onPointerMove(e: React.PointerEvent<HTMLDivElement>): void {}

  override onPointerUp(e: React.PointerEvent<HTMLDivElement>): void {}
}
