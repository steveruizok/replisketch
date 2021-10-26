import * as React from "react"
import { createClient, LiveList, Room } from "@liveblocks/client"
import { Live, Shape, ShapeType, ToolType } from "types"
import { DrawTool, EraserTool, RectTool, SelectTool, Tool } from "../tools"
import { getActions } from "../actions"
import {
  DotUtils,
  DrawUtils,
  RectUtils,
  ShapeUtils,
  GetShapeUtils,
  ShapeUtilsMap,
} from "components/shape-utils"
import { useStorage } from "@liveblocks/react"
import { nanoid } from "nanoid"

export type RepContext = {
  roomId: string
  room: Room
  live: Live
  tools: {
    [K in ToolType]: Tool
  }
  getShapeUtils: GetShapeUtils
  actions: ReturnType<typeof getActions>
}

export const repContext = React.createContext<RepContext>({} as RepContext)

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY,
})

export function useSetup(roomId: string) {
  const [ctx, setCtx] = React.useState<RepContext | null>(null)

  React.useEffect(() => {
    if (ctx) return

    client.enter(roomId)

    const setup = async () => {
      const room = client.getRoom(roomId)

      room.updatePresence({
        id: nanoid(),
        point: [0, 0],
        color: "black",
        tempShape: null,
      })

      const storage = await room.getStorage<{
        shapes: LiveList<Shape>
      }>()

      if (!storage.root.get("shapes")) {
        storage.root.set("shapes", new LiveList<Shape>())
      }

      const live = storage.root

      const shapeUtils: ShapeUtilsMap = {
        [ShapeType.Dot]: new DotUtils(live, roomId),
        [ShapeType.Draw]: new DrawUtils(live, roomId),
        [ShapeType.Rect]: new RectUtils(live, roomId),
      }

      const getShapeUtils = <T extends Shape>(type: T | T["type"]) => {
        return (
          typeof type === "string" ? shapeUtils[type] : shapeUtils[type.type]
        ) as ShapeUtils<T>
      }

      const actions = getActions({ live, getShapeUtils })

      const tools: {
        [K in ToolType]: Tool
      } = {
        [ToolType.Select]: new SelectTool(live, actions, getShapeUtils),
        [ToolType.Eraser]: new EraserTool(live, actions, getShapeUtils),
        [ToolType.Draw]: new DrawTool(live, actions, getShapeUtils),
        [ToolType.Rect]: new RectTool(live, actions, getShapeUtils),
      }

      setCtx({
        roomId,
        room,
        live,
        getShapeUtils,
        tools,
        actions,
      })
    }

    setup()

    function leave() {
      client.leave(roomId)
    }

    window.addEventListener("beforeunload", leave)

    return () => {
      window.removeEventListener("beforeunload", leave)
    }
  }, [ctx, roomId])

  return ctx
}
