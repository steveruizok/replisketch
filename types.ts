import { GetShapeUtils } from "components/shape-utils"
import {
  JSONObject,
  ReadonlyJSONObject,
  Replicache,
  WriteTransaction,
} from "replicache"

/* --------------------- Shapes --------------------- */

export enum ShapeType {
  Dot = "dot",
  Draw = "draw",
  Rect = "rect",
}

interface BaseShape extends JSONObject, ReadonlyJSONObject {
  id: string
  type: ShapeType
  point: number[]
  childIndex: number
}

export interface DotShape extends BaseShape {
  type: ShapeType.Dot
}

export interface DrawShape extends BaseShape {
  type: ShapeType.Draw
  points: number[][]
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

/* -------------------- Database -------------------- */

export type ShapeData = {
  id: string
  roomId: string
  shape: Shape
  version: number
  deleted: boolean
}

export type Mutation =
  | { id: number; name: "createShape"; args: { roomId: string; shape: Shape } }
  | { id: number; name: "deleteShape"; args: { roomId: string; id: string } }
  | {
      id: number
      name: "updateShape"
      args: { roomId: string; id: string; changes: Partial<Shape> }
    }

export type Mutators = {
  [K in Mutation["name"]]: (
    tx: WriteTransaction,
    args: Extract<Mutation, { name: K }>["args"]
  ) => Promise<void>
}

export type Rep = Replicache<Mutators>

export type ActionCtx = {
  rep: Rep
  roomId: string
  getShapeUtils: GetShapeUtils
}

export interface Client {
  id: string
  point: number[]
  tempShape: null | Shape
  color: string
}

/* --------------------- Generic -------------------- */

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
