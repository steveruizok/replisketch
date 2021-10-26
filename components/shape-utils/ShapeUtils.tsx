import { Bounds, Rep, Shape, ShapeType } from "types"

export abstract class ShapeUtils<T extends Shape> {
  abstract type: ShapeType

  constructor(protected rep: Rep, protected roomId: string) {}

  abstract defaultShape(): T

  abstract Component(props: { shape: T }): JSX.Element

  abstract getBounds(shape: T): Bounds

  create(props: Partial<T>): T {
    const order = this.rep.scan({ prefix: `${this.roomId}/shape/` }).keys.length

    const shape: T = {
      ...this.defaultShape(),
      childIndex: order,
      ...props,
    }

    this.rep.mutate.createShape({ roomId: this.roomId, shape })

    return shape
  }

  update(shape: T, changes: Partial<T>): void
  update(id: string, changes: Partial<T>): void
  update(arg: T | string, changes: Partial<T>) {
    const id = typeof arg === "string" ? arg : arg["id"]
    this.rep.mutate.updateShape({ roomId: this.roomId, id, changes })
  }

  delete(shape: T): void
  delete(id: string): void
  delete(arg: T | string) {
    const id = typeof arg === "string" ? arg : arg["id"]
    this.rep.mutate.deleteShape({ roomId: this.roomId, id })
  }
}
