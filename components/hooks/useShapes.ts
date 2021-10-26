import { useSubscribe } from "replicache-react"
import { Shape } from "types"
import { useRep } from "./useRep"

export function useShapes() {
  const { rep, roomId } = useRep()
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
