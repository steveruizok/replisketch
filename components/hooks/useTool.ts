import * as React from "react"
import { Shape, ToolType } from "types"
import { throttle } from "utils/throttle"
import { Tool } from "../tools/Tool"
import { useCtx } from "./useCtx"

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

Tool events can optionally return a temporary shape to be rendered
while the user is drawing, but before being committed to the document.
This temporary shape will be shared via the presence channel.

## Changing Tools

You can change tools by using the `onToolSelect` method. When you
select a tool, the previously selected tool will run its `onDeselect`
method, and the newly selected tool will run its `onSelect` method.
*/

export function useTool() {
  const { tools, room } = useCtx()

  const [tempShape, setTempShape] = React.useState<Shape | void | null>()

  const [selectedTool, setSelectedTool] = React.useState<ToolType>(
    ToolType.Draw
  )

  const rSelectedTool = React.useRef<Tool>(tools.draw)

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      const res = rSelectedTool.current.onPointerDown?.(e)
      if (res !== undefined) {
        setTempShape(res)
        room.updatePresence({
          tempShape: res,
        })
      }
    },
    []
  )

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const res = rSelectedTool.current.onPointerMove?.(e)
      if (res !== undefined) {
        setTempShape(res)
        room.updatePresence({
          tempShape: res,
        })
      }
    },
    []
  )

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId)
      const res = rSelectedTool.current.onPointerUp?.(e)
      setTempShape(null) // Always clear on pointer up
      if (res) {
        room.updatePresence({
          tempShape: null,
        })
      }
    },
    []
  )

  const onToolSelect = React.useCallback(
    (tool: ToolType) => {
      setSelectedTool(tool)
      setTempShape(null)
      rSelectedTool.current.onDeselect?.()
      rSelectedTool.current = tools[tool]
      rSelectedTool.current.onSelect?.()
    },
    [tools]
  )

  return {
    tempShape,
    selectedTool,
    onToolSelect,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
