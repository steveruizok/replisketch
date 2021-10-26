import * as React from "react"
import { ToolType } from "types"
import { Tool } from "../tools/Tool"
import { useRep } from "./useRep"

/*
# Tools

Tools work like states in a finite state machine: 

  - there are several tools that all implement the same interface; 
  - one tool is always "selected"; and
  - there can only ever be one tool selected at a time.

## Events

This hook will forward events to the selected tool, which may deal
with the event in different ways.

## Current Path

Along with the events, the hook will also forward the `currentPath`,
an SVG path that the tool may modify while a user is drawing a new 
shape; i.e. before the shape is committed to the document.

## Changing Tools

You can change tools by using the `onToolSelect` method. When you
select a tool, the previously selected tool will run its `onDeselect`
method, and the newly selected tool will run its `onSelect` method.
*/

export function useTool() {
  const { tools } = useRep()

  const [selectedTool, setSelectedTool] = React.useState<ToolType>(
    ToolType.Draw
  )

  const rSelectedTool = React.useRef<Tool>(tools.draw)

  const rCurrentPath = React.useRef<SVGPathElement>()

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      rSelectedTool.current.onPointerDown?.(e, rCurrentPath.current)
    },
    []
  )

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      rSelectedTool.current.onPointerMove?.(e, rCurrentPath.current)
    },
    []
  )

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId)
      rSelectedTool.current.onPointerUp?.(e, rCurrentPath.current)
    },
    []
  )

  const onToolSelect = React.useCallback(
    (tool: ToolType) => {
      setSelectedTool(tool)
      rSelectedTool.current.onDeselect?.(rCurrentPath.current)
      rSelectedTool.current = tools[tool]
      rSelectedTool.current.onSelect?.(rCurrentPath.current)
    },
    [tools]
  )

  return {
    selectedTool,
    rCurrentPath,
    onToolSelect,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
