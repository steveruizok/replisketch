import * as React from "react"
import { repContext } from "./useSetup"

export function useCtx() {
  return React.useContext(repContext)
}
