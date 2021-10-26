# Shape Utils

In this app, shapes are utility classes that each serves a specific shape.

## Methods

For example, `RectUtils` is a `RectUtils<RectShape>` and handles all aspects of the `RectShape`. If we wanted to know the bounding box size of a `RectShape` named `myRect`, we could call `RectUtils.getBounds(myRect)`.

## Rendering with ShapeUtil.Component

A `ShapeUtil` also contains a React component used to render the shape. This component is called by the `RenderedShape` component and receives the following props:

- `shape`: The shape to render.

## `getShapeUtils`

The `getShapeUtils` function is a helper for accessing the shape utils for a specific shape or type of shape. You can pass in either the shape or its type.

```ts
getShapeUtils(myShape)
```

```ts
getShapeUtils(ShapeType.Rect)
```

You can also provide the type of shape as a generic in order to get the shape utils for that type. This is useful in many circumstances where you want to access typed methods for a shape.

```ts
shapes
  .filter((shape) => shape.type === ShapeType.Rect)
  .forReach((shape) => {
    getShapeUtils<RectShape>(shape)
    // ...
  })
```
