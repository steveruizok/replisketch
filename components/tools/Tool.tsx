import { getActions } from "components/actions"
import { GetShapeUtils } from "components/shape-utils"
import { Rep, Shape, ToolType } from "types"

export abstract class Tool {
  abstract type: ToolType

  abstract Icon({ isSelected }: { isSelected: boolean }): JSX.Element

  constructor(
    protected rep: Rep,
    protected actions: ReturnType<typeof getActions>,
    protected getShapeUtils: GetShapeUtils
  ) {}

  onSelect?(): void

  onDeselect?(): void

  onPointerDown?(e: React.PointerEvent<HTMLDivElement>): Shape | null | void

  onPointerMove?(e: React.PointerEvent<HTMLDivElement>): Shape | null | void

  onPointerUp?(e: React.PointerEvent<HTMLDivElement>): Shape | null | void
}
