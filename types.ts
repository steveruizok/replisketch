import { LiveList, LiveObject } from "@liveblocks/client"
import { GetShapeUtils } from "components/shape-utils"

/* --------------------- Shapes --------------------- */

export enum ShapeType {
  Dot = "dot",
  Draw = "draw",
  Rect = "rect",
}

interface BaseShape {
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

export type Live = LiveObject<{
  shapes: LiveList<Shape>
}>

export type ActionCtx = {
  live: Live
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
