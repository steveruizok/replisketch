import * as React from "react"
import { Replicache } from "replicache"
import { Rep, Shape, ShapeType, ToolType } from "types"
import { DrawTool, EraserTool, RectTool, SelectTool, ToolsMap } from "../tools"
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
  tools: ToolsMap
  getShapeUtils: GetShapeUtils
  roomId: string
  synced: boolean
  actions: ReturnType<typeof getActions>
}

export const repContext = React.createContext<RepContext>({} as RepContext)

export function useSetup(roomId: string) {
  const [ctx, setCtx] = React.useState<RepContext | null>(null)

  React.useEffect(() => {
    if (ctx) return

    const setup = async () => {
      // Connect Replicache
      const rep = new Replicache({
        pushURL: `/api/push?roomId=${roomId}`,
        pullURL: `/api/pull?roomId=${roomId}`,
        mutators,
        name: roomId,
        useMemstore: process.env.NODE_ENV === "development",
      })

      // Update context once synced
      rep.onSync = (syncing) => {
        if (syncing) {
          setCtx((ctx) => ({
            ...ctx,
            synced: syncing,
          }))
        }
      }

      // Connect Pusher and subscribe to room
      const channel = new Pusher(process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
        authEndpoint: "/api/pusher-auth",
      })
        .subscribe("presence-" + roomId)
        .bind("poke", () => rep.pull())

      // See shape-utils/about-shape-utils.md
      const shapeUtils: ShapeUtilsMap = {
        [ShapeType.Dot]: new DotUtils(rep, roomId),
        [ShapeType.Draw]: new DrawUtils(rep, roomId),
        [ShapeType.Rect]: new RectUtils(rep, roomId),
      }

      // See shape-utils/about-shape-utils.md
      const getShapeUtils = <T extends Shape>(type: T | T["type"]) => {
        if (typeof type === "string") return shapeUtils[type] as ShapeUtils<T>
        return shapeUtils[type.type] as ShapeUtils<T>
      }

      // See actions/about-actions.md
      const actions = getActions({ rep, roomId, getShapeUtils })

      // See tools/about-tools.md
      const tools: ToolsMap = {
        [ToolType.Select]: new SelectTool(rep, actions, getShapeUtils),
        [ToolType.Eraser]: new EraserTool(rep, actions, getShapeUtils),
        [ToolType.Draw]: new DrawTool(rep, actions, getShapeUtils),
        [ToolType.Rect]: new RectTool(rep, actions, getShapeUtils),
      }

      // Set the context
      setCtx({
        rep,
        synced: false,
        channel: channel as PresenceChannel,
        tools,
        roomId,
        getShapeUtils,
        actions,
      })

      // Cleanup on exit
      function leave() {
        channel.disconnect()
        rep.close()
      }

      window.addEventListener("beforeunload", leave)

      return () => {
        leave()
        window.removeEventListener("beforeunload", leave)
      }
    }

    setup()
  }, [ctx, roomId])

  return ctx
}
