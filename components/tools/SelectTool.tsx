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

  onSelect() {
    this.state = { type: "idle" }
  }

  onPointerDown(e: React.PointerEvent<HTMLDivElement>) {}

  onPointerMove(e: React.PointerEvent<HTMLDivElement>) {}

  onPointerUp(e: React.PointerEvent<HTMLDivElement>) {}
}
