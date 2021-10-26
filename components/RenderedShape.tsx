import * as React from "react"
import { Shape } from "types"
import { useRep } from "./hooks/useRep"

interface RenderedShapeProps<T extends Shape> {
  shape: T
}

export const RenderedShape = React.memo(function RenderedShape<
  T extends Shape
>({ shape }: RenderedShapeProps<T>) {
  const { getShapeUtils } = useRep()
  const utils = getShapeUtils(shape.type)
  const Component = utils.Component.bind(utils) as (props: {
    shape: T
  }) => JSX.Element
  return <Component shape={shape} />
})
