import * as React from "react"
import { deleteShapesAtPoint } from "frontend/actions"
import { ToolType } from "types"
import { tools } from "../tools"
import { Tool } from "../tools/Tool"

export function useTool() {
  const rCurrentPath = React.useRef<SVGPathElement>()

  const rCurrentTool = React.useRef<Tool>(tools.draw)

  const [tool, setTool] = React.useState<ToolType>(ToolType.Draw)

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      if (e.ctrlKey || e.metaKey) {
        deleteShapesAtPoint([e.clientX, e.clientY])
      } else {
        rCurrentTool.current.onPointerDown?.(e, rCurrentPath.current)
      }
    },
    []
  )

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      rCurrentTool.current.onPointerMove?.(e, rCurrentPath.current)
    },
    []
  )

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId)
      rCurrentTool.current.onPointerUp?.(e, rCurrentPath.current)
    },
    []
  )

  const onToolSelect = React.useCallback((tool: ToolType) => {
    setTool(tool)
    rCurrentTool.current.onDeselect?.(rCurrentPath.current)
    rCurrentTool.current = tools[tool]
    rCurrentTool.current.onSelect?.(rCurrentPath.current)
  }, [])

  return {
    tool,
    rCurrentPath,
    onToolSelect,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
