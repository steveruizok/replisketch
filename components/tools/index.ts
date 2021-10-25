import { ToolType } from "types"
import { DrawTool } from "./DrawTool"
import { EraserTool } from "./EraserTool"
import { RectTool } from "./RectTool"
import { SelectTool } from "./SelectTool"
import { Tool } from "./Tool"

export const tools: Record<ToolType, Tool> = {
  [ToolType.Select]: new SelectTool(),
  [ToolType.Eraser]: new EraserTool(),
  [ToolType.Draw]: new DrawTool(),
  [ToolType.Rect]: new RectTool(),
}
