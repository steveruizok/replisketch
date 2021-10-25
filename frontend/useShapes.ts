import { useSubscribe } from "replicache-react"
import { Shape } from "types"
import { rep } from "./replicache"

export function useShapes() {
  const shapes = useSubscribe(
    rep,
    async (tx) => {
      const list = (await tx
        .scan({ prefix: "shape/" })
        .entries()
        .toArray()) as [string, Shape][]

      list.sort(([, { childIndex: a }], [, { childIndex: b }]) => a - b)

      return list
    },
    []
  )

  return { shapes }
}
