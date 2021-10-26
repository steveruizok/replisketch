import Vec from "@tldraw/vec"
import { getShapeUtils } from "components/shapes"
import getStroke from "perfect-freehand"
import { ShapeType, ToolType } from "types"
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
      points: number[][]
    }

export class DrawTool extends Tool {
  type = ToolType.Draw as const

  state: State = { type: "idle" }

  Icon() {
    return <span>Draw</span>
  }

  onSelect(path: SVGPathElement) {
    this.state = { type: "idle" }
    path.setAttribute("fill", "black")
    path.setAttribute("stroke-width", "0")
    path.setAttribute("stroke", "none")
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

        const points = [this.state.origin, point]

        this.state = {
          ...this.state,
          type: "dragging",
          points,
        }

        const stroke = getSvgPathFromStroke(getStroke(points))
        path.setAttribute("d", stroke)

        break
      }
      case "dragging": {
        this.state.points.push(point)
        const stroke = getSvgPathFromStroke(getStroke(this.state.points))
        path.setAttribute("d", stroke)
        break
      }
    }
  }

  onPointerUp(e: React.PointerEvent<HTMLDivElement>, path: SVGPathElement) {
    const point = Vec.round([e.clientX, e.clientY])

    switch (this.state.type) {
      case "idle": {
        return
      }
      case "pointing": {
        {
          getShapeUtils(ShapeType.Dot).create({
            x: e.clientX,
            y: e.clientY,
          })
        }
        break
      }
      case "dragging": {
        getShapeUtils(ShapeType.Draw).create({
          points: this.state.points.reduce((acc, cur) => {
            acc.push(cur[0], cur[1])
            return acc
          }, [] as number[]),
        })
      }
    }

    // Clear the client path
    path.setAttribute("d", "")

    // Reset the state
    this.state = { type: "idle" }
  }
}
