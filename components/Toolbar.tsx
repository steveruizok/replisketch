import styled from "styled-components"
import * as React from "react"
import { Shape, ToolType } from "types"
import { rep } from "frontend/replicache"
import { tools } from "./tools"

interface ToolbarProps {
  selectedTool: ToolType
  onToolSelect: (tool: ToolType) => void
}
export const Toolbar = React.memo(function Canvas({
  selectedTool,
  onToolSelect,
}: ToolbarProps) {
  const onToolClick = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onToolSelect(e.currentTarget.id as ToolType)
    },
    [onToolSelect]
  )

  const onClearClick = React.useCallback(() => {
    deleteAllShapes()
  }, [])

  return (
    <Container onPointerDown={killEvent}>
      {Object.entries(tools).map(([key, tool]) => {
        return (
          <Button
            key={key}
            id={key}
            isActive={selectedTool === key}
            onPointerDown={onToolClick}
          >
            <tool.Icon isSelected={selectedTool === key} />
          </Button>
        )
      })}
      <Spacer />

      <Button onPointerDown={onClearClick}>Clear</Button>
    </Container>
  )
})

const Container = styled.div`
  position: fixed;
  height: 40px;
  width: 100%;
  border-bottom: 1px solid black;
  background-color: white;
  display: flex;
  z-index: 2;
`

const Spacer = styled.div`
  flex-grow: 2;
`

const Button = styled.button<{ isActive?: boolean }>`
  background: none;
  height: 100%;
  padding: 0 16px;
  border: none;
  text-decoration: ${({ isActive }) => (isActive ? "underline" : "none")};
`

const killEvent = (e: React.PointerEvent) => e.stopPropagation()

async function deleteAllShapes() {
  const shapes = await rep.scan({ prefix: "shape/" }).values().toArray()

  shapes.forEach((shape: Shape) => {
    rep.mutate.deleteShape(shape.id)
  })
}
