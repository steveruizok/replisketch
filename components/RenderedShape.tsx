import * as React from "react"
import { Shape } from "types"
import { useCtx } from "./hooks/useCtx"

interface RenderedShapeProps<T extends Shape> {
  shape: T
}

export const RenderedShape = React.memo(function RenderedShape<
  T extends Shape
>({ shape }: RenderedShapeProps<T>) {
  const { getShapeUtils } = useCtx()
  const utils = getShapeUtils(shape.type)
  const Component = utils.Component.bind(utils) as (props: {
    shape: T
  }) => JSX.Element
  return <Component shape={shape} />
})
