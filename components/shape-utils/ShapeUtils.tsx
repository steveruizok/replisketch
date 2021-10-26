import { LiveList } from "@liveblocks/client"
import { Bounds, Live, Shape, ShapeType } from "types"

export abstract class ShapeUtils<T extends Shape> {
  abstract type: ShapeType

  constructor(protected live: Live, protected roomId: string) {}

  abstract defaultShape(): T

  abstract Component(props: { shape: T }): JSX.Element

  abstract getBounds(shape: T): Bounds

  create(props: Partial<T>): T {
    const order = this.live.get("shapes").length

    const shape: T = {
      ...this.defaultShape(),
      childIndex: order,
      ...props,
    }

    this.live.get("shapes").push(shape)

    return shape
  }
}
