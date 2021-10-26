import * as React from "react"
import styled from "styled-components"
import { Canvas } from "./Canvas"
import { Toolbar } from "./Toolbar"
import { useTool } from "./hooks/useTool"
import { useSetup, repContext } from "./hooks/useSetup"
import { LiveCursors } from "./LiveCursors"
import { RenderedShape } from "./RenderedShape"

export interface EditorProps {
  roomId: string
}

export function Editor({ roomId }: EditorProps) {
  const ctx = useSetup(roomId)

  if (!ctx) return <div>Loading...</div>

  return (
    <repContext.Provider value={ctx}>
      <WithContextEditor roomId={roomId} />
    </repContext.Provider>
  )
}

function WithContextEditor({ roomId }: EditorProps) {
  const { tempShape, selectedTool, onToolSelect, ...events } = useTool()

  return (
    <Container {...events}>
      <Canvas tempShape={tempShape} />
      <Toolbar
        roomId={roomId}
        selectedTool={selectedTool}
        onToolSelect={onToolSelect}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  touch-action: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
