import { createClient } from "@supabase/supabase-js"

import pgInit from "pg-promise"

// At this point, pg is only used to initialize database; from
// there we use supbase's client API

export const supabase = createClient(
  "https://tyfgutbhydnymlxpfbua.supabase.co",
  process.env.SUPABASE_PUBLIC_ANON_KEY
)

const pgp = pgInit()

export const db = pgp(process.env.REPLICHAT_DB_CONNECTION_STRING)
