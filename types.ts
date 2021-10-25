import { JSONObject, ReadonlyJSONObject } from "replicache"

export enum ShapeType {
  Dot = "dot",
  Line = "line",
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

export interface LineShape extends BaseShape {
  type: ShapeType.Line
  points: number[]
}

export type Shape = LineShape | DotShape

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
