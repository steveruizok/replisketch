import { getShapeUtils } from "frontend/shapes"
import React from "react"
import { Shape } from "types"

interface RenderedShapeProps<T extends Shape> {
  shape: T
}

export const RenderedShape = React.memo(function RenderedShape<
  T extends Shape
>({ shape }: RenderedShapeProps<T>) {
  const utils = getShapeUtils(shape.type)
  const Component = utils.render.bind(utils) as (props: {
    shape: T
  }) => JSX.Element
  return <Component shape={shape} />
})
