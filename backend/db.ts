import { createClient } from "@supabase/supabase-js"

import pgInit from "pg-promise"

export const supabase = createClient(
  "https://tyfgutbhydnymlxpfbua.supabase.co",
  process.env.SUPABASE_PUBLIC_ANON_KEY
)

// At this point, only used to initialize database

const pgp = pgInit()

export const db = pgp(process.env.REPLICHAT_DB_CONNECTION_STRING)
