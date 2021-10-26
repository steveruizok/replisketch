import * as React from "react"
import { Replicache } from "replicache"
import { Rep, Shape, ShapeType, ToolType } from "types"
import { DrawTool, EraserTool, RectTool, SelectTool, Tool } from "../tools"
import { getActions } from "../actions"
import { mutators } from "frontend/mutators"
import {
  DotUtils,
  DrawUtils,
  RectUtils,
  ShapeUtils,
  GetShapeUtils,
  ShapeUtilsMap,
} from "components/shape-utils"
import Pusher, { PresenceChannel } from "pusher-js"

export type RepContext = {
  rep: Rep
  channel: PresenceChannel
  tools: {
    [K in ToolType]: Tool
  }
  getShapeUtils: GetShapeUtils
  roomId: string
  actions: ReturnType<typeof getActions>
}

export const repContext = React.createContext<RepContext>({} as RepContext)

export function useSetup(roomId: string) {
  const [ctx, setCtx] = React.useState<RepContext | null>(null)

  React.useEffect(() => {
    if (ctx) return
    ;(async () => {
      // Connect Replicache
      const PUSH_ENDPOINT = `/api/push?roomId=${roomId}`
      const PULL_ENDPOINT = `/api/pull?roomId=${roomId}`

      const rep = new Replicache({
        pushURL: PUSH_ENDPOINT,
        pullURL: PULL_ENDPOINT,
        mutators,
        useMemstore: process.env.NODE_ENV === "development",
      })

      // Connect Pusher and subscribe to room
      const channel = new Pusher(process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
        authEndpoint: "/api/pusher-auth",
      })

      const presenceChannel = channel.subscribe(
        "presence-" + roomId
      ) as PresenceChannel

      presenceChannel.bind("poke", () => rep.pull())

      // See shape-utils/about-shape-utils.md
      const shapeUtils: ShapeUtilsMap = {
        [ShapeType.Dot]: new DotUtils(rep, roomId),
        [ShapeType.Draw]: new DrawUtils(rep, roomId),
        [ShapeType.Rect]: new RectUtils(rep, roomId),
      }

      const getShapeUtils = <T extends Shape>(type: T | T["type"]) => {
        return (
          typeof type === "string" ? shapeUtils[type] : shapeUtils[type.type]
        ) as ShapeUtils<T>
      }

      // Shared actions
      const actions = getActions({ rep, roomId, getShapeUtils })

      // See tools/about-tools.md
      const tools: {
        [K in ToolType]: Tool
      } = {
        [ToolType.Select]: new SelectTool(rep, actions, getShapeUtils),
        [ToolType.Eraser]: new EraserTool(rep, actions, getShapeUtils),
        [ToolType.Draw]: new DrawTool(rep, actions, getShapeUtils),
        [ToolType.Rect]: new RectTool(rep, actions, getShapeUtils),
      }

      setCtx({
        rep,
        channel: presenceChannel,
        tools,
        roomId,
        getShapeUtils,
        actions,
      })

      function leave() {
        channel.disconnect()
        rep.close()
      }

      window.addEventListener("beforeunload", leave)

      return () => {
        leave()
        window.removeEventListener("beforeunload", leave)
      }
    })()
  }, [ctx, roomId])

  return ctx
}
