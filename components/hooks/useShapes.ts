import { useSubscribe } from "replicache-react"
import { Shape } from "types"
import { useCtx } from "./useCtx"

export function useShapes() {
  const { rep, roomId } = useCtx()
  const shapes = useSubscribe(
    rep,
    async (tx) => {
      const list = (await tx
        .scan({ prefix: `${roomId}/shape/` })
        .entries()
        .toArray()) as [string, Shape][]

      list.sort(([, { childIndex: a }], [, { childIndex: b }]) => a - b)

      return list
    },
    []
  )

  return { shapes }
}
