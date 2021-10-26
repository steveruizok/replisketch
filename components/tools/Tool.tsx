import { getActions } from "components/actions"
import { GetShapeUtils } from "components/shape-utils"
import { Rep, ToolType } from "types"

export abstract class Tool {
  abstract type: ToolType

  abstract Icon({ isSelected }: { isSelected: boolean }): JSX.Element

  constructor(
    protected rep: Rep,
    protected actions: ReturnType<typeof getActions>,
    protected getShapeUtils: GetShapeUtils
  ) {}

  onSelect?(currentPath: SVGPathElement): void

  onDeselect?(currentPath: SVGPathElement): void

  onPointerDown?(
    e: React.PointerEvent<HTMLDivElement>,
    currentPath: SVGPathElement
  ): void

  onPointerMove?(
    e: React.PointerEvent<HTMLDivElement>,
    currentPath: SVGPathElement
  ): void

  onPointerUp?(
    e: React.PointerEvent<HTMLDivElement>,
    currentPath: SVGPathElement
  ): void
}
