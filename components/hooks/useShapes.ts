import React from "react"
import { Shape } from "types"
import { useCtx } from "./useCtx"

export function useShapes() {
  const { live } = useCtx()

  const [shapes, setShapes] = React.useState<Shape[]>([])

  React.useEffect(() => {
    function handleChange() {
      setShapes(live.get("shapes").toArray())
    }

    handleChange()
    live.get("shapes").subscribe(handleChange)

    return () => {
      live.get("shapes").unsubscribe(handleChange)
    }
  }, [live])

  return { shapes }
}
