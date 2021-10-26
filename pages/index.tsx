import * as React from "react"
import dynamic from "next/dynamic"
import type { EditorProps } from "components/Editor"
import { GetServerSideProps } from "next"
import { supabase } from "backend/db"
const Editor = dynamic<EditorProps>(
  () => import("components/Editor").then((t) => t.Editor),
  { ssr: false }
)

export default function Home() {
  return <Editor roomId="home" />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { roomId } = ctx.query

  const t = await supabase.from("room").select().eq("id", "home")

  if (t.body.length === 0) {
    // Create the room
    await supabase.from("room").insert({
      id: "home",
      name: "New Room",
      url: "/",
    })
  }

  return {
    props: {},
  }
}
