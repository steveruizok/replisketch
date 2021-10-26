import * as React from "react"
import styled from "styled-components"
import { Shape, ToolType } from "types"
import { useCtx } from "./hooks/useCtx"

interface ToolbarProps {
  roomId: string
  selectedTool: ToolType
  onToolSelect: (tool: ToolType) => void
}
export const Toolbar = React.memo(function Canvas({
  roomId,
  selectedTool,
  onToolSelect,
}: ToolbarProps) {
  const { rep, tools, actions } = useCtx()

  const onToolClick = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onToolSelect(e.currentTarget.id as ToolType)
    },
    [onToolSelect]
  )

  const onClearClick = React.useCallback(() => {
    actions.deleteAllShapes()
  }, [actions])

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
      <Title>Room ID: {roomId}</Title>
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
  align-items: center;
  z-index: 2;
  font-size: 13px;
  font-weight: 500;
  user-select: none;
`

const Spacer = styled.div`
  flex-grow: 2;
`

const Button = styled.button<{ isActive?: boolean }>`
  font-size: inherit;
  font-weight: inherit;
  background: none;
  height: 100%;
  padding: 0 12px;
  border: none;
  text-decoration: ${({ isActive }) => (isActive ? "underline" : "none")};
`

const Title = styled.div``

const killEvent = (e: React.PointerEvent) => e.stopPropagation()
