import * as React from "react"
import { repContext } from "./useSetup"

export function useRep() {
  return React.useContext(repContext)
}
