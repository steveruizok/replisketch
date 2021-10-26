# Actions

Actions are ways of mutating the state. They are more complex than simple mutations and may include logic to run many mutations.

```ts
export async function deleteAllShapes(this: ActionCtx) {
  const shapes = await this.rep.scan({ prefix: "shape/" }).values().toArray()

  shapes.forEach((shape: Shape) => {
    this.rep.mutate.deleteShape({ roomId: this.roomId, id: shape.id })
  })
}
```

To make dependency injection a little easier, the functions are bound to an `ActionCtx` object containing `roomId`, `getShapeUtils`, and `rep`.

To create a new action, create a file with the name of the action e.g. `myAction.ts` that exports an async function like this:

```ts
export async function myAction(this: ActionCtx, ...args: any[]) {
  // Your code here
}
```

Next, in _actions/index.ts_, add the action to the object returned by the `getActions` function.

```ts
import { myAction } from "./myAction"

export function getActions(actionCtx: ActionCtx) {
  return {
    // ...
    myAction: myAction.bind(actionCtx),
  }
}
```

The action will not be available throughout the app either from the context returned by `useRep`:

```ts
function Component() {
  const { actions } = useRep()

  //...
}
```

Or in a `Tool`:

```ts

export class RectTool extends Tool {
  // ...

  onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    this.actions.myAction()
  }
```
