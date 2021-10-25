import { JSONObject, ReadonlyJSONObject } from "replicache"

/* --------------------- Shapes --------------------- */

export enum ShapeType {
  Dot = "dot",
  Draw = "draw",
  Rect = "rect",
}

interface BaseShape extends JSONObject, ReadonlyJSONObject {
  id: string
  type: ShapeType
  childIndex: number
}

export interface DotShape extends BaseShape {
  type: ShapeType.Dot
  x: number
  y: number
}

export interface DrawShape extends BaseShape {
  type: ShapeType.Draw
  points: number[]
}

export interface RectShape extends BaseShape {
  type: ShapeType.Rect
  point: number[]
  size: number[]
}

export type Shape = DrawShape | DotShape | RectShape

/* ---------------------- Tools --------------------- */

export enum ToolType {
  Select = "select",
  Eraser = "eraser",
  Draw = "draw",
  Rect = "rect",
}

export type ShapeData = {
  id: string
  shape: Shape
  version: number
  deleted: boolean
}

export interface Bounds {
  minX: number
  maxX: number
  midX: number
  midY: number
  minY: number
  maxY: number
  width: number
  height: number
}

export type Mutation =
  | { id: number; name: "createShape"; args: Shape }
  | { id: number; name: "deleteShape"; args: string }
  | { id: number; name: "updateShape"; args: Partial<Shape> }
