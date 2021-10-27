import { getActions } from "components/actions"
import { GetShapeUtils } from "components/shape-utils"
import { Rep, ToolType } from "types"

export abstract class Tool {
  abstract type: ToolType

  constructor(
    protected rep: Rep,
    protected actions: ReturnType<typeof getActions>,
    protected getShapeUtils: GetShapeUtils
  ) {}

  abstract Icon({ isSelected }: { isSelected: boolean }): JSX.Element

  onSelect?(): void

  onDeselect?(): void

  onPointerDown?(e: React.PointerEvent<HTMLDivElement>): void

  onPointerMove?(e: React.PointerEvent<HTMLDivElement>): void

  onPointerUp?(e: React.PointerEvent<HTMLDivElement>): void
}

export type ToolsMap = {
  [K in ToolType]: Tool
}
