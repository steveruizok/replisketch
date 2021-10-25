import { Replicache } from "replicache"
import { mutators } from "./mutators"

const PUSH_ENDPOINT = "/api/push"
const PULL_ENDPOINT = "/api/pull"

export const rep = new Replicache({
  pushURL: PUSH_ENDPOINT,
  pullURL: PULL_ENDPOINT,
  mutators,
  // When in development, don't use indexdb
  useMemstore: process.env.NODE_ENV === "development",
})
