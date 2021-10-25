import * as React from "react"
import styled from "styled-components"
import { usePusher } from "frontend/usePusher"
import { Canvas } from "./Canvas"
import { Toolbar } from "./Toolbar"
import { useTool } from "./tools/useTool"

export function Editor() {
  usePusher("default")

  const { rCurrentPath, tool, onToolSelect, ...events } = useTool()

  return (
    <Container {...events}>
      <Canvas>
        <path ref={rCurrentPath} fill="black" />
      </Canvas>
      <Toolbar selectedTool={tool} onToolSelect={onToolSelect} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
