import { rep } from "frontend/replicache"
import React from "react"
import { Bounds, Shape, ShapeType } from "types"

export abstract class ShapeUtil<T extends Shape> {
  abstract type: ShapeType

  abstract defaultShape(): T

  abstract render(props: { shape: T }): JSX.Element

  abstract getBounds(shape: T): Bounds

  create(props: Partial<T>): T {
    const shape = {
      ...this.defaultShape(),
      ...props,
    }

    rep.mutate.createShape(shape)

    return shape
  }

  async update(changes: Partial<T>) {
    rep.mutate.updateShape(changes)
  }

  async delete(id: string) {
    rep.mutate.deleteShape(id)
  }
}
